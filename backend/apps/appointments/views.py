from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Appointment, AppointmentStatusLog
from .serializers import AppointmentSerializer
from django.utils import timezone

class AppointmentViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Appointment.objects.all()
        elif user.role == 'technician':
            return Appointment.objects.filter(technician__user=user)
        else:
            return Appointment.objects.filter(client=user)

    @action(detail=True, methods=['post'])
    def change_status(self, request, pk=None):
        appointment = self.get_object()
        new_status = request.data.get('status')
        note = request.data.get('note', '')

        if not new_status:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

        valid_statuses = dict(Appointment.Status.choices).keys()
        if new_status not in valid_statuses:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        old_status = appointment.status
        appointment.status = new_status
        
        if new_status == Appointment.Status.CONFIRMED:
            appointment.confirmed_at = timezone.now()
        elif new_status == Appointment.Status.COMPLETED:
            appointment.completed_at = timezone.now()
            
        appointment.save()

        AppointmentStatusLog.objects.create(
            appointment=appointment,
            old_status=old_status,
            new_status=new_status,
            changed_by=request.user,
            note=note
        )

        return Response(self.get_serializer(appointment).data)
