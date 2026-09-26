from django.shortcuts import render

# Create your views here.
def DoctorDashboard(request):
    return render(request,'doctors/doctordashboard.html')