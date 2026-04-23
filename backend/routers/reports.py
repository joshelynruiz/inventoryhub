from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
import models

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/valuation")
def get_valuation(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    products = db.query(models.Product).filter(models.Product.is_active == True).all()

    items = [
        {
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "category": p.category,
            "stock_actual": p.stock_actual,
            "precio_unitario": p.precio_unitario,
            "valor_total": p.stock_actual * p.precio_unitario,
        }
        for p in products
    ]

    total_general = sum(i["valor_total"] for i in items)

    return {"products": items, "total_general": total_general}
