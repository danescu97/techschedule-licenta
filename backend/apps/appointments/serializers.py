from rest_framework import serializers
from .models import Appointment, AppointmentPhoto, InterventionReport, AppointmentStatusLog
from apps.services.serializers import ServiceSerializer
from apps.users.serializers import UserSerializer, AddressSerializer
from apps.technicians.serializers import TechnicianSerializer
from datetime import datetime, timedelta

class AppointmentPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentPhoto
        fields = '__all__'

class InterventionReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterventionReport
        fields = '__all__'

class AppointmentStatusLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentStatusLog
        fields = '__all__'

class AppointmentSerializer(serializers.ModelSerializer):
    photos = AppointmentPhotoSerializer(many=True, read_only=True)
    report = InterventionReportSerializer(read_only=True)
    status_logs = AppointmentStatusLogSerializer(many=True, read_only=True)
    
    # Optional nested serialization for read operations
    service_detail = ServiceSerializer(source='service', read_only=True)
    client_detail = UserSerializer(source='client', read_only=True)
    technician_detail = TechnicianSerializer(source='technician', read_only=True)
    address_detail = AddressSerializer(source='address', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('client', 'status', 'created_at', 'updated_at', 'confirmed_at', 'completed_at', 'final_price', 'time_slot_end')

    def create(self, validated_data):
        user = self.context['request'].user
        
        # Calculate time slot end if not provided directly
        time_slot_start = validated_data.get('time_slot_start')
        service = validated_data.get('service')
        
        # Default duration if for some reason service is missing
        duration = service.duration_min if hasattr(service, 'duration_min') else 60
        
        if 'time_slot_end' not in validated_data and time_slot_start:
            start_dt = datetime.combine(datetime.today(), time_slot_start)
            end_dt = start_dt + timedelta(minutes=duration)
            validated_data['time_slot_end'] = end_dt.time()
            
        appointment = Appointment.objects.create(
            client=user,
            status=Appointment.Status.PENDING,
            estimated_price=service.base_price if hasattr(service, 'base_price') else 0,
            **validated_data
        )
        
        # Log creation
        AppointmentStatusLog.objects.create(
            appointment=appointment,
            new_status=Appointment.Status.PENDING,
            changed_by=user,
            note="Programare inițializată de către client."
        )
        
        return appointment
