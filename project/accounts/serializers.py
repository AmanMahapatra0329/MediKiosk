from rest_framework import serializers
from patients.models import Patient
from doctors.models import Doctors
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
        user.is_active = False
        user.save()
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


class DoctorRegistrationSerializer(serializers.Serializer):
    # user = serializers.OneToOneField(User,on_delete=models.CASCADE)
    employee_id=serializers.CharField()
    password = serializers.CharField(write_only=True)
    full_name=serializers.CharField()
    email=serializers.EmailField()
    phone_number=serializers.IntegerField()
    date_of_birth=serializers.DateField()
    gender=serializers.CharField()
    department=serializers.CharField()
    qualification=serializers.CharField()
    specialization=serializers.CharField()
    years_of_experience=serializers.IntegerField()
    joining_date=serializers.DateField()
    is_active=serializers.BooleanField()

    def create(self, validated_data):
        user = User.objects.create_user(username=validated_data['email'],
                                        password=validated_data['password'],
                                        email=validated_data['email'])
        doctor=Doctors.objects.create(user=user,
                                      employee_id=validated_data['employee_id'],
                                      full_name=validated_data['full_name'],
                                      email=validated_data['email'],
                                      phone_number=validated_data['phone_number'],
                                      gender=validated_data['gender'],
                                      department=validated_data['department'],
                                      qualification=validated_data['qualification'],
                                      specialization=validated_data['specialization'],
                                      years_of_experience=validated_data['years_of_experience'],
                                      joining_date=validated_data['joining_date'],
                                      is_active=validated_data['is_active'],
                                      )
        return user
    
class DoctorJsonData(serializers.ModelSerializer):
    class Meta:
        model = Doctors
        fields = [
            'employee_id',
            'full_name',
            'email',
            'phone_number',
            'date_of_birth',
            'department',
            'specialization'
        ]