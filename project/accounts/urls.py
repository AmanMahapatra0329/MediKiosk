from django.urls import path,include
from accounts import views
# from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

urlpatterns = [
    path('api/registration/',views.RegistrationView.as_view(),name='registrationview'),
    path('page/codeverification/',views.VerificationPage,name='verificationpage'),
    path('api/login/',views.CookieTokenObtainPairView.as_view(),name='tokenobtain'),
    path('api/token/refresh/',views.CookieTokenRefreshView.as_view(),name='tokenrefresh'),
    path('page/forgotpassword/',views.ForgotPassword,name='forgotpass'),
    path('api/emailverification/',views.EmailVerificationView.as_view()),
    path("api/passwordreset/",views.PasswordResetEmailVerification.as_view(),name="password_reset_email"),
    path("api/passwordreset/verify/",views.PasswordResetVerify.as_view(),name="password_reset_verify"),
    path("api/passwordreset/confirm/",views.PasswordResetConfirm.as_view(),name="password_reset_confirm"),
    path('api/resetmailverification/',views.PasswordResetEmailVerification.as_view()),
    path('api/resetmailverification/',views.NewPassword,name='newpasspage'),
    path('api/logout/',views.LogOutView.as_view(),name='logout'),
    path('api/data/patientdashboard/',views.PatientDashboardData.as_view(),name='patientdashboarddata'),
    path('api/doctors/registration/',views.DoctorRegistration.as_view(),name='docregistration'),
    path('api/roledata/',views.StaffRole.as_view(),name='roledata'),
    path('api/doctors/dashboard/',views.DoctorDashboard,name='doctordashboard'),
    path('api/doctordata/',views.DoctorData.as_view(),name='doctordata'),
]