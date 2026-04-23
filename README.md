# InventoryHub

Sistema de control de inventario con movimientos de stock y alertas automáticas.

## Stack
- **Backend:** Python 3.11, FastAPI, SQLAlchemy, SQLite, JWT (python-jose), bcrypt (passlib)
- **Frontend:** React 18, Vite, Axios, React Router DOM

## Cómo correr el proyecto localmente

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
API disponible en: http://localhost:8000
Documentación Swagger: http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App disponible en: http://localhost:5173

## Librerías adicionales utilizadas
- `python-jose[cryptography]` — generación y verificación de JWT
- `passlib[bcrypt]==4.0.1` — hash seguro de contraseñas
- `python-multipart` — soporte para formularios en FastAPI
- `axios` — cliente HTTP para el frontend
- `react-router-dom` — navegación entre pantallas