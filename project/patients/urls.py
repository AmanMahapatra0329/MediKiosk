from django.urls import path
from patients import views

urlpatterns = [
     path('api/dashboard/',views.PatientDashboard,name='patientdashboard'),
     path('dashboard/prescriptions/',views.PrescriptionRender,name='prescription'),
     path('dashboard/billing/',views.BillingRender,name='billing'),
     path('dashboard/settings/',views.SettingsRender,name='settings'),
     path('api/get/questions/<int:question_id>/',views.getQuestions.as_view(),name='getquestions'),
     path('api/post/response/',views.PostQuestionResponse.as_view(),name='postresponse'),
]