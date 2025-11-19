# celery.py
import os
from celery import Celery

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'LibraryManager.settings')

app = Celery('library_app')

app.config_from_object('django.conf:settings', namespace='CELERY')
app.autodiscover_tasks()

# Tâches périodiques
app.conf.beat_schedule = {
    'reset-ai-usage-daily': {
        'task': 'subscriptions.tasks.reset_ai_usage',
        'schedule': 86400.0,  # Tous les jours
    },
    'cleanup-old-exports': {
        'task': 'exports.tasks.cleanup_old_exports',
        'schedule': 604800.0,  # Toutes les semaines
    },
}