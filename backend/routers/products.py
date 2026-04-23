from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
import models

router = APIRouter(prefix="/products", tags=["products"])


class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str
    stock_min: int
    stock_actual: int
    precio_unitario: float


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    stock_min: Optional[int] = None
    precio_unitario: Optional[float] = None


@router.get("/")
def list_products(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Product).filter(models.Product.is_active == True).all()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    existing = db.query(models.Product).filter(models.Product.sku == payload.sku).first()
    if existing:
        raise HTTPException(status_code=400, detail="El SKU ya existe")

    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}")
def update_product(
    product_id: int,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.is_active == True,
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(product, field, value)

    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    product = db.query(models.Product).filter(
        models.Product.id == product_id,
        models.Product.is_active == True,
    ).first()
    if not product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    product.is_active = False
    db.commit()
