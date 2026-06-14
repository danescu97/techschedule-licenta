from rest_framework import views, permissions
from rest_framework.response import Response
from django.db.models import Sum, Count
from django.utils import timezone
from datetime import timedelta
from django.views.generic import TemplateView
from apps.appointments.models import Appointment
from apps.users.models import User
from apps.technicians.models import Technician

class DashboardStatsView(views.APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        now = timezone.now()
        first_day_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # 1. Total Venituri Luna Curenta (doar finalizate)
        revenue_this_month = Appointment.objects.filter(
            status='completed',
            completed_at__gte=first_day_of_month
        ).aggregate(total=Sum('final_price'))['total'] or 0

        # 2. Total Interventii (programari active vs finalizate)
        total_appointments = Appointment.objects.count()
        completed_appointments = Appointment.objects.filter(status='completed').count()
        pending_appointments = Appointment.objects.filter(status__in=['pending', 'confirmed', 'in_progress']).count()

        # 3. Tehnicieni si Utilizatori
        total_technicians = Technician.objects.count()
        active_technicians = Technician.objects.filter(is_available=True).count()
        total_clients = User.objects.filter(role='client').count()

        # 4. Programari in ultimele 7 zile pentru grafic
        last_7_days = [now.date() - timedelta(days=i) for i in range(6, -1, -1)]
        appointments_by_day = []
        for day in last_7_days:
            count = Appointment.objects.filter(
                scheduled_date=day
            ).count()
            appointments_by_day.append({
                'date': day.strftime('%Y-%m-%d'),
                'count': count
            })

        return Response({
            'revenue_this_month': revenue_this_month,
            'total_appointments': total_appointments,
            'completed_appointments': completed_appointments,
            'pending_appointments': pending_appointments,
            'total_technicians': total_technicians,
            'active_technicians': active_technicians,
            'total_clients': total_clients,
            'appointments_by_day': appointments_by_day
        })

class DashboardHTMLView(TemplateView):
    template_name = 'analytics/dashboard.html'
    
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        now = timezone.now()
        first_day_of_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        # 1. Total Venituri Luna Curenta (doar finalizate)
        revenue_this_month = Appointment.objects.filter(
            status='completed',
            completed_at__gte=first_day_of_month
        ).aggregate(total=Sum('final_price'))['total'] or 0

        # 2. Total Interventii (programari active vs finalizate)
        total_appointments = Appointment.objects.count()
        completed_appointments = Appointment.objects.filter(status='completed').count()
        pending_appointments = Appointment.objects.filter(status__in=['pending', 'confirmed', 'in_progress']).count()

        # 3. Tehnicieni si Utilizatori
        total_technicians = Technician.objects.count()
        active_technicians = Technician.objects.filter(is_available=True).count()
        total_clients = User.objects.filter(role='client').count()

        # 4. Programari in ultimele 7 zile pentru grafic
        last_7_days = [now.date() - timedelta(days=i) for i in range(6, -1, -1)]
        appointments_by_day = []
        labels = []
        data = []
        for day in last_7_days:
            count = Appointment.objects.filter(
                scheduled_date=day
            ).count()
            appointments_by_day.append({
                'date': day.strftime('%d %b'),
                'count': count
            })
            labels.append(day.strftime('%d %b'))
            data.append(count)

        context.update({
            'revenue_this_month': revenue_this_month,
            'total_appointments': total_appointments,
            'completed_appointments': completed_appointments,
            'pending_appointments': pending_appointments,
            'total_technicians': total_technicians,
            'active_technicians': active_technicians,
            'total_clients': total_clients,
            'appointments_by_day': appointments_by_day,
            'chart_labels': labels,
            'chart_data': data
        })
        return context

