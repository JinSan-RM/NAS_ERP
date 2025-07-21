from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import os
from app.api.deps import get_db

router = APIRouter()

@router.post("/excel")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Excel 파일 업로드"""
    # 파일 확장자 검증
    if not file.filename or not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=400, 
            detail="Excel 파일만 업로드 가능합니다 (.xlsx, .xls)"
        )
    
    # 파일 크기 확인 (50MB 제한)
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:  # 50MB
        raise HTTPException(
            status_code=400,
            detail="파일 크기는 50MB를 초과할 수 없습니다"
        )
    
    return {
        "message": f"파일 '{file.filename}' 업로드 완료",
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content),
        "status": "업로드 성공"
    }

@router.post("/multiple")
async def upload_multiple_files(
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """여러 파일 업로드"""
    if len(files) > 10:
        raise HTTPException(
            status_code=400,
            detail="한 번에 최대 10개 파일까지 업로드 가능합니다"
        )
    
    results = []
    for file in files:
        if file.filename and file.filename.endswith(('.xlsx', '.xls', '.csv')):
            content = await file.read()
            results.append({
                "filename": file.filename,
                "content_type": file.content_type,
                "size": len(content),
                "status": "success"
            })
        else:
            results.append({
                "filename": file.filename or "unknown",
                "status": "error",
                "error": "지원되지 않는 파일 형식"
            })
    
    return {
        "message": f"{len(files)}개 파일 처리 완료",
        "files": results
    }

@router.get("/template")
async def download_template():
    """Excel 템플릿 다운로드 정보"""
    return {
        "message": "Excel 템플릿 정보",
        "required_columns": [
            "품목코드", "품목명", "카테고리", "브랜드",
            "현재재고", "최소재고", "최대재고", "단가",
            "통화", "공급업체명", "공급업체연락처",
            "위치", "창고", "설명", "활성상태"
        ],
        "sample_data": {
            "품목코드": "ITEM001",
            "품목명": "샘플 품목",
            "카테고리": "전자제품",
            "현재재고": 100,
            "최소재고": 10
        }
    }

@router.get("/")
async def get_upload_info():
    """업로드 정보"""
    return {
        "supported_formats": [".xlsx", ".xls", ".csv"],
        "max_file_size": "50MB",
        "max_files": 10,
        "endpoints": {
            "excel": "/api/v1/upload/excel",
            "multiple": "/api/v1/upload/multiple", 
            "template": "/api/v1/upload/template"
        }
    }