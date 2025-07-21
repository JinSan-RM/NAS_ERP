import os
from typing import List
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app import crud, schemas
from app.core.config import settings
from app.core.database import get_db
from app.services.excel_service import ExcelService

router = APIRouter()

@router.post("/excel", response_model=dict)
async def upload_excel_file(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(..., description="Excel 파일 (.xlsx, .xls)")
):
    """
    Excel 파일을 업로드하여 재고 데이터 일괄 등록
    """
    # 파일 확장자 검증
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in settings.ALLOWED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"지원하지 않는 파일 형식입니다. 허용된 형식: {', '.join(settings.ALLOWED_FILE_TYPES)}"
        )
    
    # 파일 크기 검증
    file_content = await file.read()
    if len(file_content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"파일 크기가 너무 큽니다. 최대 크기: {settings.MAX_FILE_SIZE / (1024*1024):.1f}MB"
        )
    
    try:
        # Excel 서비스를 사용하여 데이터 파싱
        excel_service = ExcelService()
        inventory_data = excel_service.parse_inventory_excel(file_content)
        
        # 데이터베이스에 저장
        created_items = []
        updated_items = []
        errors = []
        
        for item_data in inventory_data:
            try:
                # 기존 품목 확인
                existing_item = crud.inventory.get_by_item_code(
                    db=db, item_code=item_data["item_code"]
                )
                
                if existing_item:
                    # 기존 품목 업데이트
                    update_data = schemas.InventoryUpdate(**item_data)
                    updated_item = crud.inventory.update(
                        db=db, db_obj=existing_item, obj_in=update_data
                    )
                    updated_items.append(updated_item)
                else:
                    # 새 품목 생성
                    create_data = schemas.InventoryCreate(**item_data)
                    new_item = crud.inventory.create(db=db, obj_in=create_data)
                    created_items.append(new_item)
                    
            except Exception as e:
                errors.append(f"품목 코드 '{item_data.get('item_code', 'Unknown')}': {str(e)}")
        
        return {
            "message": "Excel 파일 업로드 완료",
            "created_count": len(created_items),
            "updated_count": len(updated_items),
            "error_count": len(errors),
            "errors": errors[:10]  # 최대 10개 에러만 반환
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"Excel 파일 처리 중 오류가 발생했습니다: {str(e)}"
        )

@router.get("/template")
def download_excel_template():
    """
    Excel 업로드 템플릿 다운로드
    """
    template_data = {
        "columns": [
            {"key": "item_code", "name": "품목코드", "required": True},
            {"key": "item_name", "name": "품목명", "required": True},
            {"key": "category", "name": "카테고리", "required": False},
            {"key": "brand", "name": "브랜드", "required": False},
            {"key": "current_stock", "name": "현재재고", "required": False},
            {"key": "minimum_stock", "name": "최소재고", "required": False},
            {"key": "maximum_stock", "name": "최대재고", "required": False},
            {"key": "unit_price", "name": "단가", "required": False},
            {"key": "currency", "name": "통화", "required": False},
            {"key": "supplier_name", "name": "공급업체명", "required": False},
            {"key": "supplier_contact", "name": "공급업체연락처", "required": False},
            {"key": "location", "name": "위치", "required": False},
            {"key": "warehouse", "name": "창고", "required": False},
            {"key": "description", "name": "설명", "required": False}
        ],
        "sample_data": [
            {
                "item_code": "ITEM001",
                "item_name": "샘플 품목 1",
                "category": "전자제품",
                "brand": "삼성",
                "current_stock": 100,
                "minimum_stock": 10,
                "maximum_stock": 500,
                "unit_price": 25000,
                "currency": "KRW",
                "supplier_name": "ABC 공급업체",
                "supplier_contact": "02-1234-5678",
                "location": "A-1-01",
                "warehouse": "메인창고",
                "description": "샘플 품목입니다."
            }
        ]
    }
    
    return template_data