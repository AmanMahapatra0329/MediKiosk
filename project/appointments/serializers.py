from rest_framework import serializers
from .models import Appointment
from patients.models import Patient
from doctors.models import Doctors

class AppointmentSerializer(serializers.Serializer):
    doctor = serializers.CharField()
    reason = serializers.CharField()
    status = serializers.CharField()
    date_of_appointment = serializers.DateTimeField()
    appointment_type = serializers.CharField()
    
    def create(self, validated_data):
        request = self.context['request']
        patient = Patient.objects.get(user=request.user)
        appoint = Appointment.objects.create(patient = patient,
                                   doctor = Doctors.objects.get(employee_id=validated_data['doctor']),
                                   date_of_appointment= validated_data['date_of_appointment'],
                                   reason = validated_data['reason'],
                                   status = validated_data['status'],
                                   appointment_type= validated_data['appointment_type'])
        return appoint

class AppointmentObjectsSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source = 'doctor.full_name', read_only = True)
    patient_name = serializers.CharField(source = 'patient.name', read_only = True)
    class Meta:
        model = Appointment
        fields = ['id',
            'date_of_appointment',
                  'status',
                  'appointment_type',
                  'doctor',
                  'doctor_name',
                  'patient_name']
        