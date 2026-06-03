import os

backend_files = [
    # Users app
    "backend/apps/users/serializers.py",
    "backend/apps/users/views.py",
    "backend/apps/users/tasks.py",
    
    # Services app
    "backend/apps/services/serializers.py",
    "backend/apps/services/views.py",
    "backend/apps/services/urls.py",
    
    # Appointments app
    "backend/apps/appointments/serializers.py",
    "backend/apps/appointments/views.py",
    "backend/apps/appointments/urls.py",
    "backend/apps/appointments/tasks.py",
    
    # Technicians app
    "backend/apps/technicians/serializers.py",
    "backend/apps/technicians/views.py",
    "backend/apps/technicians/urls.py",
    
    # Reviews app
    "backend/apps/reviews/serializers.py",
    "backend/apps/reviews/views.py",
    "backend/apps/reviews/urls.py",
    
    # Notifications app
    "backend/apps/notifications/serializers.py",
    "backend/apps/notifications/views.py",
    "backend/apps/notifications/urls.py",
    
    # Analytics app
    "backend/apps/analytics/views.py",
    "backend/apps/analytics/urls.py",
]

base_dir = "/Users/ionutcatalindanescu/Desktop/licenta"

for rel_path in backend_files:
    abs_path = os.path.join(base_dir, rel_path)
    os.makedirs(os.path.dirname(abs_path), exist_ok=True)
    if not os.path.exists(abs_path):
        with open(abs_path, 'w') as f:
            f.write(f"# Stub for {rel_path}\n")
        print(f"Created stub: {rel_path}")

print("All backend stubs created.")
