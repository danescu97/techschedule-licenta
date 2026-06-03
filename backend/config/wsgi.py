import os
from django.core.wsgi import get_wsgi_application

# Default to development settings, can override with DJANGO_SETTINGS_MODULE environment variable
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_wsgi_application()
