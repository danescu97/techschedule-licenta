from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    User extins cu rol și telefon.
    Rolurile determină ce dashboard vede userul după login.
    """
    class Role(models.TextChoices):
        CLIENT = 'client', 'Client'
        TECHNICIAN = 'technician', 'Technician'
        ADMIN = 'admin', 'Admin'

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.CLIENT)
    profile_photo = models.ImageField(upload_to='profiles/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def __str__(self):
        name = self.get_full_name()
        return f"{name if name else self.email} ({self.role})"


class Address(models.Model):
    """
    Adresele salvate ale unui client.
    Un client poate salva mai multe adrese (acasă, birou etc.)
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    label = models.CharField(max_length=50, default='Acasă')  # ex: "Acasă", "Birou"
    street = models.CharField(max_length=200)
    city = models.CharField(max_length=100)
    county = models.CharField(max_length=100)
    zip_code = models.CharField(max_length=10, blank=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.label} — {self.street}, {self.city}"
