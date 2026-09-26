from django.db import models
from django.contrib.auth.models import User
from doctors.models import Doctors
from patients.models import Patient
# Create your models here.
class Appointment(models.Model):
    class Status(models.TextChoices):
        PENDING = 'Pending' , 'Pending'
        CONFIRMED = 'Confirmed' , 'Confirmed'
        COMPLETED = 'Completed' , 'Completed'
        CANCELED = 'Canceled' , 'Canceled'
        RESCHEDULED = 'Rescheduled' , 'Rescheduled'
    
    patient = models.ForeignKey(Patient,on_delete=models.CASCADE)
    doctor = models.ForeignKey(Doctors,on_delete=models.CASCADE,null=True,blank=True)
    preferred_date = models.DateField()
    preferred_date = models.TimeField()
    symptoms = models.TextField()
    symptoms_duration = models.CharField(max_length=100)
    urgency_score = models.FloatField(null=True,blank=True)
    scheduled_date = models.DateField(null=True,blank=True)
    scheduled_time = models.TimeField(null=True,blank=True)
    created_date = models.DateField(auto_now_add=True)
    status = models.CharField(max_length=11,choices=Status.choices,default='Pending')

    def __str__(self):
        return f"{self.patient.name} - {self.status}"
