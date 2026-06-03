from django.db import models
from apps.users.models import User

class Notification(models.Model):
    """
    Notificări in-app afișate în dropdown-ul din header.
    """
    class NotifType(models.TextChoices):
        APPOINTMENT_CONFIRMED = 'appointment_confirmed', 'Programare Confirmată'
        APPOINTMENT_CANCELLED = 'appointment_cancelled', 'Programare Anulată'
        TECHNICIAN_EN_ROUTE = 'technician_en_route', 'Tehnician în drum'
        APPOINTMENT_COMPLETED = 'appointment_completed', 'Programare Finalizată'
        REVIEW_REQUEST = 'review_request', 'Lasă un Review'
        NEW_TASK = 'new_task', 'Task Nou Primit'
        REMINDER = 'reminder', 'Reminder Programare'

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    type = models.CharField(max_length=40, choices=NotifType.choices)
    title = models.CharField(max_length=100)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    related_appointment_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} for {self.user.email}"
