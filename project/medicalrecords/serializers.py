from rest_framework import serializers
from .models import MedicalRecord

class MedicalRecordObjectCreationSerializer(serializers.ModelSerializer):
    class Meta : 
        model = MedicalRecord
        fields = [
            'appointment',
            'chief_complaint',
            'history_of_current_illness',
            'medical_history',
            'bp',
            'pulse',
            'temp',
            'oxygen_saturation',
            'diagnosis',
            'treatment_plan',
            'doctor_notes',
        ]

class GetMedicalRecordObjectSerializer(serializers.ModelSerializer):
    class Meta :
        model = MedicalRecord
        fields = '__all__'