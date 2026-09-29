from rest_framework.permissions import BasePermission

#Allows only doctors to access the end points 
class IsDoctor(BasePermission):
    def has_permission(self,request,view):
        return hasattr(request.user,'doctor')



#Allows only patients to access the end points 
class IsPatient(BasePermission):
    def has_permission(self,request,view):
        return hasattr(request.user,'patient')