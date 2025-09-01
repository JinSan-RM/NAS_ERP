from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.v1.api import api_router
from app.core.database import engine, Base

import os

# 데이터베이스 테이블 생성
try:
    Base.metadata.create_all(bind=engine)
    print("✅ 데이터베이스 테이블 생성 완료")
except Exception as e:
    print(f"⚠️ 데이터베이스 연결 오류: {e}")

app = FastAPI(
    title="Inventory Management System",
    description="구매품목관리 시스템 API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

allowed_origins_str = os.getenv("ALLOWED_HOSTS", "http://localhost,http://localhost:80,http://localhost:3001")
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",")]  # strip() 추가로 공백 제거
print(f"✅ Loaded ALLOWED_ORIGINS: {allowed_origins}")  # 로그 추가 - 서버 시작 시 출력됨

# CORS 미들웨어 추가 (기존 유지, 하지만 allow_origins에 * 추가로 테스트)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 개발용 - 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host 미들웨어
if hasattr(settings, 'TRUSTED_HOSTS') and settings.TRUSTED_HOSTS:
    app.add_middleware(
        TrustedHostMiddleware, 
        allowed_hosts=settings.TRUSTED_HOSTS
    )
    

# 정적 파일 마운트

uploads_dir = os.path.join(os.getcwd(), "uploads")
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
    

# API 라우터 등록
app.include_router(api_router, prefix=settings.API_V1_STR)



@app.get("/")
async def root():
    return {
        "message": "Inventory Management System API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "inventory-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_level="info"
    )