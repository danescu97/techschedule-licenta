from rest_framework import viewsets, permissions
from .models import ServiceCategory, Service
from .serializers import ServiceCategorySerializer, ServiceSerializer

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)

class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    
    def get_queryset(self):
        # Allow admins to see all, public to see only active
        if self.request.user.is_staff:
            return ServiceCategory.objects.all()
        return ServiceCategory.objects.filter(is_active=True)

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ['category', 'is_active']

    def get_queryset(self):
        if self.request.user.is_staff:
            return Service.objects.all()
        return Service.objects.filter(is_active=True, category__is_active=True)
