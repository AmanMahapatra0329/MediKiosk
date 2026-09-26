from django.urls import path
from . import views

urlpatterns = [
    # path('api/list/prescriptions/',)
    path('display/detail/prescription/',views.PrescriptionCreation.as_view()),
]
