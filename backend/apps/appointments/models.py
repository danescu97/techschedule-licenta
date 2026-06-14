from django.db import models
from apps.users.models import User, Address
from apps.services.models import Service
from apps.technicians.models import Technician

class Appointment(models.Model):
    """
    Programarea unei intervenții tehnice.
    Aceasta este entitatea centrală a întregii aplicații.
    """
    class Status(models.TextChoices):
        PENDING = 'pending', 'În așteptare'           # Creat, neconfirmat încă
        CONFIRMED = 'confirmed', 'Confirmat'           # Tehnicianul a acceptat
        IN_PROGRESS = 'in_progress', 'În lucru'        # Tehnicianul a ajuns
        COMPLETED = 'completed', 'Finalizat'           # Intervenție terminată
        CANCELLED = 'cancelled', 'Anulat'             # Anulat de client/admin
        FAILED = 'failed', 'Nerealizat'               # Tehnicianul a raportat problemă

    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='appointments')
    technician = models.ForeignKey(Technician, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointments')
    service = models.ForeignKey(Service, on_delete=models.PROTECT)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Date și timp
    scheduled_date = models.DateField()
    time_slot_start = models.TimeField()    # ex: 10:00
    time_slot_end = models.TimeField()      # ex: 12:00

    # Status și tracking
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    
    # Detalii problemă
    problem_description = models.TextField(blank=True)
    estimated_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    final_price = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        client_name = self.client.get_full_name()
        return f"#{self.id} — {self.service.name} ({client_name if client_name else self.client.email})"


class AppointmentPhoto(models.Model):
    """
    Poze atașate de client la creare sau de tehnician la finalizare.
    """
    class PhotoType(models.TextChoices):
        CLIENT_UPLOAD = 'client', 'Încărcat de client'
        TECHNICIAN_UPLOAD = 'technician', 'Încărcat de tehnician'

    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='photos')
    photo = models.ImageField(upload_to='appointments/%Y/%m/')
    photo_type = models.CharField(max_length=20, choices=PhotoType.choices)
    uploaded_at = models.DateTimeField(auto_now_add=True)


class InterventionReport(models.Model):
    """
    Raportul tehnicianului după finalizarea intervenției.
    Completat din dashboard-ul tehnicianului.
    """
    appointment = models.OneToOneField(Appointment, on_delete=models.CASCADE, related_name='report')
    technician = models.ForeignKey(Technician, on_delete=models.CASCADE)
    diagnosis = models.TextField()           # Ce problemă a găsit
    work_done = models.TextField()           # Ce a făcut efectiv
    parts_replaced = models.TextField(blank=True)  # Piese înlocuite
    is_resolved = models.BooleanField(default=True)
    follow_up_needed = models.BooleanField(default=False)
    follow_up_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class AppointmentStatusLog(models.Model):
    """
    Istoric complet al schimbărilor de status.
    Folosit pentru timeline-ul vizual din pagina de detalii programare.
    """
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='status_logs')
    old_status = models.CharField(max_length=20, blank=True)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note = models.TextField(blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
