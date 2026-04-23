from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import engine
import models
from routers import auth, products, movements, alerts, reports

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="InventoryHub API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(movements.router)
app.include_router(alerts.router)
app.include_router(reports.router)


@app.get("/")
def root():
    return {"message": "InventoryHub API corriendo"}
