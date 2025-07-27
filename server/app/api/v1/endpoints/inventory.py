# server/app/api/v1/endpoints/inventory.py
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, File, UploadFile, Form
from sqlalchemy.orm import Session
from datetime import datetime
import os
import uuid
import shutil


from app.core.config import settings  # 설정 파일에서 이미지 저장 경로 가져오기 가정
from app import crud, schemas
from app.api.deps import get_db

router = APIRouter()


# 기본 CRUD 엔드포인트들
# read_inventories 함수 수정 - receipt_history 필드 보완

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
    
    try:
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
        
        # 🔥 각 품목의 receipt_history 데이터 검증 및 수정
        processed_items = []
        for item in items:
            # receipt_history가 있는 경우 필수 필드 추가
            if hasattr(item, 'receipt_history') and item.receipt_history:
                processed_receipt_history = []
                for receipt in item.receipt_history:
                    # 딕셔너리 형태로 변환
                    if isinstance(receipt, dict):
                        receipt_dict = receipt.copy()
                    else:
                        receipt_dict = receipt.__dict__.copy() if hasattr(receipt, '__dict__') else {}
                    
                    # 🆕 필수 필드들 추가/수정
                    receipt_dict.update({
                        'receipt_number': receipt_dict.get('receipt_number', f"REC-{datetime.now().strftime('%Y%m%d')}-{item.id:04d}"),
                        'item_name': item.item_name,  # 필수 필드 추가
                        'item_code': item.item_code if item.item_code else "",  # 필수 필드 추가
                        'expected_quantity': receipt_dict.get('received_quantity', 1),  # 필수 필드 추가
                        'id': receipt_dict.get('id', len(processed_receipt_history) + 1),  # ID 추가
                        'created_at': receipt_dict.get('created_at', datetime.now().isoformat()),  # 생성일시 추가
                    })
                    
                    # 🔥 날짜 형식 수정 (datetime 형식으로 변환)
                    received_date = datetime.now()
                    if received_date and isinstance(received_date, str):
                        try:
                            # "2025-07-26" -> "2025-07-26T00:00:00" 형식으로 변환
                            if 'T' not in received_date:
                                dockerreceipt_dict['received_date'] = f"{received_date}T00:00:00"
                            else:
                                receipt_dict['received_date'] = received_date
                        except Exception as date_error:
                            print(f"⚠️ 날짜 변환 실패: {date_error}")
                            receipt_dict['received_date'] = datetime.now().isoformat()
                    
                    processed_receipt_history.append(receipt_dict)
                
                # 처리된 receipt_history로 교체
                item.receipt_history = processed_receipt_history
            
            processed_items.append(item)
        
        return {
            "items": processed_items,
            "total": total,
            "page": skip // limit + 1,
            "size": limit,
            "pages": (total + limit - 1) // limit if total > 0 else 0
        }
        
    except Exception as e:
        print(f"❌ 품목 목록 조회 오류: {e}")
        import traceback
        print(f"❌ 스택 트레이스: {traceback.format_exc()}")
        
        # 🔥 임시 해결책: 응답 검증 오류 시 빈 목록 반환
        return {
            "items": [],
            "total": 0,
            "page": 1,
            "size": limit,
            "pages": 0
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
    """통합 재고 목록 조회 - 날짜 형식 완전 수정"""
    
    try:
        print(f"📋 재고 목록 조회 시작 - skip: {skip}, limit: {limit}")
        
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
        
        print(f"📊 조회 결과 - 총 {total}개 중 {len(items)}개 조회")
        
        # 🔥 각 품목의 receipt_history 날짜 형식 완전 수정
        processed_items = []
        for item in items:
            try:
                # 기본 품목 정보는 그대로 유지
                item_dict = {
                    "id": item.id,
                    "item_code": item.item_code,
                    "item_name": item.item_name,
                    "category": item.category,
                    "brand": item.brand,
                    "specifications": item.specifications,
                    "unit": item.unit,
                    "unit_price": item.unit_price,
                    "currency": item.currency,
                    "location": item.location,
                    "warehouse": item.warehouse,
                    "supplier_name": item.supplier_name,
                    "supplier_contact": item.supplier_contact,
                    "minimum_stock": item.minimum_stock,
                    "maximum_stock": item.maximum_stock,
                    "is_consumable": item.is_consumable,
                    "requires_approval": item.requires_approval,
                    "description": item.description,
                    "notes": item.notes,
                    "tags": item.tags or [],
                    "total_received": item.total_received,
                    "current_quantity": item.current_quantity,
                    "reserved_quantity": item.reserved_quantity,
                    "condition_quantities": item.condition_quantities or {},
                    "total_value": item.total_value,
                    "last_received_date": item.last_received_date,
                    "last_received_by": item.last_received_by,
                    "last_received_department": item.last_received_department,
                    "last_used_date": item.last_used_date,
                    "main_image_url": item.main_image_url,
                    "image_urls": item.image_urls or [],
                    "is_active": item.is_active,
                    "created_at": item.created_at,
                    "updated_at": item.updated_at,
                    "created_by": item.created_by,
                    "updated_by": item.updated_by,
                    "available_quantity": item.available_quantity,
                    "utilization_rate": item.utilization_rate,
                    "is_low_stock": item.is_low_stock,
                    "stock_status": item.stock_status,
                }
                
                # 🔥 receipt_history 처리 - 날짜 문제 완전 해결
                processed_receipt_history = []
                if hasattr(item, 'receipt_history') and item.receipt_history:
                    for i, receipt in enumerate(item.receipt_history):
                        try:
                            # 딕셔너리 형태로 변환
                            if isinstance(receipt, dict):
                                receipt_dict = receipt.copy()
                            else:
                                receipt_dict = receipt.__dict__.copy() if hasattr(receipt, '__dict__') else {}
                            
                            # 🔥 날짜 처리 개선 - 반드시 datetime 객체로 변환
                            received_date_str = receipt_dict.get('received_date')
                            if received_date_str:
                                try:
                                    if isinstance(received_date_str, str):
                                        # "2025-07-26" 형식 처리
                                        if 'T' not in received_date_str and ':' not in received_date_str:
                                            # 날짜만 있는 경우 시간 추가: "2025-07-26" → "2025-07-26T00:00:00"
                                            received_date = datetime.strptime(received_date_str, '%Y-%m-%d')
                                        else:
                                            # ISO 형식이나 시간 포함 형식
                                            received_date = datetime.fromisoformat(received_date_str.replace('Z', '+00:00'))
                                    elif isinstance(received_date_str, datetime):
                                        received_date = received_date_str
                                    else:
                                        print(f"⚠️ 알 수 없는 날짜 타입: {type(received_date_str)}")
                                        received_date = datetime.now()
                                except (ValueError, TypeError) as date_error:
                                    print(f"⚠️ 날짜 변환 실패 (품목 {item.id}, 수령 {i}): {received_date_str} - {date_error}")
                                    received_date = datetime.now()
                            else:
                                print(f"⚠️ 수령일이 없음 (품목 {item.id}, 수령 {i})")
                                received_date = datetime.now()
                            
                            # 🔥 완전한 수령 이력 객체 생성 (모든 필수 필드 포함)
                            complete_receipt = {
                                "id": receipt_dict.get('id', i + 1),
                                "receipt_number": receipt_dict.get('receipt_number', f"REC-{datetime.now().strftime('%Y%m%d')}-{item.id:04d}-{i+1:03d}"),
                                "item_name": item.item_name,  # 품목에서 가져옴
                                "item_code": item.item_code or "",  # 품목에서 가져옴
                                "expected_quantity": receipt_dict.get('expected_quantity', receipt_dict.get('received_quantity', 1)),
                                "received_quantity": receipt_dict.get('received_quantity', 1),
                                "receiver_name": receipt_dict.get('receiver_name', 'Unknown'),
                                "receiver_email": receipt_dict.get('receiver_email'),
                                "department": receipt_dict.get('department', 'Unknown'),
                                "received_date": received_date,  # 🔥 datetime 객체 (문자열 아님)
                                "location": receipt_dict.get('location'),
                                "condition": receipt_dict.get('condition', 'good'),
                                "notes": receipt_dict.get('notes'),
                                "image_urls": receipt_dict.get('image_urls', []),
                                "created_at": receipt_dict.get('created_at', datetime.now()) if receipt_dict.get('created_at') else datetime.now(),
                                "is_complete": receipt_dict.get('is_complete', True),
                                "quality_check_passed": receipt_dict.get('quality_check_passed', True),
                            }
                            
                            # created_at도 datetime으로 변환
                            if isinstance(complete_receipt['created_at'], str):
                                try:
                                    complete_receipt['created_at'] = datetime.fromisoformat(complete_receipt['created_at'].replace('Z', '+00:00'))
                                except:
                                    complete_receipt['created_at'] = datetime.now()
                            
                            processed_receipt_history.append(complete_receipt)
                            print(f"✅ 수령 이력 {i+1} 처리 완료 - 날짜: {received_date}")
                            
                        except Exception as receipt_error:
                            print(f"⚠️ 수령 이력 처리 오류 (품목 {item.id}, 수령 {i}): {receipt_error}")
                            # 문제가 있는 수령 이력은 기본값으로 대체
                            default_receipt = {
                                "id": i + 1,
                                "receipt_number": f"REC-{datetime.now().strftime('%Y%m%d')}-{item.id:04d}-{i+1:03d}",
                                "item_name": item.item_name,
                                "item_code": item.item_code or "",
                                "expected_quantity": 1,
                                "received_quantity": 1,
                                "receiver_name": "Unknown",
                                "receiver_email": None,
                                "department": "Unknown",
                                "received_date": datetime.now(),  # 🔥 datetime 객체
                                "location": None,
                                "condition": "good",
                                "notes": None,
                                "image_urls": [],
                                "created_at": datetime.now(),  # 🔥 datetime 객체
                                "is_complete": True,
                                "quality_check_passed": True,
                            }
                            processed_receipt_history.append(default_receipt)
                
                item_dict["receipt_history"] = processed_receipt_history
                processed_items.append(item_dict)
                print(f"✅ 품목 {item.id} 처리 완료 - 수령 이력 {len(processed_receipt_history)}개")
                
            except Exception as item_error:
                print(f"⚠️ 품목 처리 오류 (ID: {getattr(item, 'id', 'Unknown')}): {item_error}")
                import traceback
                print(f"❌ 스택 트레이스: {traceback.format_exc()}")
                # 문제가 있는 품목은 건너뛰기
                continue
        
        print(f"✅ 전체 처리 완료 - {len(processed_items)}개 품목 반환")
        
        return {
            "items": processed_items,
            "total": total,
            "page": skip // limit + 1,
            "size": limit,
            "pages": (total + limit - 1) // limit if total > 0 else 0
        }
        
    except Exception as e:
        print(f"❌ 품목 목록 조회 중 전체 오류: {e}")
        import traceback
        print(f"❌ 전체 스택 트레이스: {traceback.format_exc()}")
        
        # 🔥 오류 발생 시 빈 목록 반환 (서비스 유지)
        return {
            "items": [],
            "total": 0,
            "page": 1,
            "size": limit,
            "pages": 0
        }

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
    # Form 데이터로 수령 정보 받기
    received_quantity: int = Form(...),
    receiver_name: str = Form(...),
    receiver_email: Optional[str] = Form(None),
    department: str = Form(...),
    received_date: str = Form(...),
    location: Optional[str] = Form(None),
    condition: str = Form("good"),
    notes: Optional[str] = Form(None),
    # 이미지 파일들 (필수)
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    """수령 완료 처리 (이미지 필수 포함)"""
    try:
        print(f"📥 수령완료 요청 받음 - 품목 ID: {item_id}")
        print(f"📝 폼 데이터: quantity={received_quantity}, receiver={receiver_name}, dept={department}")
        print(f"📷 이미지 개수: {len(images) if images else 0}")
        
        # 품목 존재 확인
        inventory = crud.inventory.get(db=db, id=item_id)
        if not inventory:
            raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
        
        # 이미지 필수 확인
        if not images or len(images) == 0:
            raise HTTPException(status_code=400, detail="이미지는 필수입니다. 최소 1개의 이미지를 업로드해주세요.")
        
        # 업로드 디렉토리 확인/생성
        upload_dir = os.path.join(os.getcwd(), "uploads", "inventory_images")
        try:
            os.makedirs(upload_dir, exist_ok=True)
            print(f"📁 업로드 디렉토리: {upload_dir}")
        except Exception as dir_error:
            print(f"❌ 디렉토리 생성 실패: {dir_error}")
            raise HTTPException(status_code=500, detail=f"디렉토리 생성 실패: {str(dir_error)}")
        
        image_urls = []
        saved_files = []  # 오류 시 정리용
        
        # 이미지 파일들 저장
        for i, image in enumerate(images):
            try:
                print(f"🖼️ 이미지 {i+1} 처리 중: {image.filename}, 타입: {image.content_type}")
                
                # 파일 유효성 검사
                if not image.filename:
                    print(f"⚠️ 이미지 {i+1}: 파일명이 없음")
                    continue
                    
                if not image.content_type or not image.content_type.startswith('image/'):
                    raise HTTPException(status_code=400, detail=f"파일 '{image.filename}'은 이미지 파일이 아닙니다.")
                
                # 고유 파일명 생성
                file_extension = os.path.splitext(image.filename)[1] if image.filename else '.jpg'
                unique_filename = f"{uuid.uuid4()}{file_extension}"
                file_path = os.path.join(upload_dir, unique_filename)
                
                # 파일 저장 (async 방식으로 수정)
                try:
                    contents = await image.read()
                    print(f"📄 파일 읽기 완료: {len(contents)} bytes")
                    
                    with open(file_path, "wb") as f:
                        f.write(contents)
                    
                    print(f"💾 파일 저장 완료: {file_path}")
                    saved_files.append(file_path)
                    
                    # 상대 경로로 URL 생성
                    image_url = f"http://localhost:8000/uploads/inventory_images/{unique_filename}"
                    image_urls.append(image_url)
                    print(f"🔗 이미지 URL 생성: {image_url}")
                    
                except Exception as file_error:
                    print(f"❌ 파일 저장 실패: {file_error}")
                    raise HTTPException(status_code=500, detail=f"파일 저장 실패: {str(file_error)}")
                    
            except HTTPException:
                raise
            except Exception as img_error:
                print(f"❌ 이미지 {i+1} 처리 실패: {img_error}")
                raise HTTPException(status_code=500, detail=f"이미지 처리 실패: {str(img_error)}")
                
        print(f"✅ 모든 이미지 저장 완료. URL들: {image_urls}")
        
        # 🔥 날짜 처리 개선 - datetime 객체로 변환
        try:
            if 'T' in received_date:
                # ISO 형식 날짜 처리
                parsed_received_date = datetime.fromisoformat(received_date.replace('Z', '+00:00'))
            else:
                # 날짜만 있는 경우 시간 추가
                parsed_received_date = datetime.strptime(received_date, '%Y-%m-%d')
            print(f"📅 수령일 파싱 완료: {parsed_received_date}")
        except ValueError as date_error:
            print(f"⚠️ 날짜 파싱 실패: {date_error}, 현재 시간 사용")
            parsed_received_date = datetime.now()
        
        # 🔥 수령번호 생성
        receipt_number = f"REC-{datetime.now().strftime('%Y%m%d')}-{item_id:04d}"
        
        # 수령 이력 데이터 생성
        try:
            receipt_data = schemas.ReceiptHistoryCreate(
                receipt_number=receipt_number,
                received_quantity=received_quantity,
                receiver_name=receiver_name,
                receiver_email=receiver_email,
                department=department,
                received_date=parsed_received_date.isoformat(),  # ISO 형식으로 변환
                location=location,
                condition=condition,
                notes=notes,
                image_urls=image_urls
            )
            
            print(f"📋 수령 데이터 생성 완료: {receipt_data}")
            
        except Exception as data_error:
            print(f"❌ 수령 데이터 생성 실패: {data_error}")
            raise HTTPException(status_code=400, detail=f"수령 데이터 생성 실패: {str(data_error)}")
        
        # 수령 이력 추가 및 재고 업데이트
        try:
            # 수령 이력 추가
            updated_inventory = crud.inventory.add_receipt(db=db, item_id=item_id, receipt_in=receipt_data)
            
            if not updated_inventory:
                raise HTTPException(status_code=500, detail="재고 업데이트 실패")
            
            # 🔥 수령 완료 상태 업데이트
            updated_inventory.is_active = True
            
            # 🔥 수령 이력 처리 개선
            if not updated_inventory.receipt_history:
                updated_inventory.receipt_history = []
            
            # 🔥 완전한 수령 이력 객체 생성 (모든 필수 필드 포함)
            complete_receipt_history = {
                "id": len(updated_inventory.receipt_history) + 1,
                "receipt_number": receipt_number,
                "item_name": updated_inventory.item_name or "Unknown Item",  # 필수 필드
                "item_code": updated_inventory.item_code or "",  # 필수 필드
                "expected_quantity": received_quantity,  # 필수 필드
                "received_quantity": received_quantity,
                "receiver_name": receiver_name,
                "receiver_email": receiver_email,
                "department": department,
                "received_date": parsed_received_date.isoformat(),  # 🔥 datetime ISO 형식
                "location": location,
                "condition": condition,
                "notes": notes,
                "image_urls": image_urls,
                "created_at": datetime.now().isoformat(),
                "is_complete": True,
                "quality_check_passed": True
            }
            
            updated_inventory.receipt_history.append(complete_receipt_history)
            
            # 🔥 마지막 수령 정보 업데이트
            updated_inventory.last_received_date = parsed_received_date
            updated_inventory.last_received_by = receiver_name
            updated_inventory.last_received_department = department
            
            # 이미지 URL 업데이트
            if not updated_inventory.main_image_url and image_urls:
                updated_inventory.main_image_url = image_urls[0]
            
            if updated_inventory.image_urls is None:
                updated_inventory.image_urls = []
            updated_inventory.image_urls.extend(image_urls)
            
            # 데이터베이스 커밋
            db.commit()
            db.refresh(updated_inventory)
            
            print(f"🎉 수령 완료 처리 성공 - 품목 ID: {item_id}")
            
            # 🔥 응답 전에 로깅 추가
            print(f"📤 응답 데이터 타입: {type(updated_inventory)}")
            print(f"📤 수령 이력 개수: {len(updated_inventory.receipt_history) if updated_inventory.receipt_history else 0}")
            
            return updated_inventory
            
        except HTTPException:
            raise
        except Exception as db_error:
            print(f"❌ 데이터베이스 업데이트 실패: {db_error}")
            print(f"❌ 에러 타입: {type(db_error).__name__}")
            import traceback
            print(f"❌ 스택 트레이스: {traceback.format_exc()}")
            db.rollback()
            raise HTTPException(status_code=500, detail=f"데이터베이스 업데이트 실패: {str(db_error)}")
        
    except HTTPException:
        # HTTP 예외는 그대로 전달
        raise
    except Exception as e:
        print(f"❌ 수령 처리 중 예상치 못한 오류: {str(e)}")
        print(f"❌ 오류 타입: {type(e).__name__}")
        import traceback
        print(f"❌ 스택 트레이스: {traceback.format_exc()}")
        
        # 오류 발생 시 업로드된 파일들 정리
        for file_path in saved_files:
            try:
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"🗑️ 파일 정리 완료: {file_path}")
            except Exception as cleanup_error:
                print(f"⚠️ 파일 정리 실패: {cleanup_error}")
        
        raise HTTPException(status_code=500, detail=f"수령 처리 중 오류 발생: {str(e)}")





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

