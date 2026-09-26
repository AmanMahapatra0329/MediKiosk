from django.db.models.base import ModelStateFieldsCacheDescriptor
from rest_framework.utils import model_meta
from django.db.models import CASCADE
from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Patient(models.Model):

    class BloodGroup(models.TextChoices):
        O_POSITIVE = "O+", "O Positive"
        O_NEGATIVE = "O-", "O Negative"
        A_POSITIVE = "A+", "A Positive"
        A_NEGATIVE = "A-", "A Negative"
        B_POSITIVE = "B+", "B Positive"
        B_NEGATIVE = "B-", "B Negative"
        AB_POSITIVE = "AB+", "AB Positive"
        AB_NEGATIVE = "AB-", "AB Negative"

    class Sex(models.TextChoices):
        MALE = "male", "Male"
        FEMALE = "female", "Female"

    user=models.OneToOneField(User,on_delete=models.CASCADE,related_name='patient')
    name=models.CharField(max_length=100)
    date_of_birth = models.DateField()
    blood_group = models.CharField(
        max_length=3,
        choices=BloodGroup.choices,
        blank=True,
        null=True
    )
    sex = models.CharField(
        max_length=6,
        choices=Sex.choices
    )

    def __str__(self):
        return self.name

class QuestionFile(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="questionfile")
    question_counter = models.IntegerField(default=-1)

    def __str__(self):
        return self.user.username