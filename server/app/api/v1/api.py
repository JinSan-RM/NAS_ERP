from fastapi import APIRouter
from app.api.v1.endpoints import inventory, dashboard, upload

api_router = APIRouter()

# 재고 관리 엔드포인트
api_router.include_router(
    inventory.router, 
    prefix="/inventory", 
    tags=["inventory"]
)

# 대시보드 엔드포인트
api_router.include_router(
    dashboard.router, 
    prefix="/dashboard", 
    tags=["dashboard"]
)

# 파일 업로드 엔드포인트
api_router.include_router(
    upload.router, 
    prefix="/upload", 
    tags=["upload"]
)