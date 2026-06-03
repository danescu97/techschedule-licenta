from rest_framework import serializers
from .models import Technician, TechnicianSchedule
from apps.users.serializers import UserSerializer
from apps.services.serializers import ServiceCategorySerializer

class TechnicianScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TechnicianSchedule
        fields = '__all__'

class TechnicianSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    specialties = ServiceCategorySerializer(many=True, read_only=True)
    schedule = TechnicianScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = Technician
        fields = '__all__'
