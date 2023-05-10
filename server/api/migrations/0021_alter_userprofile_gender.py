# Generated by Django 4.1.7 on 2023-04-28 08:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_alter_userprofile_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='gender',
            field=models.CharField(choices=[('Male', 'Male'), ('Female', 'Female'), ('PreferNotSay', 'Prefer Not to Say')], default=('PreferNotSay', 'Prefer Not To Say'), max_length=20),
        ),
    ]