from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from accounts.permissions import IsDoctor,IsPatient
from django.contrib.auth.decorators import login_required
from patients.models import QuestionFile
from rest_framework import status

# Create your views here.
@login_required
def PatientDashboard(request):
    return render(request,'patients/patientdashboard.html')

login_required
def PrescriptionRender(request):
    return render(request,'patients/prescription.html')

login_required
def BillingRender(request):
    return render(request,'patients/billing.html')

login_required
def SettingsRender(request):
    return render(request,'patients/settings.html')


class PostQuestionResponse(APIView):
    permission_classes = [IsAuthenticated,IsPatient]
    def post(self,request):
        question_file,created = QuestionFile.objects.get_or_create(user=request.user)
        question_number = question_file.question_counter + 1
        if question_number < 10:
            question_file.question_counter = question_number
            question_file.save()
        else: 
            question_file.question_counter = -1
            question_number = 0
            question_file.save()

        return Response({"question_number":question_number},status=status.HTTP_200_OK)



class getQuestions(APIView):
    permission_classes = [IsAuthenticated,IsPatient]
    def get(self,request,question_id):
        questions = [
            "Welcome to kiosk , What brings you in today?",
            "Could you tell us more about the symptoms you're experiencing.",
            "How long the symptoms have been bothering you?",
            "Do you have any allergies?",
            "Are you currently taking any medications?",
            "Do you have any pre-existing medical conditions?",
            "Do you have a family history of any medical conditions?",
            "Do you have any smoking or drinking habits?",
            "Do you exercise regularly?",
            "Your response has been recorded , a doctor will review it and get back to you soon.",
        ]
        if 0 <= question_id < len(questions):
            question = questions[question_id]
        else:
            question = questions[-1]
        return Response({"question":question},status=status.HTTP_200_OK)