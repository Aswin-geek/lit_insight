# Generated by Django 5.0.2 on 2024-03-26 04:24

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0006_book'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='author_id',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
            preserve_default=False,
        ),
    ]
