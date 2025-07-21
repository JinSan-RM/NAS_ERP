from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.core.database import get_db

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    대시보드 통계 정보 조회
    """
    # 재고 통계
    inventory_stats = crud.inventory.get_inventory_stats(db=db)
    
    # 최근 재고 부족 품목 (상위 5개)
    low_stock_items = crud.inventory.get_low_stock_items(db=db, skip=0, limit=5)
    
    # 재고 없는 품목 (상위 5개)
    out_of_stock_items = crud.inventory.get_out_of_stock_items(db=db, skip=0, limit=5)
    
    return {
        "inventory_stats": inventory_stats,
        "low_stock_items": [
            {
                "id": item.id,
                "item_code": item.item_code,
                "item_name": item.item_name,
                "current_stock": item.current_stock,
                "minimum_stock": item.minimum_stock
            }
            for item in low_stock_items
        ],
        "out_of_stock_items": [
            {
                "id": item.id,
                "item_code": item.item_code,
                "item_name": item.item_name,
                "current_stock": item.current_stock
            }
            for item in out_of_stock_items
        ]
    }

@router.get("/recent-activity")
def get_recent_activity(db: Session = Depends(get_db)):
    """
    최근 활동 내역 조회
    """
    # 최근 등록된 품목 (상위 10개)
    recent_items = (
        db.query(crud.inventory.model)
        .filter(crud.inventory.model.is_active == True)
        .order_by(crud.inventory.model.created_at.desc())
        .limit(10)
        .all()
    )
    
    return {
        "recent_items": [
            {
                "id": item.id,
                "item_code": item.item_code,
                "item_name": item.item_name,
                "created_at": item.created_at,
                "current_stock": item.current_stock
            }
            for item in recent_items
        ]
    }