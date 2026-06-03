# TechSchedule - Platformă Modernă pentru Intervenții Tehnice

TechSchedule este o platformă completă full-stack concepută pentru a eficientiza planificarea și gestionarea intervențiilor tehnice la domiciliu. Inspirată din sistemul eMag de gestionare a serviciilor, această aplicație conectează clienții cu tehnicieni calificați într-un mediu ușor de utilizat, securizat și extrem de vizual.

Aplicația este construită cu cele mai noi și populare tehnologii, asigurând o arhitectură robustă, scalabilă și un design atractiv.

---

## 🚀 Tehnologii Folosite

### Backend (API & Logica de Business)
*   **Django 5 & Django REST Framework (DRF):** Pentru un backend solid, sigur și scalabil.
*   **PostgreSQL / SQLite:** Bază de date relațională pentru persistența sigură a datelor (implicit rulează cu SQLite pentru ușurință în dezvoltare locală).
*   **JWT (JSON Web Tokens):** Pentru o autentificare sigură și modernă (prin `djangorestframework-simplejwt`).
*   **Django-Cors-Headers:** Pentru a permite comunicarea cross-origin sigură cu aplicația de React.

### Frontend (User Interface & Interacțiune)
*   **React 18 & Vite:** Pentru o interfață super-rapidă, fluidă și modernă.
*   **Zustand:** Un sistem de State Management minimal, rapid și ușor de utilizat (pentru Auth și sistemul de Booking Stepper).
*   **React Query (TanStack Query):** Pentru data fetching, caching, sincronizare și mutații optimiste.
*   **TailwindCSS:** Framework de utility-first CSS, utilizat pentru a crea o interfață superbă, responsivă și consistentă (culori personalizate, umbre, animații de tranziție).
*   **Lucide React:** O librărie modernă și curată de iconițe.
*   **Recharts:** Pentru grafice interactive (utilizat în Dashboard-ul de Admin).
*   **React Hook Form & Zod:** Pentru gestionarea robustă a formularelor și validări stricte pe frontend.

---

## 🌟 Funcționalități Cheie

### 1. Sistem de Roluri și Autentificare (3 Roluri)
*   **Clienți:** Pot căuta servicii, pot face programări și pot urmări statusul intervențiilor în timp real. Pot lăsa review-uri la final.
*   **Tehnicieni:** Au un dashboard dedicat pentru a vizualiza programările asignate. Pot accepta programări, semnala că sunt pe drum și completa Rapoarte de Intervenție la finalizarea lucrării.
*   **Administratori:** Au acces la Dashboard-ul Admin unde vizualizează statistici globale (venituri, număr programări, creștere pe 7 zile) și gestionează utilizatorii și serviciile din platformă.

### 2. Booking Flow Modern (Stepper în 4 pași)
Un proces curat și ghidat pas cu pas pentru ca utilizatorii să își rezerve o intervenție:
*   **Pasul 1:** Selectarea tipului de serviciu dorit.
*   **Pasul 2:** Alegerea adresei (cu formular direct pentru o adresă nouă).
*   **Pasul 3:** Alegerea Datei și a Orei (Calendar integrat și validare sloturi orare).
*   **Pasul 4:** Revizuirea și Confirmarea cererii.

### 3. Timeline Interactiv (Urmărire Intervenție)
În pagina de detalii a unei programări (`/appointments/:id`), utilizatorul vede un *Timeline* vizual, inspirat din eMag, care îi arată exact în ce stadiu este comanda sa: 
*   `Programare Creată` -> `Confirmată de tehnician` -> `Tehnicianul e pe drum/lucrează` -> `Finalizată`.

### 4. Sistem de Notificări și Review-uri
*   **Notificări in-app:** Dropdown în header (cu bulină de count) ce anunță clientul când i-a fost acceptată comanda sau a fost finalizată.
*   **Sistem de Rating:** Odată finalizată o intervenție, clienții pot evalua cu 1-5 stele și un comentariu munca tehnicianului.

### 5. Raport de Intervenție
Tehnicianul are un formular specific unde detaliază la final diagnoza, piesele schimbate, necesitatea unui *follow-up* și costul final.

---

## 🛠 Instalare și Rulare Locală (Development)

Sistemul conține două foldere principale: `/backend` și `/frontend`. 
Pentru a vă ușura munca, am pregătit două scripturi de pornire automată (acestea deschid 2 ferestre de terminal și pornesc ambele servere simultan).

### Cerințe:
1. Python (3.10+) instalat
2. Node.js (18+) instalat

### Pornire Rapidă pe MacOS / Linux
Deschideți terminalul în directorul rădăcină al proiectului și rulați:
```bash
chmod +x start_mac.command
./start_mac.command
```
*(Alternativ, puteți da dublu-click direct din Finder pe fișierul `start_mac.command`)*

### Pornire Rapidă pe Windows
Navigați în folderul principal al proiectului și dați dublu click pe fișierul:
```cmd
script.bat
```

### Conturi de Test (Implicit disponibile dacă se creează baza de date inițială)
*   **Admin:** admin@admin.com / adminpass123
*   *(Puteți crea conturi de client direct din interfață apăsând butonul "Înregistrare")*

---

## 🎨 Aspect și Design
Aplicația folosește o schemă de culori premium, bazată pe nuanțe de albastru (Primary), gri curat și animații subtile la interacțiune. Am pus un accent uriaș pe estetică și *User Experience*, adăugând efecte de hover, pulse-uri de loading (Skeleton screens) și fonturi clare.

Proiectul a fost dezvoltat cu grijă deosebită la detalii pentru o prezentare la superlativ.
