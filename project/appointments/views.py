from django.shortcuts import render,get_object_or_404
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Appointment
from .serializers import AppointmentSerializer,AppointmentObjectsSerializer
from patients.models import Patient
from doctors.models import Doctors

# Create your views here.
def PatientAppointmentView(request):
    return render(request,'appointments/appointment.html')

class AppointmentCreation(CreateAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

class AppointmentObjectsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        patient = Patient.objects.get(user=request.user)
        appointments = Appointment.objects.filter(patient = patient)
        serializer = AppointmentObjectsSerializer(appointments, many = True)
        return Response (serializer.data,status=status.HTTP_200_OK)

class DocPortalAppointmentObjectsView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        doctor = Doctors.objects.get(user = request.user)
        appointmets = Appointment.objects.filter(doctor = doctor)
        serializer = AppointmentObjectsSerializer(appointmets, many = True)
        return Response(serializer.data,status=status.HTTP_200_OK)
