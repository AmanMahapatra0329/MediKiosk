from django.shortcuts import render,redirect
import secrets
from datetime import timedelta
from django.utils import timezone
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from patients.models import Patient
from doctors.models import Doctors
from accounts.models import VerificationCode,PasswordResetToken
from accounts.serializers import PatientRegistrationSerializer,PatientJsonData,DoctorRegistrationSerializer,DoctorJsonData
from accounts.tokens import email_verification_token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
# from decouple import config


class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self,request,*args,**kwargs):
        response = super().post(request,*args,**kwargs)
        if response.status_code == 200 :
            refresh_token = response.data.get('refresh')
            response.set_cookie(
                key= 'refresh_token',
                value= refresh_token,
                httponly= True,
                secure=False,
                samesite='Lax',
                path='/'
            )
            response.data.pop('refresh',None)
        return response


class CookieTokenRefreshView(TokenRefreshView):
    def post(self,request,*args,**kwargs):
        refres_token = request.COOKIES.get('refresh_token')
        if not refres_token:
            return Response({'message':'Refresh token is missing'},status=status.HTTP_401_UNAUTHORIZED)
        data = request.data.copy()
        data['refresh'] = refres_token
        serializer = TokenRefreshSerializer(data = data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data,status=status.HTTP_200_OK)
        

class RegistrationView(APIView):
    def post(self,request):
        serializer = PatientRegistrationSerializer(data = request.data)
        if serializer.is_valid():
            user = serializer.save()
            # token = email_verification_token.make_token(user)
            # verification_url = (
            #     f"http://127.0.0.1:8000/accounts/api/emailverification/"
            #     f"?user_id={user.id}&token={token}"
            # )
            # print("verification url")
            # print(verification_url)
            # print(repr(config("EMAIL_HOST_USER")))
            verification_code = secrets.randbelow(900000)+100000
            expiry = timezone.now()+timedelta(minutes=2)

            VerificationCode.objects.create(
                user = user,
                verification_code = verification_code,
                expiry = expiry

            )
            send_mail(
                subject = "verify your email",
                message = f"""Hello {user.patient.name},
                              We have sent an one time verification code to your mail .
                              {verification_code}
                              Use this code to register your account , if you did not create this ,
                              please ignore the mail.""",
                from_email = settings.DEFAULT_FROM_EMAIL,
                recipient_list =[user.email],
            )
            return Response({"message":"Registration Successful"},status=status.HTTP_201_CREATED)
        return Response({"message":"something went wrong!"},status=status.HTTP_400_BAD_REQUEST)

class EmailVerificationView(APIView):
    def post(self,request):
        email = request.data.get("email")
        code = request.data.get("code") 
        try :
            user = User.objects.get(email = email)
        except User.DoesNotExist : 
            return Response({"message" : "Account has not been registered."},status=status.HTTP_400_BAD_REQUEST)
        except user.is_active :
            return Response({"message" : "Account is already verified."},status=status.HTTP_400_BAD_REQUEST)
        try : 
            verification = VerificationCode.objects.get(user = user)
        except VerificationCode.DoesNotExist : 
            return Response({"message" : "Verification code has expired , please try again."},status=status.HTTP_400_BAD_REQUEST)

        if timezone.now() > verification.expiry : 
            verification.delete()
            return Response({"message" : "Verification code has been expired! Try again."},status=status.HTTP_400_BAD_REQUEST)
        
        
        if verification.verification_code == code :
            user.is_active = True
            user.save(update_fields=["is_active"])
            verification.delete()
            return Response({"message" : "Account has been verified successfully."},status=status.HTTP_200_OK)
        return Response({"message" : "Something went wrong ! Please try again "},status=status.HTTP_400_BAD_REQUEST)

         
        
class PasswordResetEmailVerification(APIView):
    def post(self, request):
        email = request.data.get("email")
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"message": "Account has not been registered."},
                status=status.HTTP_400_BAD_REQUEST
            )

        token = email_verification_token.make_token(user)
        verification_url = (
            f"http://127.0.0.1:8000/reset-password/"
            f"?user_id={user.id}&token={token}"
        )
        send_mail(
            subject="Password reset request",
            message=f"""Hello {user.patient.name},
            We received a password reset request for your account.
            Click the link below to reset your password:
            {verification_url}
            If you did not make this request, please ignore this email.""",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
        )
        return Response(
            {"message": "Password reset link has been sent to your email."},
            status=status.HTTP_200_OK
        )
        

class PasswordResetVerify(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        token = request.data.get("token")
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid password reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not email_verification_token.check_token(user, token):
            return Response(
                {"message": "Password reset link is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST
            )
        return Response(
            {"message": "Password reset link is valid."},
            status=status.HTTP_200_OK
        )        

class PasswordResetConfirm(APIView):
    def post(self, request):
        user_id = request.data.get("user_id")
        token = request.data.get("token")
        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")
        if password != confirm_password:
            return Response(
                {"message": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"message": "Invalid password reset request."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not email_verification_token.check_token(user, token):
            return Response(
                {"message": "Password reset link is invalid or expired."},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.set_password(password)
        user.save()
        return Response(
            {"message": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )


class LogOutView(APIView):
    permission_classes = [AllowAny]
    def post(self,request):
        response = Response({"message":"Succefully logged out"})
        response.delete_cookie(key='refresh_token',path='/')
        return response
    

class PatientDashboardData(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        patient = Patient.objects.get(user=request.user)
        serializer = PatientJsonData(patient)
        return Response(serializer.data)
    
class DoctorRegistration(APIView):
    def post(self,request):
        serializer=DoctorRegistrationSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Doctor Registration Successful."},status=status.HTTP_201_CREATED)
        return Response({"message":"Registraion Unsuccessful."},status=status.HTTP_400_BAD_REQUEST)

class StaffRole(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        if Doctors.objects.filter(user=request.user).exists():
            role = "Doctor"
        return Response({"Role":role})
    
def DoctorDashboard(request):
    return render(request,'doctors/doctordashboard.html')

class DoctorData(APIView):
    permission_classes = [IsAuthenticated]
    def get(self,request):
        user = Doctors.objects.get(user=request.user)
        serializer = DoctorJsonData(user)
        return Response(serializer.data)

def VerificationPage(request):
    return render(request,'accounts/verificationcode.html')

def ForgotPassword(request):
    return render(request,'accounts/forgotpassword.html')

def NewPassword(request):
    return render(request,'accounts/newpassword.html')