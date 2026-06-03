from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TechnicianViewSet, TechnicianScheduleViewSet

router = DefaultRouter()
router.register(r'technicians', TechnicianViewSet, basename='technician')
router.register(r'schedules', TechnicianScheduleViewSet, basename='schedule')

urlpatterns = [
    path('', include(router.urls)),
]
