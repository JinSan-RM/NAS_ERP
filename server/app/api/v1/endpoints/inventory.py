# server/app/api/v1/endpoints/inventory.py
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.config import settings  # 설정 파일에서 이미지 저장 경로 가져오기 가정
from app import crud, schemas
from app.api.deps import get_db

router = APIRouter()


# 기본 CRUD 엔드포인트들
@router.get("/", response_model=schemas.UnifiedInventoryList)
def read_inventories(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    brand: Optional[str] = Query(None),
    supplier_name: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    warehouse: Optional[str] = Query(None),
    stock_status: Optional[str] = Query(None),
    is_consumable: Optional[bool] = Query(None),
    requires_approval: Optional[bool] = Query(None),
    is_active: Optional[bool] = Query(None),
    last_received_from: Optional[datetime] = Query(None),
    last_received_to: Optional[datetime] = Query(None),
    min_quantity: Optional[int] = Query(None),
    max_quantity: Optional[int] = Query(None),
    has_images: Optional[bool] = Query(None),
):
    """통합 재고 목록 조회"""
    
    # 필터 객체 생성
    filters = schemas.UnifiedInventoryFilter(
        search=search,
        category=category,
        brand=brand,
        supplier_name=supplier_name,
        location=location,
        warehouse=warehouse,
        stock_status=stock_status,
        is_consumable=is_consumable,
        requires_approval=requires_approval,
        last_received_from=last_received_from,
        last_received_to=last_received_to,
        min_quantity=min_quantity,
        max_quantity=max_quantity,
        has_images=has_images
    )
    
    items = crud.inventory.get_multi_with_filter(
        db=db, skip=skip, limit=limit, filters=filters
    )
    total = crud.inventory.count_with_filter(db=db, filters=filters)
    
    return {
        "items": items,
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 0
    }

@router.post("/", response_model=schemas.UnifiedInventoryInDB)
def create_inventory(
    inventory_in: schemas.UnifiedInventoryCreate,
    db: Session = Depends(get_db)
):
    """새 품목 생성"""
    existing_item = crud.inventory.get_by_item_code(db=db, item_code=inventory_in.item_code)
    if existing_item:
        raise HTTPException(
            status_code=400, 
            detail=f"품목 코드 '{inventory_in.item_code}'가 이미 존재합니다."
        )
    
    inventory = crud.inventory.create(db=db, obj_in=inventory_in)
    return inventory

@router.get("/stats", response_model=schemas.UnifiedInventoryStats)
def read_inventory_stats(db: Session = Depends(get_db)):
    """재고 통계 조회"""
    stats = crud.inventory.get_inventory_stats(db=db)
    return stats

@router.get("/categories", response_model=List[str])
def read_categories(db: Session = Depends(get_db)):
    """모든 카테고리 목록 조회"""
    return crud.inventory.get_categories(db=db)

@router.get("/low-stock", response_model=List[schemas.UnifiedInventoryInDB])
def read_low_stock_items(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000)
):
    """재고 부족 품목 조회"""
    return crud.inventory.get_low_stock_items(db=db, skip=skip, limit=limit)

@router.get("/out-of-stock", response_model=List[schemas.UnifiedInventoryInDB])
def read_out_of_stock_items(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000)
):
    """재고 없는 품목 조회"""
    return crud.inventory.get_out_of_stock_items(db=db, skip=skip, limit=limit)

@router.get("/dashboard", response_model=schemas.InventoryDashboard)
def read_dashboard_data(db: Session = Depends(get_db)):
    """대시보드 데이터 조회"""
    return crud.inventory.get_dashboard_data(db=db)

@router.get("/{item_id}", response_model=schemas.UnifiedInventoryInDB)
def read_inventory(
    item_id: int,
    db: Session = Depends(get_db)
):
    """품목 상세 조회"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    return inventory

@router.get("/code/{item_code}", response_model=schemas.UnifiedInventoryInDB)
def read_inventory_by_code(
    item_code: str,
    db: Session = Depends(get_db)
):
    """품목 코드로 재고 항목 조회"""
    inventory = crud.inventory.get_by_item_code(db=db, item_code=item_code)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    return inventory

@router.put("/{item_id}", response_model=schemas.UnifiedInventoryInDB)
def update_inventory(
    item_id: int,
    inventory_in: schemas.UnifiedInventoryUpdate,
    db: Session = Depends(get_db)
):
    """품목 정보 수정"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    inventory = crud.inventory.update(db=db, db_obj=inventory, obj_in=inventory_in)
    return inventory

@router.delete("/{item_id}")
def delete_inventory(
    item_id: int,
    db: Session = Depends(get_db)
):
    """품목 삭제"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    crud.inventory.remove(db=db, id=item_id)
    return {"message": "재고 항목이 삭제되었습니다."}

@router.post("/{item_id}/complete-receipt-with-images", response_model=schemas.UnifiedInventoryInDB)
async def complete_receipt_with_images(
    item_id: int,
    receipt_in: schemas.ReceiptHistoryCreate = Depends(),  # JSON 데이터
    images: List[UploadFile] = File(None),  # 여러 이미지 파일 (선택으로 유지)
    db: Session = Depends(get_db)
):
    """수령 완료 처리 (이미지 필수 포함)"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    # 이미지 필수 확인 (최소 1개)
    if not images or len(images) == 0:
        raise HTTPException(status_code=400, detail="이미지는 필수입니다. 최소 1개의 이미지를 업로드해주세요.")
    
    image_urls = []
    for image in images:
        if not image.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="이미지 파일만 업로드 가능합니다.")
        # 파일 저장 (기존 로직 유지)
        file_extension = image.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(settings.IMAGE_UPLOAD_DIR, filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"{settings.BASE_URL}/uploads/{filename}"
        image_urls.append(image_url)
    
    # receipt_in에 image_urls 추가 및 나머지 로직 (기존 코드 유지)
    receipt_data = receipt_in.dict()
    receipt_data['image_urls'] = image_urls
    updated_inventory = crud.inventory.add_receipt(db=db, item_id=item_id, receipt_in=receipt_data)
    inventory.total_received += receipt_data['received_quantity']
    inventory.current_quantity = inventory.total_received - (inventory.reserved_quantity or 0)
    condition = receipt_data.get('condition', 'good')
    if condition in inventory.condition_quantities:
        inventory.condition_quantities[condition] += receipt_data['received_quantity']
    db.commit()
    db.refresh(inventory)
    return inventory


@router.delete("/{item_id}/receipts/{receipt_number}/images/{image_index}")
def delete_receipt_image(
    item_id: int,
    receipt_number: str,
    image_index: int,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    receipt = next((r for r in inventory.receipt_history if r['receipt_number'] == receipt_number), None)
    if not receipt or image_index >= len(receipt.get('image_urls', [])):
        raise HTTPException(status_code=404, detail="이미지를 찾을 수 없습니다.")
    
    # URL 제거 (파일 삭제 로직 추가 가능)
    del receipt['image_urls'][image_index]
    db.commit()
    db.refresh(inventory)
    return {"message": "이미지가 삭제되었습니다."}

# 수령 관리 엔드포인트들
@router.post("/{item_id}/receipts", response_model=schemas.UnifiedInventoryInDB)
def add_receipt(
    item_id: int,
    receipt_in: schemas.ReceiptHistoryCreate,
    db: Session = Depends(get_db)
):
    try:
        # 기존 로직
        inventory = crud.inventory.get(db=db, id=item_id)
        if not inventory:
            raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
        
        inventory = crud.inventory.add_receipt(db=db, item_id=item_id, receipt_in=receipt_in)
        return inventory
    except Exception as e:
        print("오류 상세:", str(e))
        raise

@router.put("/{item_id}/receipts/{receipt_number}", response_model=schemas.UnifiedInventoryInDB)
def update_receipt(
    item_id: int,
    receipt_number: str,
    receipt_in: schemas.ReceiptHistoryCreate,
    db: Session = Depends(get_db)
):
    """수령 내역 수정"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    # 기존 수령 이력 확인
    old_receipt = next(
        (r for r in inventory.receipt_history if r.get('receipt_number') == receipt_number), 
        None
    )
    if not old_receipt:
        raise HTTPException(status_code=404, detail="수령 이력을 찾을 수 없습니다.")
    
    # 기존 수령 이력 제거
    inventory.receipt_history = [
        r for r in inventory.receipt_history 
        if r.get('receipt_number') != receipt_number
    ]
    
    # 새 수령 이력 추가
    new_receipt = receipt_in.dict()
    new_receipt['receipt_number'] = receipt_number
    inventory.receipt_history.append(new_receipt)
    
    # 수량 및 상태 업데이트
    inventory.total_received = sum(r.get('received_quantity', 0) for r in inventory.receipt_history)
    inventory.current_quantity = inventory.total_received - (inventory.reserved_quantity or 0)
    
    # 상태별 수량 업데이트
    condition_quantities = {"excellent": 0, "good": 0, "damaged": 0, "defective": 0}
    for r in inventory.receipt_history:
        condition = r.get('condition', 'good')
        if condition in condition_quantities:
            condition_quantities[condition] += r.get('received_quantity', 0)
    
    inventory.condition_quantities = condition_quantities
    
    db.commit()
    db.refresh(inventory)
    return inventory

@router.delete("/{item_id}/receipts/{receipt_number}", response_model=schemas.UnifiedInventoryInDB)
def delete_receipt(
    item_id: int,
    receipt_number: str,
    db: Session = Depends(get_db)
):
    """수령 내역 삭제"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    old_receipt = next(
        (r for r in inventory.receipt_history if r.get('receipt_number') == receipt_number), 
        None
    )
    if not old_receipt:
        raise HTTPException(status_code=404, detail="수령 이력을 찾을 수 없습니다.")
    
    # 수령 이력 제거
    inventory.receipt_history = [
        r for r in inventory.receipt_history 
        if r.get('receipt_number') != receipt_number
    ]
    
    # 수량 재계산
    inventory.total_received = sum(r.get('received_quantity', 0) for r in inventory.receipt_history)
    inventory.current_quantity = inventory.total_received - (inventory.reserved_quantity or 0)
    
    # 상태별 수량 재계산
    condition_quantities = {"excellent": 0, "good": 0, "damaged": 0, "defective": 0}
    for r in inventory.receipt_history:
        condition = r.get('condition', 'good')
        if condition in condition_quantities:
            condition_quantities[condition] += r.get('received_quantity', 0)
    
    inventory.condition_quantities = condition_quantities
    
    db.commit()
    db.refresh(inventory)
    return inventory

# 재고 수량 관리 엔드포인트들
@router.patch("/{item_id}/stock", response_model=schemas.UnifiedInventoryInDB)
def update_inventory_stock(
    item_id: int,
    quantity: int = Query(..., description="변경할 수량 (음수는 출고, 양수는 입고)"),
    db: Session = Depends(get_db)
):
    """재고 수량 업데이트"""
    inventory = crud.inventory.update_stock(db=db, item_id=item_id, quantity=quantity)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    return inventory

@router.patch("/{item_id}/quantity", response_model=schemas.UnifiedInventoryInDB)
def update_inventory_quantity(
    item_id: int,
    quantity_update: schemas.InventoryQuantityUpdate,
    db: Session = Depends(get_db)
):
    """재고 수량 간단 변경 (로그 없음)"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    # 간단한 수량 업데이트 (로그 없이)
    updated_inventory = crud.inventory.update_quantity(
        db=db, 
        item_id=item_id, 
        quantity_change=quantity_update.quantity_change,
        user_name=quantity_update.user_name,
        department=quantity_update.department,
        purpose=quantity_update.purpose,
        notes=quantity_update.notes
    )
    
    return updated_inventory

# 이미지 관리 엔드포인트들
@router.post("/{item_id}/images", response_model=schemas.ImageUploadResponse)
def upload_image(
    item_id: int,
    file: UploadFile = File(...),
    image_type: str = Query(default="general"),
    db: Session = Depends(get_db)
):
    if not file or not file.filename:
        raise HTTPException(status_code=400, detail="이미지 파일 필요")
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="이미지 파일만 가능")
    """품목 이미지 업로드"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    # 파일 검증
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="이미지 파일만 업로드 가능합니다.")
    
    # 파일 크기 제한 (10MB)
    if file.size > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="파일 크기는 10MB를 초과할 수 없습니다.")
    
    try:
        image_data = schemas.InventoryImageCreate(
            unified_inventory_id=item_id,
            image_type=image_type,
            description=f"{inventory.item_name} {image_type} 이미지"
        )
        
        uploaded_image = crud.inventory.upload_image(
            db=db, 
            file=file, 
            image_data=image_data
        )
        
        return {
            "success": True,
            "image_id": uploaded_image.id,
            "filename": uploaded_image.filename,
            "file_url": uploaded_image.file_path,
            "thumbnail_url": uploaded_image.thumbnail_path,
            "message": "이미지가 업로드되었습니다."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"이미지 업로드 실패: {str(e)}")

@router.delete("/{item_id}/images/{image_id}")
def delete_image(
    item_id: int,
    image_id: int,
    db: Session = Depends(get_db)
):
    """품목 이미지 삭제"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    success = crud.inventory.delete_image(db=db, image_id=image_id, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail="이미지를 찾을 수 없습니다.")
    
    return {"message": "이미지가 삭제되었습니다."}

# 품목 이동/전송 엔드포인트들
@router.post("/{item_id}/transfer", response_model=schemas.UnifiedInventoryInDB)
def transfer_item(
    item_id: int,
    transfer_data: schemas.InventoryTransfer,
    db: Session = Depends(get_db)
):
    """품목 이동/전송"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    if transfer_data.quantity > inventory.available_quantity:
        raise HTTPException(
            status_code=400, 
            detail=f"사용 가능한 수량({inventory.available_quantity})을 초과할 수 없습니다."
        )
    
    updated_inventory = crud.inventory.transfer_item(
        db=db, 
        item_id=item_id, 
        transfer_data=transfer_data
    )
    
    return updated_inventory

# QR 코드 생성 엔드포인트
@router.post("/{item_id}/qr-code", response_model=schemas.QRCodeResponse)
def generate_qr_code(
    item_id: int,
    qr_options: schemas.QRCodeGenerate,
    db: Session = Depends(get_db)
):
    """품목 QR 코드 생성"""
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    qr_code_data = crud.inventory.generate_qr_code(
        db=db, 
        item_id=item_id, 
        options=qr_options
    )
    
    return qr_code_data

# # Excel 관련 엔드포인트들
# @router.get("/export", response_class=FileResponse)
# def export_inventory_excel(
#     db: Session = Depends(get_db),
#     include_receipts: bool = Query(default=False),
#     include_usage_logs: bool = Query(default=False),
#     include_images: bool = Query(default=False),
#     categories: Optional[List[str]] = Query(None),
# ):
#     """재고 데이터 Excel 내보내기"""
#     export_options = schemas.InventoryExportOptions(
#         include_receipts=include_receipts,
#         include_usage_logs=include_usage_logs,
#         include_images=include_images,
#         categories=categories
#     )
    
#     file_path = crud.inventory.export_to_excel(db=db, options=export_options)
    
#     return FileResponse(
#         path=file_path,
#         media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
#         filename=f'inventory_export_{datetime.now().strftime("%Y%m%d_%H%M%S")}.xlsx'
#     )

# @router.post("/bulk-upload", response_model=schemas.InventoryImportResult)
# def bulk_upload_inventory(
#     file: UploadFile = File(...),
#     db: Session = Depends(get_db)
# ):
#     """Excel 파일로 품목 일괄 업로드"""
#     if not file.filename.endswith(('.xlsx', '.xls')):
#         raise HTTPException(status_code=400, detail="Excel 파일만 업로드 가능합니다.")
    
#     try:
#         import_result = crud.inventory.import_from_excel(db=db, file=file)
#         return import_result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"파일 처리 실패: {str(e)}")

# @router.get("/template/download", response_class=FileResponse)
# def download_template():
#     """품목 등록 템플릿 다운로드"""
#     template_path = crud.inventory.generate_template()
    
#     return FileResponse(
#         path=template_path,
#         media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
#         filename='unified_inventory_template.xlsx'
#     )

@router.get("/filters/options", response_model=Dict[str, List[str]])
def get_filter_options(db: Session = Depends(get_db)):
    """필터 옵션 조회 (카테고리, 브랜드, 공급업체 등)"""
    return {
        "categories": crud.inventory.get_categories(db=db),
        "brands": crud.inventory.get_brands(db=db),
        "suppliers": crud.inventory.get_suppliers(db=db),
        "locations": crud.inventory.get_locations(db=db),
        "warehouses": crud.inventory.get_warehouses(db=db),
        "tags": crud.inventory.get_all_tags(db=db)
    }


# @router.get("/analytics/trends", response_model=Dict[str, Any])
# def get_inventory_trends(
#     db: Session = Depends(get_db),
#     months: int = Query(default=12, ge=1, le=24)
# ):
#     """재고 동향 분석"""
#     return crud.inventory.get_inventory_trends(db=db, months=months)

# @router.get("/analytics/predictions", response_model=Dict[str, Any])
# def get_stock_predictions(
#     db: Session = Depends(get_db),
#     item_id: Optional[int] = Query(None),
#     category: Optional[str] = Query(None)
# ):
#     """재고 예측 분석"""
#     return crud.inventory.get_stock_predictions(
#         db=db, 
#         item_id=item_id, 
#         category=category
#     )

# 알림 및 알림 엔드포인트들
@router.get("/alerts", response_model=List[Dict[str, Any]])
def get_inventory_alerts(
    db: Session = Depends(get_db),
    alert_type: Optional[str] = Query(None),
    priority: Optional[str] = Query(None)
):
    """재고 관련 알림 조회"""
    return crud.inventory.get_alerts(
        db=db, 
        alert_type=alert_type, 
        priority=priority
    )

@router.get("/recommendations", response_model=List[str])
def get_inventory_recommendations(db: Session = Depends(get_db)):
    """재고 관리 추천사항"""
    return crud.inventory.get_recommendations(db=db)

# ✅ 유지해야 할 엔드포인트: 구매 요청에서 품목 생성
@router.post("/from-purchase-request", response_model=schemas.UnifiedInventoryInDB)
def create_inventory_from_purchase(
    purchase_data: schemas.CreateInventoryFromPurchase,
    db: Session = Depends(get_db)
):
    """구매 요청에서 품목 생성 - 이건 유지!"""
    # 구매 요청 존재 확인
    purchase_request = crud.purchase_request.get(db=db, id=purchase_data.purchase_request_id)
    if not purchase_request:
        raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
    
    # 이미 품목이 생성되었는지 확인
    existing_item = crud.inventory.get_by_purchase_request_id(
        db=db, 
        purchase_request_id=purchase_data.purchase_request_id
    )
    if existing_item:
        raise HTTPException(
            status_code=400, 
            detail="해당 구매 요청으로 이미 품목이 생성되었습니다."
        )
    
    # 품목 생성
    inventory_item = crud.inventory.create_from_purchase_request(
        db=db, 
        purchase_data=purchase_data
    )
    
    return inventory_item

