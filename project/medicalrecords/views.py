from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import MedicalRecord
from appointments.models import Appointment
from .serializers import MedicalRecordObjectCreationSerializer,GetMedicalRecordObjectSerializer

# Create your views here.
def MedicalRecordsRender(request):
    return render(request,'medicalrecords/medicalrecords.html')

def MedicalRecordsCreationPageRender(request):
    return render(request,'medicalrecords/createmedicalrecord.html')

class MedicalRecordObjectCreation(CreateAPIView):
    queryset = MedicalRecord.objects.all()
    serializer_class = MedicalRecordObjectCreationSerializer

class GetMedicalRecordObject(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request,appointment_id):
        appointment = Appointment.objects.get(pk = appointment_id)
        record = MedicalRecord.objects.get(appointment = appointment)
        serializer = GetMedicalRecordObjectSerializer(record)
        return Response(serializer.data)