from fastapi import APIRouter

from app.api.v1.endpoints import inventory, receipt, dashboard, upload

api_router = APIRouter()

# 각 엔드포인트 라우터 등록
api_router.include_router(
    inventory.router, 
    prefix="/inventory", 
    tags=["inventory"]
)

api_router.include_router(
    receipt.router, 
    prefix="/receipts", 
    tags=["receipts"]
)

api_router.include_router(
    dashboard.router, 
    prefix="/dashboard", 
    tags=["dashboard"]
)

api_router.include_router(
    upload.router, 
    prefix="/upload", 
    tags=["upload"]
)