from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    type = models.CharField(max_length=10)
    balance=models.FloatField(default=0)
    status=models.BooleanField(default=True)
    image=models.ImageField(upload_to='images/',null=True,blank=True)

    
class Genre(models.Model):
    name=models.CharField(max_length=25,unique=True)
    status=models.BooleanField(default=True)
    
    def __str__(self):
        return self.name
    
class Book(models.Model):
    Book_Name=models.CharField(max_length=50,unique=True)
    author_id=models.ForeignKey(User, on_delete=models.CASCADE)
    genre_id=models.ForeignKey(Genre, on_delete=models.CASCADE)
    image=models.ImageField(upload_to='images/',null=True,blank=True)
    copy=models.FileField(upload_to='files/',null=True,blank=True)
    book_views=models.IntegerField(default=0)
    status=models.BooleanField(default=True)
    
class Review(models.Model):
    Description=models.CharField(max_length=300)
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    book_id=models.ForeignKey(Book, on_delete=models.CASCADE)
    rating=models.FloatField(default=3)
    status=models.BooleanField(default=True)

class Likes(models.Model):
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    review_id=models.ForeignKey(Review, on_delete=models.CASCADE)
    
class Book_Like(models.Model):
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    book_id=models.ForeignKey(Book, on_delete=models.CASCADE)
    
class Comments(models.Model):
    Description=models.CharField(max_length=100)
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    review_id=models.ForeignKey(Review, on_delete=models.CASCADE)
    
class Room(models.Model):
    first_user=models.ForeignKey(User, db_column='user_1',related_name="user_1", on_delete=models.CASCADE)
    second_user=models.ForeignKey(User, db_column='user_2',related_name="user_2", on_delete=models.CASCADE)
    
class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.CharField(max_length=100)

    def __str__(self):
        return str(self.message)
    
class Plan(models.Model):
    Plan_Name=models.CharField(max_length=20)
    validity=models.IntegerField()
    price=models.FloatField()
    status=models.BooleanField(default=True)
    
class Subscription(models.Model):
    user_id=models.ForeignKey(User, on_delete=models.CASCADE)
    plan_id=models.ForeignKey(Plan, on_delete=models.CASCADE)
    purchased=models.DateField(default=timezone.now)
    
class Upcoming(models.Model):
    Book_Name=models.CharField(max_length=50,unique=True)
    author_id=models.ForeignKey(User, on_delete=models.CASCADE)
    genre_id=models.ForeignKey(Genre, on_delete=models.CASCADE)
    image=models.ImageField(upload_to='images/',null=True,blank=True)
    status=models.BooleanField(default=True)