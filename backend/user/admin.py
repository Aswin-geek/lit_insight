from django.contrib import admin
from .models import *
# Register your models here.

admin.site.register(User)
admin.site.register(Genre)
admin.site.register(Book)
admin.site.register(Review)
admin.site.register(Likes)
admin.site.register(Comments)
admin.site.register(Room)
admin.site.register(Message)
admin.site.register(Plan)
admin.site.register(Subscription)
admin.site.register(Upcoming)
admin.site.register(Book_Like)