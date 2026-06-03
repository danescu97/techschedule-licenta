from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1']

# Database
# Using SQLite for local development as approved in the plan
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# CORS Settings
CORS_ALLOW_ALL_ORIGINS = True  # For easy local development

# Email configuration (console during development)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
