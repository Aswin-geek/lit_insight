# Generated by Django 5.0.2 on 2024-04-17 16:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0018_alter_plan_plan_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='plan',
            name='price',
            field=models.FloatField(default=30),
            preserve_default=False,
        ),
    ]