from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from auth import get_current_user
from database import get_db
import models

router = APIRouter(prefix="/alerts", tags=["alerts"])


@router.get("/")
def get_alerts(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    return db.query(models.Product).filter(
        models.Product.is_active == True,
        models.Product.stock_actual <= models.Product.stock_min,
    ).all()
