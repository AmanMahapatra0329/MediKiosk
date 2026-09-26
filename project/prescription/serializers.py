from rest_framework import serializers
from .models import Prescription

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = [
            "appointment",
            "medication_name",
            "dosage",
            "frequency",
            "duration",
            "route",
            "quantity",
            "instructions",
            "prescribed_date",
            "status",
            "doctor_notes",
        ]

        read_only_fields = [
            "prescribed_date",
        ]