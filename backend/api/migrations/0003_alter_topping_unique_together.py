# Generated by Django 4.0.6 on 2022-11-24 18:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_topping'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='topping',
            unique_together={('pizza_owner', 'topping_name')},
        ),
    ]
