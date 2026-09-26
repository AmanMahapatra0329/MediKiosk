from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from .serializers import PrescriptionSerializer
from .models import Prescription

# Create your views here.
class PrescriptionCreation(CreateAPIView):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer