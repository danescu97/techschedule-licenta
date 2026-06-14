from django.core.management.base import BaseCommand
import random
from datetime import timedelta, time, datetime, date
from django.utils import timezone

try:
    from faker import Faker
except ImportError:
    Faker = None

from apps.users.models import User, Address
from apps.services.models import ServiceCategory, Service
from apps.technicians.models import Technician, TechnicianSchedule
from apps.appointments.models import Appointment, InterventionReport, AppointmentStatusLog
from apps.reviews.models import Review

NUM_CLIENTS = 50
NUM_TECHNICIANS = 10
NUM_APPOINTMENTS = 200

class Command(BaseCommand):
    help = 'Seeds the database with sample data for statistics.'

    def handle(self, *args, **kwargs):
        if Faker is None:
            self.stdout.write(self.style.ERROR("Vă rugăm să instalați faker: pip install faker"))
            return

        self.fake = Faker('ro_RO')

        self.seed_services()
        clients, technicians = self.seed_users()
        self.seed_appointments(clients, technicians)

        self.stdout.write(self.style.SUCCESS("Database seeding completed successfully!"))

    def seed_services(self):
        self.stdout.write("Seeding services...")
        categories = [
            {'name': 'Electrocasnice', 'icon': 'Wrench', 'color': '#2563eb'},
            {'name': 'IT & Calculatoare', 'icon': 'Monitor', 'color': '#16a34a'},
            {'name': 'Instalații Sanitare', 'icon': 'Droplets', 'color': '#0284c7'},
            {'name': 'Instalații Electrice', 'icon': 'Zap', 'color': '#ca8a04'},
            {'name': 'Climatizare', 'icon': 'Wind', 'color': '#9333ea'},
        ]

        service_names = {
            'Electrocasnice': ['Reparare mașină de spălat', 'Reparare frigider', 'Reparare cuptor electric', 'Instalare hotă'],
            'IT & Calculatoare': ['Instalare Windows', 'Curățare laptop praf', 'Recuperare date HDD', 'Înlocuire display laptop'],
            'Instalații Sanitare': ['Desfundare țevi', 'Montare baterie chiuvetă', 'Reparare scurgere', 'Montare cabină duș'],
            'Instalații Electrice': ['Schimbare tablou electric', 'Montare prize și întrerupătoare', 'Reparare scurtcircuit', 'Montare corpuri iluminat'],
            'Climatizare': ['Igienizare aer condiționat', 'Încărcare cu freon', 'Montare aparat AC', 'Reparare placă de bază AC']
        }

        for idx, cat_data in enumerate(categories):
            cat, created = ServiceCategory.objects.get_or_create(
                name=cat_data['name'],
                defaults={'icon': cat_data['icon'], 'color': cat_data['color'], 'order': idx}
            )
            
            for s_name in service_names[cat.name]:
                Service.objects.get_or_create(
                    category=cat,
                    name=s_name,
                    defaults={
                        'description': self.fake.text(max_nb_chars=100),
                        'duration_min': random.choice([30, 60, 90, 120]),
                        'base_price': random.randint(100, 500)
                    }
                )

    def seed_users(self):
        self.stdout.write("Seeding clients and technicians...")
        
        # Clients
        clients = []
        for _ in range(NUM_CLIENTS):
            email = self.fake.unique.email()
            first_name = self.fake.first_name()
            last_name = self.fake.last_name()
            try:
                user, created = User.objects.get_or_create(
                    username=email,
                    defaults={
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name,
                        'phone': self.fake.phone_number()[:15],
                        'role': User.Role.CLIENT
                    }
                )
                if created:
                    user.set_password('password123')
                    user.save()
                clients.append(user)
                
                Address.objects.get_or_create(
                    user=user,
                    label=random.choice(['Acasă', 'Birou', 'Apartament 2']),
                    defaults={
                        'street': self.fake.street_address(),
                        'city': 'București',
                        'county': 'București',
                        'zip_code': self.fake.postcode(),
                        'is_default': True
                    }
                )
            except Exception as e:
                pass
                
        # Technicians
        techs = []
        services = list(ServiceCategory.objects.all())
        for i in range(NUM_TECHNICIANS):
            email = f"tech{i}_{self.fake.unique.email()}"
            first_name = self.fake.first_name()
            last_name = self.fake.last_name()
            try:
                user, created = User.objects.get_or_create(
                    username=email,
                    defaults={
                        'email': email,
                        'first_name': first_name,
                        'last_name': last_name,
                        'phone': self.fake.phone_number()[:15],
                        'role': User.Role.TECHNICIAN
                    }
                )
                if created:
                    user.set_password('password123')
                    user.save()
                    
                    tech_profile = Technician.objects.create(
                        user=user,
                        bio=self.fake.text(max_nb_chars=200),
                        zone=random.choice(['București Sector 1', 'București Sector 2', 'București Sector 3', 'București Sector 4', 'București Sector 5', 'București Sector 6', 'Ilfov'])
                    )
                    selected_specialties = random.sample(services, k=random.randint(1, 3))
                    tech_profile.specialties.set(selected_specialties)
                    techs.append(tech_profile)
                    
                    for day in range(5):
                        TechnicianSchedule.objects.create(
                            technician=tech_profile,
                            day_of_week=day,
                            start_time=time(hour=9, minute=0),
                            end_time=time(hour=18, minute=0),
                            is_working=True
                        )
            except Exception as e:
                pass
                
        return clients, techs

    def seed_appointments(self, clients, technicians):
        self.stdout.write("Seeding appointments...")
        services = list(Service.objects.all())
        
        if not clients or not technicians or not services:
            self.stdout.write("Not enough base data to generate appointments.")
            return

        statuses = [
            Appointment.Status.PENDING,
            Appointment.Status.CONFIRMED,
            Appointment.Status.IN_PROGRESS,
            Appointment.Status.COMPLETED,
            Appointment.Status.COMPLETED,
            Appointment.Status.COMPLETED,
            Appointment.Status.CANCELLED,
            Appointment.Status.FAILED
        ]

        now = timezone.now()
        start_date = now - timedelta(days=180)

        for i in range(NUM_APPOINTMENTS):
            client = random.choice(clients)
            service = random.choice(services)
            address = client.addresses.first()
            
            valid_techs = [t for t in technicians if service.category in t.specialties.all()]
            technician = random.choice(valid_techs) if valid_techs else random.choice(technicians)
            
            appt_date = start_date + timedelta(days=random.randint(0, 180))
            status = random.choice(statuses)
            
            if status == Appointment.Status.PENDING:
                technician = None
                
            estimated_price = service.base_price
            final_price = estimated_price if status == Appointment.Status.COMPLETED else None
            if final_price and random.random() > 0.7:
                final_price += random.randint(10, 100)
                
            appt = Appointment.objects.create(
                client=client,
                technician=technician,
                service=service,
                address=address,
                scheduled_date=appt_date.date(),
                time_slot_start=time(hour=random.randint(9, 16), minute=0),
                time_slot_end=time(hour=random.randint(10, 18), minute=0),
                status=status,
                problem_description=self.fake.text(max_nb_chars=150),
                estimated_price=estimated_price,
                final_price=final_price,
                created_at=appt_date - timedelta(days=random.randint(1, 5))
            )
            
            AppointmentStatusLog.objects.create(
                appointment=appt,
                new_status=Appointment.Status.PENDING,
                timestamp=appt.created_at
            )
            
            if status in [Appointment.Status.CONFIRMED, Appointment.Status.IN_PROGRESS, Appointment.Status.COMPLETED, Appointment.Status.FAILED]:
                AppointmentStatusLog.objects.create(
                    appointment=appt,
                    old_status=Appointment.Status.PENDING,
                    new_status=Appointment.Status.CONFIRMED,
                    timestamp=appt.created_at + timedelta(hours=2)
                )
                appt.confirmed_at = appt.created_at + timedelta(hours=2)
                appt.save()
                
            if status == Appointment.Status.COMPLETED:
                appt.completed_at = appt_date + timedelta(hours=2)
                appt.save()
                AppointmentStatusLog.objects.create(
                    appointment=appt,
                    old_status=Appointment.Status.IN_PROGRESS,
                    new_status=Appointment.Status.COMPLETED,
                    timestamp=appt.completed_at
                )
                
                InterventionReport.objects.create(
                    appointment=appt,
                    technician=technician,
                    diagnosis=self.fake.text(max_nb_chars=100),
                    work_done=self.fake.text(max_nb_chars=100),
                    parts_replaced="Siguranță arsă" if random.random() > 0.8 else "",
                    is_resolved=True
                )
                
                if random.random() > 0.3:
                    rating = random.choices([1, 2, 3, 4, 5], weights=[0.05, 0.05, 0.1, 0.3, 0.5])[0]
                    Review.objects.create(
                        appointment=appt,
                        client=client,
                        technician=technician,
                        rating=rating,
                        comment=self.fake.text(max_nb_chars=80) if random.random() > 0.5 else ""
                    )
