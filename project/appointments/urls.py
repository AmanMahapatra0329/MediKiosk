from django.urls import path
from . import views

urlpatterns = [
    path('patient/dashboard/appointment/',views.PatientAppointmentView,name='homepage'),
    path('api/create/appointment/',views.AppointmentCreation.as_view(),name='appointmentcreation'),
    path('api/fetch/data/appointmentobjects/',views.AppointmentObjectsView.as_view(),name='appointmentobjects'),
    path('api/fetch/data/docportal/appointmentobjects/',views.DocPortalAppointmentObjectsView.as_view(),name='docprotalappointmentobjects')
]