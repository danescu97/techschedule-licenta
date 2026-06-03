from django.db import models
from apps.users.models import User
from apps.services.models import ServiceCategory

class Technician(models.Model):
    """
    Profilul extins al unui tehnician.
    Un user cu role='technician' are asociat un profil Technician.
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='technician_profile')
    specialties = models.ManyToManyField(ServiceCategory, blank=True)
    bio = models.TextField(blank=True)
    zone = models.CharField(max_length=100)      # Zona geografică (ex: "București Sector 2")
    rating = models.FloatField(default=0.0)      # Calculat automat din review-uri
    total_reviews = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        name = self.user.get_full_name()
        return f"Tehnician: {name if name else self.user.email}"


class TechnicianSchedule(models.Model):
    """
    Programul de lucru al tehnicianului pe zile ale săptămânii.
    Se folosește pentru a genera sloturile disponibile în calendar.
    """
    class DayOfWeek(models.IntegerChoices):
        MONDAY = 0, 'Luni'
        TUESDAY = 1, 'Marți'
        WEDNESDAY = 2, 'Miercuri'
        THURSDAY = 3, 'Joi'
        FRIDAY = 4, 'Vineri'
        SATURDAY = 5, 'Sâmbătă'
        SUNDAY = 6, 'Duminică'

    technician = models.ForeignKey(Technician, on_delete=models.CASCADE, related_name='schedule')
    day_of_week = models.IntegerField(choices=DayOfWeek.choices)
    start_time = models.TimeField()     # ex: 08:00
    end_time = models.TimeField()       # ex: 18:00
    is_working = models.BooleanField(default=True)

    class Meta:
        unique_together = ['technician', 'day_of_week']
