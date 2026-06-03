@echo off
echo ==========================================
echo Pornire TechSchedule (Backend + Frontend)
echo ==========================================

echo [1/2] Se porneste Backend-ul Django...
start cmd /k "cd backend && call venv\Scripts\activate && python manage.py runserver"

echo [2/2] Se porneste Frontend-ul React...
start cmd /k "cd frontend && npm run dev"

echo Toate serviciile au fost pornite in ferestre separate!
echo Accesati http://localhost:5173 pentru aplicatie.
