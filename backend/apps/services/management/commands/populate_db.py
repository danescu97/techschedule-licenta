import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth import get_user_model
from apps.users.models import Address
from apps.services.models import ServiceCategory, Service
from apps.technicians.models import Technician
from apps.appointments.models import Appointment

User = get_user_model()

class Command(BaseCommand):
    help = 'Populates the database with initial demo data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Starting database population...')

        # 1. Create Categories
        cat_plumbing, _ = ServiceCategory.objects.get_or_create(
            name="Instalații Sanitare", 
            defaults={'description': "Reparații și montaj pentru instalații de apă, țevi, robineți și obiecte sanitare.", 'icon': "Wrench"}
        )
        cat_electrical, _ = ServiceCategory.objects.get_or_create(
            name="Instalații Electrice", 
            defaults={'description': "Diagnosticare, montaj și reparații pentru tablouri electrice, prize, întrerupătoare.", 'icon': "Zap"}
        )
        cat_hvac, _ = ServiceCategory.objects.get_or_create(
            name="Climatizare & Centrale", 
            defaults={'description': "Revizii, montaj și reparații pentru aer condiționat și centrale termice.", 'icon': "Thermometer"}
        )
        cat_appliances, _ = ServiceCategory.objects.get_or_create(
            name="Electrocasnice", 
            defaults={'description': "Reparații pentru mașini de spălat, frigidere, cuptoare.", 'icon': "Monitor"}
        )

        self.stdout.write('Created categories.')

        # 2. Create Services
        services_data = [
            (cat_plumbing, "Reparație țeavă spartă", "Intervenție rapidă pentru țevi sparte sau fisurate.", 150.00, 60),
            (cat_plumbing, "Montaj chiuvetă / baterie", "Înlocuire sau montaj pentru chiuvete și baterii noi.", 120.00, 45),
            (cat_plumbing, "Desfundare canalizare", "Serviciu profesional de desfundare pentru baie sau bucătărie.", 200.00, 90),
            
            (cat_electrical, "Înlocuire tablou electric", "Schimbarea vechiului tablou cu unul nou, cu siguranțe automate.", 350.00, 120),
            (cat_electrical, "Montaj prize și întrerupătoare", "Montaj pentru prize și întrerupătoare noi (preț/bucată).", 50.00, 30),
            (cat_electrical, "Diagnosticare scurtcircuit", "Depistarea și izolarea defectelor electrice din locuință.", 150.00, 60),

            (cat_hvac, "Igienizare Aer Condiționat", "Curățare profesională și igienizare a filtrelor și vaporizatorului.", 150.00, 45),
            (cat_hvac, "Revizie centrală termică", "Verificare anuală obligatorie pentru centrala pe gaz.", 250.00, 60),
            
            (cat_appliances, "Reparație Mașină de Spălat", "Diagnoză și reparație pentru mașini de spălat rufe sau vase.", 180.00, 90),
            (cat_appliances, "Reparație Frigider", "Încărcare cu freon și reparații compresoare pentru frigidere.", 200.00, 90),
        ]

        services = []
        for cat, name, desc, price, duration in services_data:
            svc, _ = Service.objects.get_or_create(
                category=cat,
                name=name,
                defaults={'description': desc, 'base_price': price, 'duration_min': duration, 'is_active': True}
            )
            services.append(svc)

        self.stdout.write('Created services.')

        # 3. Create Users (Clients)
        clients = []
        for i in range(1, 6):
            user, created = User.objects.get_or_create(
                email=f"client{i}@test.com",
                defaults={
                    'username': f"client{i}@test.com",
                    'first_name': f"Client",
                    'last_name': f"Test {i}",
                    'role': 'client',
                    'phone': f"070000000{i}"
                }
            )
            if created:
                user.set_password("clientpass123")
                user.save()
                
            address, _ = Address.objects.get_or_create(
                user=user,
                label='Acasa',
                defaults={
                    'street': f"Strada Exemplu nr. {random.randint(1, 100)}",
                    'city': "București",
                    'county': "București"
                }
            )
            clients.append((user, address))

        self.stdout.write('Created clients.')

        # 4. Create Technicians
        techs_data = [
            ("tech1@test.com", "Ion", "Mester", "0722000001", [cat_plumbing, cat_hvac]),
            ("tech2@test.com", "Marian", "Electric", "0722000002", [cat_electrical]),
            ("tech3@test.com", "Vasile", "Reparator", "0722000003", [cat_appliances, cat_electrical]),
        ]

        technicians = []
        for email, fname, lname, phone, specializations in techs_data:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email,
                    'first_name': fname,
                    'last_name': lname,
                    'role': 'technician',
                    'phone': phone
                }
            )
            if created:
                user.set_password("techpass123")
                user.save()
            
            profile, _ = Technician.objects.get_or_create(
                user=user,
                defaults={
                    'is_available': True,
                    'rating': round(random.uniform(4.0, 5.0), 1),
                    'zone': 'Bucuresti'
                }
            )
            profile.specialties.set(specializations)
            technicians.append(profile)

        self.stdout.write('Created technicians.')

        # 5. Create Appointments
        statuses = ['pending', 'confirmed', 'in_progress', 'completed']
        now = timezone.now()

        for i in range(20):
            client_tuple = random.choice(clients)
            client = client_tuple[0]
            client_address = client_tuple[1]
            service = random.choice(services)
            status = random.choice(statuses)
            
            # Determine date based on status
            if status == 'completed':
                scheduled_date = (now - timedelta(days=random.randint(1, 10))).date()
            else:
                scheduled_date = (now + timedelta(days=random.randint(1, 5))).date()

            scheduled_time = timezone.datetime.strptime(f"{random.randint(9, 16)}:00:00", "%H:%M:%S").time()

            # Find a matching technician
            matching_techs = [t for t in technicians if service.category in t.specialties.all()]
            assigned_tech = random.choice(matching_techs) if matching_techs and status != 'pending' else None

            scheduled_time_end = (timezone.datetime.combine(timezone.now().date(), scheduled_time) + timedelta(minutes=service.duration_min)).time()

            appt, created = Appointment.objects.get_or_create(
                client=client,
                service=service,
                scheduled_date=scheduled_date,
                time_slot_start=scheduled_time,
                defaults={
                    'time_slot_end': scheduled_time_end,
                    'technician': assigned_tech,
                    'address': client_address,
                    'status': status,
                    'estimated_price': service.base_price,
                    'problem_description': "Vă rog să veniți după ora 10." if random.random() > 0.5 else ""
                }
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated database with demo data!'))
