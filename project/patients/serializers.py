from rest_framework import serializers
from accounts.models import Patient
from django.contrib.auth.models import User
    
class PatientRegistrationSerializer(serializers.Serializer):
    name = serializers.CharField()
    email = serializers.EmailField()
    password=serializers.CharField(write_only=True)
    blood_group=serializers.CharField()
    gender=serializers.CharField()
    date_of_birth=serializers.DateField()

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['email'],
                                        email=validated_data['email'],
                                        password=validated_data['password'])
        Patient.objects.create(user=user,
                                        name=validated_data['name'],
                                        date_of_birth=validated_data['date_of_birth'],
                                        blood_group=validated_data['blood_group'],
                                        sex=validated_data['gender'])
        return user
    
class PatientJsonData(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ["name", "blood_group", "sex", "date_of_birth"]