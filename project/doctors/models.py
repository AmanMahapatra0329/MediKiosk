from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Doctors(models.Model):
    class Sex(models.TextChoices):
        MALE = 'male' , 'Male'
        FEMALE = 'female' , 'Female'
    class Department(models.TextChoices):
        CARDIOLOGY = "Cardiology", "Cardiology"
        NEUROLOGY = "Neurology", "Neurology"
        ORTHOPEDICS = "Orthopedics", "Orthopedics"
        PEDIATRICS = "Pediatrics", "Pediatrics"
        GENERAL_MEDICINE = "General Medicine", "General Medicine"
        GENERAL_SURGERY = "General Surgery", "General Surgery"
        DERMATOLOGY = "Dermatology", "Dermatology"
        GYNECOLOGY = "Gynecology", "Gynecology"
        OPHTHALMOLOGY = "Ophthalmology", "Ophthalmology"
        ENT = "ENT", "Ear, Nose & Throat"
        PSYCHIATRY = "Psychiatry", "Psychiatry"
        RADIOLOGY = "Radiology", "Radiology"
        ANESTHESIOLOGY = "Anesthesiology", "Anesthesiology"
        EMERGENCY = "Emergency", "Emergency Medicine"

    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="doctor")
    employee_id=models.CharField(max_length=20)
    full_name=models.CharField(max_length=100)
    email=models.EmailField()
    phone_number=models.IntegerField()
    date_of_birth=models.DateField()
    gender=models.CharField(max_length=7,choices=Sex.choices)
    department=models.CharField(max_length=30,choices=Department.choices)
    qualification = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    years_of_experience = models.IntegerField()
    joining_date=models.DateField()
    is_active=models.BooleanField(default=True)
    