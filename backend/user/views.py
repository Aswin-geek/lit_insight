from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import *
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserLoginSerializer
from .models import User, Genre
from rest_framework.views import APIView
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django.core.mail import send_mail
import random
from django.db.models import Q
from django.conf import settings
from django.shortcuts import redirect
import razorpay
from django.utils import timezone
from datetime import timedelta
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication

class CheckEmail(APIView):
    def post(self, request):
        email=request.data['email']
        if User.objects.filter(email=email).exists():
            return Response(status=status.HTTP_226_IM_USED) 
        else:
            return Response(status=status.HTTP_202_ACCEPTED)       

class UserRegistrationView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        data=request.data
        password=make_password(data['password'])
        data['password']=password
        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():  
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            # Perform authentication (e.g., check credentials)
            # Assuming you have a CustomUser model
            print(email,password)
            user = User.objects.filter(email=email).first()
            print(user)
            myuser = authenticate(username=user.username,password=password)
            print(myuser)
            if myuser and user.status==True:
                refresh = RefreshToken.for_user(myuser)
                # login(request, user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'type': str(user.type),
                    'id': str(user.id),
                    'status': user.status
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class AdminLoginView(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():  
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            # Perform authentication (e.g., check credentials)
            # Assuming you have a CustomUser model
            print(email,password)
            user = User.objects.filter(email=email).first()
            myuser = authenticate(username=user.username,password=password)
            print(myuser)
            if myuser and user.is_superuser:
                print(user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'type': 'is_admin'
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserListAPIView(APIView):
    def get(self, request):
        users = User.objects.filter(type='author')  # Fetch all users
        serializer = UserSerializer(users, many=True)  # Serialize data (optional)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    def get(self, request, id):
        user=User.objects.get(id=id)
        serializer = UserSerializer(user)
        return Response(serializer.data, status=200)

class OtpMail(APIView):
    def post(self, request):
        email=request.data['email']
        otp=random.randint(1000,9999)
        subject = 'Your OTP for Login'
        message = f'Your OTP is: {otp}'
        from_email = 'aswintjimca18@gmail.com'
        recipient_list = [email]
        send_mail(subject, message, from_email, recipient_list)
        print(otp)
        return Response(otp,status=status.HTTP_200_OK)
    
class Genres(APIView):
    def post(self, request):
        serializer = GenreSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data, status=201)
        return Response(status=status.HTTP_226_IM_USED)
    
    def get(self, request):
        genres = Genre.objects.filter(status=True)
        serializer = GenreSerializer(genres, many=True)
        return Response(serializer.data)

    def put(self, request):
        pk=request.data['id']
        genre = Genre.objects.get(id=pk)
        if not genre:
            return Response({'message': 'Genre not found'}, status=404)
        serializer = GenreSerializer(genre, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        print(request.data)
        genre = Genre.objects.get(id=pk)
        if not genre:
            return Response({'message': 'Genre not found'}, status=404)
        genre.status=False
        genre.save()
        return Response({'message': 'Genre deleted successfully'}, status=200)
    
class UserList(APIView):
    def get(self, request, type):
        users=User.objects.all().exclude(is_superuser=True)
        serializer=UserSerializer(users, many=True)
        return Response(serializer.data)
    
    def put(self, request, id):
        user=User.objects.get(id=id)
        user.status=not user.status
        user.save()
        user=User.objects.get(id=id)
        serializer=UserSerializer(user)
        return Response(serializer.data)
    
class Books(APIView):
    def post(self, request):     
        serializer=BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            id=serializer['id'].value
            new_book=Book.objects.get(id=id)
            serializer=ViewBookSerializer(new_book)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
    def get(self, request, author_id):
        books=Book.objects.select_related('genre_id').filter(author_id=author_id,status=True)
        serializer=ViewBookSerializer(books, many=True)
        return Response(serializer.data)

    def put(self, request):
        pk=request.data['id']  
        print(request.data)
        try:
            image=request.data['image']
        except:
            image=None
        try:
            copy=request.data['copy']
        except:
            copy=None     
        print(image,copy)
        book=Book.objects.get(id=pk)
        if not book:
            return Response({'message': 'Book not found'}, status=404)
        if image:
            book.image=image
        if copy:
            book.copy=copy
        book.save()
        serializer = EditBookSerializer(book, data=request.data)
        if serializer.is_valid():
            serializer.save()
            id=serializer['id'].value
            new_book=Book.objects.get(id=id)
            serializer=ViewBookSerializer(new_book)
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        book = Book.objects.get(id=pk)
        if not book:
            return Response({'message': 'Book not found'}, status=404)
        book.status=False
        book.save()
        return Response({'message': 'Book deleted successfully'}, status=200)
    
    
class ViewBook(APIView):
    def get(self, request):
        books=Book.objects.filter(status=True)
        serializer=ViewBookSerializer(books, many=True)
        return Response(serializer.data)
    

class Reviews(APIView):
    def post(self, request):
        user_id=request.data['user_id']
        book_id=request.data['book_id']
        if Review.objects.filter(user_id=user_id,book_id=book_id,status=True).exists():
            return Response(status=status.HTTP_226_IM_USED)
        serializer=ReviewSerializer(data=request.data)
        serializer.is_valid()
        print(serializer.errors)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
    def get(self, request):
        reviews=Review.objects.filter(rating__lt=4,status=True)
        serializer=ViewReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    def put(self, request):
        print(request.data)
        review_id=request.data['id']
        review=Review.objects.get(id=review_id)
        serializer=EditReviewSerializer(review, data=request.data)
        serializer.is_valid()
        print("hi",serializer.errors)
        if serializer.is_valid():
            serializer.save()
            review=Review.objects.get(id=review_id)
            serializer=ViewReviewSerializer(review)
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)
    
    def delete(Self, request, id):
        review=Review.objects.get(id=id)
        if not review:
            return Response({'message': 'Review not found'}, status=404)
        review.status=False
        review.save()
        return Response({'message': 'Book deleted successfully'}, status=200)
    
class ViewReviews(APIView):
    def get(self, request, user_id):
        reviews=Review.objects.filter(user_id=user_id,status=True)
        serializer=ViewReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
class AuthorReviews(APIView):
    def get(self, request, id):
        author_books = Book.objects.filter(author_id=id)
        all_reviews = []
        for book in author_books:
            reviews = Review.objects.filter(book_id=book.id,status=True)
            all_reviews.extend(reviews)
        print(all_reviews)
        serializer=ViewReviewSerializer(all_reviews, many=True)
        return Response(serializer.data)
    
class AdminReviews(APIView):
    def get(self, request):
        reviews=Review.objects.all()
        serializer=ViewReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    def delete(self, request, id):
        review=Review.objects.get(id=id)
        review.status=not review.status
        review.save()
        serializer=ViewReviewSerializer(review)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
class View_Post(APIView):
    def get(self, request, id):
        review=Review.objects.get(id=id)
        serializer=ViewReviewSerializer(review)
        return Response(serializer.data)
    
class Like(APIView):
    def post(self, request):
        print(request.data)
        user_id=request.data['user_id']
        review_id=request.data['review_id']
        like=Likes.objects.filter(user_id=user_id,review_id=review_id)
        like_count=like.count()
        if like:
            return Response({'like':True, 'like_count':like_count})
        else:
            return Response({'like':False, 'like_count':like_count})
        
    def put(self, request):
        user_id=request.data['user_id']
        review_id=request.data['review_id']
        like=Likes.objects.filter(user_id=user_id,review_id=review_id)
        if like:
            like.delete()
        else:
            serializer=LikeSerializer(data=request.data)
            if serializer.is_valid():
                print(serializer.errors)
                serializer.save()
        like=Likes.objects.filter(user_id=user_id,review_id=review_id)
        like_count=like.count()
        return Response({'like_count':like_count},status=status.HTTP_200_OK)
    
class Comment(APIView):
    def post(self, request):
        serializer=CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            comment=Comments.objects.select_related('user_id').latest('id')
            serializer=ViewCommentSerializer(comment)
            return Response(serializer.data, status=201)
        else:
            return Response(serializer.errors)
        
    def get(self, request, id):
        comments=Comments.objects.filter(review_id=id).order_by('-id')
        serializer=ViewCommentSerializer(comments, many=True)
        return Response(serializer.data, status=201)
    
class Rooms(APIView):
    def post(self, request):
        user_1=request.data['user_1']
        user_2=request.data['user_2']
        print(type(user_1),type(user_2))
        User_1=User.objects.get(id=user_1)
        User_2=User.objects.get(id=user_2)
        
        if Room.objects.filter(first_user=user_1,second_user=user_2).exists():
            room_id=Room.objects.filter(first_user=user_1,second_user=user_2)
            serializer=RoomSerializer(room_id, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        
        elif Room.objects.filter(first_user=user_2,second_user=user_1).exists():
            room_id=Room.objects.filter(first_user=user_2,second_user=user_1)
            serializer=RoomSerializer(room_id, many=True)
            print(serializer.data)
            return Response(serializer.data, status=200)
        
        else:
            room=Room(first_user_id=User_1.id,second_user_id=User_2.id)
            room.save()
            room_id=Room.objects.latest('id')
            serializer=RoomSerializer(room_id)
            print(serializer.data)
            return Response(serializer.data, status=200)
        
    def get(self, request):
        user_id=request.data['user_id']
        rooms = Room.objects.filter(Q(first_user=user_id) | Q(second_user=user_id))
        return Response(rooms, status=200)
    
class ChatUser(APIView):
    def get(self,request,id):
        users=User.objects.filter(status=True).exclude(id=id).exclude(is_superuser=True)
        serializer=UserListSerializer(users, many=True)
        return Response(serializer.data, status=200)
    
class ChatAuthor(APIView):
    def get(self,request,id):
        users=User.objects.filter(type='user',status=True).exclude(id=id).exclude(is_superuser=True)
        serializer=UserListSerializer(users, many=True)
        return Response(serializer.data, status=200)
    
class Plans(APIView):
    def post(self, request):
        print('1')
        serializer=PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def get(self, request):
        plans=Plan.objects.filter(status=True).order_by('-id')
        serializer=PlanSerializer(plans, many=True)
        return Response(serializer.data, status=200)
    
    def put(self, request):
        id=request.data['id']
        plan=Plan.objects.get(id=id)
        plan.status=False
        plan.save()
        serializer=PlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            plan=Plan.objects.latest('id')
            serializer=PlanSerializer(plan)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, id):
        print('1')
        plan=Plan.objects.get(id=id)
        plan.status=False
        plan.save()
        return Response({'message': 'Plan deleted successfully'}, status=200)
    
class PaymentView(APIView):
    def post(self, request):
        id=request.data['id']
        user_id=request.data['user_id']
        subscribe=Subscription(plan_id_id=id,user_id_id=user_id)
        subscribe.save()
        plan=Plan.objects.get(id=id)
        amount=plan.price*100
        client = razorpay.Client(auth=("rzp_test_DLTeq2nNMzXQkj", "bmng64HRS0muDq1yCGX0m8YS"))
        payment=client.order.create({'amount':amount,'currency':"INR",'payment_capture':'1'})
        pay_id=payment['id']
        return Response({'id':pay_id},status=status.HTTP_200_OK)
    
class View_Upcoming(APIView):
    def get(self, request):
        books=Upcoming.objects.select_related('genre_id').filter(status=True)
        serializer=ViewUpcomingSerializer(books, many=True)
        return Response(serializer.data)
    
class Upcomings(APIView):
    def post(self, request): 
        print('upcoming')    
        serializer=UpcomingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            id=serializer['id'].value
            new_upcoming=Upcoming.objects.get(id=id)
            serializer=ViewUpcomingSerializer(new_upcoming)
            return Response(serializer.data,status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
    
    def get(self, request, pk):
        print(pk)
        books=Upcoming.objects.select_related('genre_id').filter(author_id=pk,status=True)
        serializer=ViewUpcomingSerializer(books, many=True)
        return Response(serializer.data)
    

    def put(self, request):
        pk=request.data['id']  
        print(request.data)
        try:
            image=request.data['image']
        except:
            image=None     
        upcoming=Upcoming.objects.get(id=pk)
        if not upcoming:
            return Response({'message': 'Upcoming not found'}, status=404)
        if image:
            upcoming.image=image
        upcoming.save()
        serializer = EditUpcomingSerializer(upcoming, data=request.data)
        if serializer.is_valid():
            serializer.save()
            id=serializer['id'].value
            new_upcoming=Upcoming.objects.get(id=id)
            serializer=ViewUpcomingSerializer(new_upcoming)
            return Response(serializer.data,status=status.HTTP_200_OK)
        return Response(serializer.errors, status=400)
    
    def delete(self, request, pk):
        upcoming = Upcoming.objects.get(id=pk)
        if not upcoming:
            return Response({'message': 'Upcoming not found'}, status=404)
        upcoming.status=False
        upcoming.save()
        return Response({'message': 'Upcoming deleted successfully'}, status=200)
    
class Top_Reviews(APIView):
    def get(self, request):
        reviews=Review.objects.filter(rating__gte=4,status=True)
        serializer=ViewReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
class User_Home(APIView):
    def get(self, request):
        reviews=Review.objects.filter(status=True)[:3]
        serializer1=ViewReviewSerializer(reviews, many=True)
        books=Book.objects.filter(status=True)[:3]
        serializer2=ViewBookSerializer(books, many=True)
        serializer={'reviews':serializer1.data, 'books':serializer2.data} 
        return Response(data=serializer, status=200)
    
class Profile(APIView):
    def put(self, request):
        id=request.data['id']
        user=User.objects.get(id=id)
        serializer=ProfileSerializer(user, data=request.data)
        serializer.is_valid()
        print(serializer.errors)
        if serializer.is_valid():
            print(serializer.errors)
            serializer.save()
            id=serializer['id'].value
            user=User.objects.get(id=id)
            serializer=UserSerializer(user)
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)
        
class Admin_Home(APIView):
    def get(self, request):
        users=User.objects.filter(type='user',status=True).count()
        authors=User.objects.filter(type='author',status=True).count()
        books=Book.objects.filter(status=True).count()
        reviews=Review.objects.filter(status=True).count()
        return Response({'users':users,'authors':authors,'books':books,'reviews':reviews}, status=200)
    
class Premium_User(APIView):
    def get(self, request, id):
        premium=Subscription.objects.filter(user_id_id=id)
        for each in premium:
            plan=Plan.objects.get(id=each.plan_id_id)
            time_elapsed = timezone.now().date() - each.purchased
            number_of_days = time_elapsed.days
            if number_of_days <= plan.validity:
                return Response({'status':'true'}, status=200)
        return Response({'status':'false'}, status=200)
    
class Messages(APIView):
    def post(self, request):
        print(request.data)
        serializer=MessageSerializer(data=request.data)
        serializer.is_valid()
        print(serializer.errors)
        if serializer.is_valid():
            print('2')
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def get(self, request, id):
        messages=Message.objects.filter(room=id)
        serializer=MessageSerializer(messages, many=True)
        return Response(serializer.data, status=200)
    
class View_Book(APIView):
    def get(self, request, id):
        book=Book.objects.get(id=id)
        serializer_1=ViewBookSerializer(book)
        reviews=Review.objects.filter(book_id=id)
        serializer_2=ViewReviewSerializer(reviews, many=True)
        serializer={'book':serializer_1.data, 'reviews':serializer_2.data}
        return Response(data=serializer, status=200)
    
    def put(self, request, id):
        book=Book.objects.get(id=id)
        book.book_views+=1
        book.save()
        user=User.objects.get(id=book.author_id.id)
        if book.book_views%10 == 0:
            user.balance+=50
            user.save()
        return Response(status=200)
        
class Book_Likes(APIView):
    def post(self, request):
        print(request.data)
        user_id=request.data['user_id']
        book_id=request.data['book_id']
        like=Book_Like.objects.filter(user_id=user_id,book_id=book_id)
        like_count=like.count()
        if like:
            return Response({'like':True, 'like_count':like_count})
        else:
            return Response({'like':False, 'like_count':like_count})
        
    def put(self, request):
        print('1')
        print(request.data)
        user_id=request.data['user_id']
        book_id=request.data['book_id']
        like=Book_Like.objects.filter(user_id=user_id,book_id=book_id)
        if like:
            like.delete()
        else:
            serializer=Book_LikeSerializer(data=request.data)
            serializer.is_valid()
            print(serializer.errors)
            if serializer.is_valid():
                print(serializer.errors)
                serializer.save()
            else:
                print('2')
        like=Book_Like.objects.filter(user_id=user_id,book_id=book_id)
        like_count=like.count()
        return Response({'like_count':like_count},status=status.HTTP_200_OK)
    
