from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
import models

router = APIRouter(prefix="/movements", tags=["movements"])

TIPOS_VALIDOS = {"entrada", "salida", "ajuste"}


class MovementCreate(BaseModel):
    product_id: int
    tipo: str
    cantidad: int
    motivo: Optional[str] = None


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_movement(
    payload: MovementCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    if payload.tipo not in TIPOS_VALIDOS:
        raise HTTPException(status_code=400, detail="tipo debe ser entrada, salida o ajuste")

    product = db.query(models.Product).filter(
        models.Product.id == payload.product_id,
        models.Product.is_active == True,
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if payload.tipo == "salida":
        if product.stock_actual - payload.cantidad < 0:
            raise HTTPException(
                status_code=400,
                detail=f"Stock insuficiente. Disponible: {product.stock_actual}",
            )
        product.stock_actual -= payload.cantidad
    elif payload.tipo == "entrada":
        product.stock_actual += payload.cantidad
    elif payload.tipo == "ajuste":
        product.stock_actual = payload.cantidad

    movement = models.Movement(
        product_id=payload.product_id,
        user_id=current_user.id,
        tipo=payload.tipo,
        cantidad=payload.cantidad,
        motivo=payload.motivo,
    )
    db.add(movement)
    db.commit()
    db.refresh(movement)
    return movement


@router.get("/")
def list_movements(
    product_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    query = db.query(models.Movement)
    if product_id is not None:
        query = query.filter(models.Movement.product_id == product_id)
    return query.order_by(models.Movement.timestamp.desc()).all()
