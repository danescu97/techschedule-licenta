from rest_framework import viewsets, permissions
from .models import Review
from .serializers import ReviewSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Allow filtering reviews by technician ID in query params
        tech_id = self.request.query_params.get('technician')
        if tech_id:
            return Review.objects.filter(technician_id=tech_id)
        return Review.objects.all()

    def perform_create(self, serializer):
        serializer.save()
