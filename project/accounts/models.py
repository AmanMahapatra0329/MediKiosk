from django.db import models
from django.contrib.auth.models import User 

class VerificationCode(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='verificationcode')
    verification_code = models.CharField(max_length=6)
    expiry = models.DateTimeField()

    def __str__(self):
        return self.user.email

class PasswordResetToken(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name='resettoken')
    expiry = models.DateTimeField()
