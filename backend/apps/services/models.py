from django.db import models

class ServiceCategory(models.Model):
    """
    Categorii mari de servicii: Electrocasnice, IT, Instalații etc.
    Afișate ca carduri pe homepage, similar cu categoriile eMag.
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50)       # Numele iconiței Lucide (ex: 'Wrench')
    color = models.CharField(max_length=20, default='#2563eb')  # Culoare card
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)        # Ordinea afișării

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Service Categories'

    def __str__(self):
        return self.name


class Service(models.Model):
    """
    Serviciu specific din cadrul unei categorii.
    Ex: "Reparare mașină de spălat" din categoria "Electrocasnice"
    """
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services')
    name = models.CharField(max_length=150)
    description = models.TextField()
    duration_min = models.IntegerField(default=60)          # Durata estimată în minute
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.category.name} — {self.name}"
