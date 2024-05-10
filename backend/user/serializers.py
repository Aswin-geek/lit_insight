from rest_framework import serializers
from .models import *
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'type', 'status', 'image', 'balance')
        
class UserListSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('id', 'username', 'type', 'status')
        
        
class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
class GenreSerializer(serializers.ModelSerializer):
  class Meta:
    model = Genre
    fields = ('__all__')
    
class BookSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = ('id', 'Book_Name', 'author_id', 'genre_id', 'image', 'copy')
    
class EditBookSerializer(serializers.ModelSerializer):
  class Meta:
    model = Book
    fields = ('id', 'Book_Name', 'genre_id')
    
class ViewBookSerializer(serializers.ModelSerializer):
  genre_id = GenreSerializer()
  author_id=UserSerializer()
  class Meta:
    model = Book
    fields = ('id', 'Book_Name', 'author_id', 'genre_id', 'image', 'copy', 'status', 'book_views')
    
class ReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model=Review
    fields = ('Description', 'user_id', 'book_id', 'rating')
    
class EditReviewSerializer(serializers.ModelSerializer):
  class Meta:
    model=Review
    fields = ('id', 'Description', 'rating')
    
class ViewReviewSerializer(serializers.ModelSerializer):
  user_id=UserSerializer()
  book_id=ViewBookSerializer()
  class Meta:
    model=Review
    fields = ('id', 'Description', 'user_id', 'book_id', 'rating', 'status')

class LikeSerializer(serializers.ModelSerializer):
  class Meta:
    model=Likes
    fields = ('__all__')
    
class Book_LikeSerializer(serializers.ModelSerializer):
  class Meta:
    model=Book_Like
    fields = ('__all__')
    
class CommentSerializer(serializers.ModelSerializer):
  class Meta:
    model=Comments
    fields = ('__all__')
    
class ViewCommentSerializer(serializers.ModelSerializer):
  user_id=UserSerializer()
  class Meta:
    model=Comments
    fields = ('id', 'Description', 'user_id', 'review_id')
    
class RoomSerializer(serializers.ModelSerializer):
  class Meta:
    model=Room
    fields = ('__all__')
   
class PlanSerializer(serializers.ModelSerializer):
  class Meta:
    model=Plan
    fields = ('__all__') 
    
class UpcomingSerializer(serializers.ModelSerializer):
  class Meta:
    model = Upcoming
    fields = ('id', 'Book_Name', 'author_id', 'genre_id', 'image')
    
class EditUpcomingSerializer(serializers.ModelSerializer):
  class Meta:
    model = Upcoming
    fields = ('id', 'Book_Name', 'genre_id')
    
class ViewUpcomingSerializer(serializers.ModelSerializer):
  genre_id = GenreSerializer()
  author_id=UserSerializer()
  class Meta:
    model = Upcoming
    fields = ('id', 'Book_Name', 'author_id', 'genre_id', 'image', 'status' )
    
class ProfileSerializer(serializers.ModelSerializer):
  class Meta:
        model = User
        fields = ('id', 'image')
        
class MessageSerializer(serializers.ModelSerializer):
  class Meta:
        model = Message
        fields = ('__all__')