# Generated by Django 5.0.2 on 2024-04-24 05:48

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0023_user_image'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Message',
        ),
    ]
