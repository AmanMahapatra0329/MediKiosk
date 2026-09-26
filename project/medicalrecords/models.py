from django.db import models
from appointments.models import Appointment

# Create your models here.
class MedicalRecord(models.Model):
    appointment = models.ForeignKey(Appointment,on_delete=models.CASCADE)
    chief_complaint= models.CharField(max_length=300)
    history_of_current_illness = models.TextField()
    medical_history = models.TextField()
    bp = models.CharField()
    pulse = models.CharField()
    temp = models.CharField()
    oxygen_saturation = models.CharField()
    diagnosis = models.TextField()
    treatment_plan = models.TextField()
    doctor_notes = models.TextField()

