from django.db import models
from apps.users.models import User
from apps.appointments.models import Appointment
from apps.technicians.models import Technician

class Review(models.Model):
    """
    Review lăsat de client după finalizarea programării.
    Un client poate lăsa un singur review per programare.
    """
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='review')
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews_given')
    technician = models.ForeignKey(Technician, on_delete=models.CASCADE, related_name='reviews_received')
    rating = models.IntegerField()       # 1-5 stele
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Recalculează rating-ul mediu al tehnicianului după fiecare review
        reviews = Review.objects.filter(technician=self.technician)
        avg = reviews.aggregate(models.Avg('rating'))['rating__avg'] or 0
        self.technician.rating = round(avg, 1)
        self.technician.total_reviews = reviews.count()
        self.technician.save(update_fields=['rating', 'total_reviews'])
