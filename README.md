# InventoryHub
Sistema de control de inventario con movimientos de stock y alertas.

## Stack
- Backend: Python 3.11, FastAPI, SQLAlchemy, SQLite, JWT, bcrypt
- Frontend: React 18, Vite, Axios, React Router DOM

## Correr el proyecto localmente

### Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

API: http://localhost:8000
Swagger: http://localhost:8000/docs

### Frontend
cd frontend
npm install
npm run dev

App: http://localhost:5173

## Librerías adicionales
- python-jose[cryptography]: JWT
- passlib[bcrypt]==4.0.1: hash de passwords
- python-multipart: soporte de formularios
- axios: cliente HTTP
- react-router-dom: navegación