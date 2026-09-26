from django.db import models
from appointments.models import Appointment


class Prescription(models.Model):
    class STATUS(models.TextChoices):
        ACTIVE = "Active", "Active"
        COMPLETED = "Completed", "Completed"
        DISCONTINUED = "Discontinued", "Discontinued"

    appointment = models.ForeignKey(
        Appointment,
        on_delete=models.CASCADE,
        related_name="prescriptions"
    )

    medication_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100)
    duration = models.CharField(max_length=100)
    route = models.CharField(max_length=50)
    quantity = models.PositiveIntegerField()
    instructions = models.TextField()
    prescribed_date = models.DateField(auto_now_add=True)

    status = models.CharField(max_length=20,choices=STATUS.choices,default="Active")

    doctor_notes = models.TextField(blank=True)

    def __str__(self):
        return f"{self.medication_name} - {self.appointment}"