#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=========================================="
echo "Pornire TechSchedule (Backend + Frontend) pe macOS"
echo "=========================================="

echo "[1/2] Se porneste Backend-ul Django in fereastra noua..."
osascript -e 'tell app "Terminal"
    do script "cd '"$DIR"'/backend && source venv/bin/activate && python manage.py runserver"
end tell'

echo "[2/2] Se porneste Frontend-ul React in fereastra noua..."
osascript -e 'tell app "Terminal"
    do script "cd '"$DIR"'/frontend && export PATH='"$DIR"'/node_bin/bin:$PATH:/usr/local/bin:/opt/homebrew/bin && npm run dev"
end tell'

echo "Serviciile se deschid in ferestre de Terminal separate."
echo "Aplicatia va fi disponibila la http://localhost:5173"

echo "Se deschide browser-ul automat..."
sleep 3
open "http://localhost:5173"
