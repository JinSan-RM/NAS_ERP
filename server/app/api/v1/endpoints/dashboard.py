from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api.deps import get_db

router = APIRouter()

@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """대시보드 통계 조회"""
    return {
        "total_items": 0,
        "low_stock_items": 0,
        "recent_purchases": 0,
        "total_value": 0.0,
        "status": "시스템 준비 중"
    }

@router.get("/")
async def get_dashboard():
    """대시보드 메인"""
    return {
        "message": "인벤토리 관리 대시보드",
        "version": "1.0.0",
        "endpoints": {
            "stats": "/api/v1/dashboard/stats",
            "inventory": "/api/v1/inventory",
            "upload": "/api/v1/upload"
        }
    }