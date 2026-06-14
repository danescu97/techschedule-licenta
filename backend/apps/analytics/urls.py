from django.urls import path
from .views import DashboardStatsView, DashboardHTMLView

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('stats/page/', DashboardHTMLView.as_view(), name='dashboard-page'),
]
