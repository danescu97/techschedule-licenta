from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Technician, TechnicianSchedule
from .serializers import TechnicianSerializer, TechnicianScheduleSerializer

class TechnicianViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Public endpoint to view technicians.
    """
    queryset = Technician.objects.filter(is_available=True)
    serializer_class = TechnicianSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['zone']

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """
        Endpoint for a technician to get their own profile.
        """
        try:
            tech = Technician.objects.get(user=request.user)
            serializer = self.get_serializer(tech)
            return Response(serializer.data)
        except Technician.DoesNotExist:
            return Response({"detail": "Nu sunteți înregistrat ca tehnician."}, status=status.HTTP_404_NOT_FOUND)

class TechnicianScheduleViewSet(viewsets.ModelViewSet):
    """
    Endpoint for technicians to manage their own schedule.
    """
    serializer_class = TechnicianScheduleSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TechnicianSchedule.objects.filter(technician__user=self.request.user)

    def perform_create(self, serializer):
        tech = Technician.objects.get(user=self.request.user)
        serializer.save(technician=tech)
