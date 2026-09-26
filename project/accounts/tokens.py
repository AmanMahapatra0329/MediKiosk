from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationToken(PasswordResetTokenGenerator):
    pass

email_verification_token = EmailVerificationToken()