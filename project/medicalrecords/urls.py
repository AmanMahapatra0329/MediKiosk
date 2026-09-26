from django.urls import path
from . import views

urlpatterns = [
     path('dashboard/medicalrecords/',views.MedicalRecordsRender,name='medicalrecord'),
     path('create/medicalrecords/',views.MedicalRecordsCreationPageRender,name='medicalrecordcreation'),
     path('api/create/object/medicalrecord/',views.MedicalRecordObjectCreation.as_view(),name='medicalrecordobjectcreation'),
     path('api/get/object/medicalrecord/<int:appointment_id>/',views.GetMedicalRecordObject.as_view(),name='getmedicalrecordobject'),
     ]