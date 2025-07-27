

# server/app/api/v1/endpoints/purchase_request.py - 완전히 수정된 버전

from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Response
from sqlalchemy.orm import Session
from sqlalchemy import text, func, or_, and_
import pandas as pd
from io import BytesIO
from datetime import datetime
from pydantic import BaseModel

from app import crud
from app.core.database import get_db
from app.enums import RequestStatus, UrgencyLevel
from app.schemas.purchase_request import (
    PurchaseRequest,
    PurchaseRequestCreate,
    PurchaseRequestUpdate,
    PurchaseRequestList,
    PurchaseRequestStats,
    PurchaseRequestFilter,
    PurchaseRequestResponse,
)
from app.crud.purchase_request import purchase_request as crud_purchase_request
from app.models.purchase_request import PurchaseRequest as DBPurchaseRequest

router = APIRouter()

# 🔥 CRUD 대신 직접 DB 쿼리로 구현
@router.get("/", response_model=PurchaseRequestList)
def read_purchase_requests(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=20, ge=1, le=100, description="반환할 최대 항목 수"),
    search: Optional[str] = Query(default=None, description="검색어"),
    status: Optional[str] = Query(default=None, description="상태 필터"),
    urgency: Optional[str] = Query(default=None, description="긴급도 필터"),
    department: Optional[str] = Query(default=None, description="부서 필터"),
    category: Optional[str] = Query(default=None, description="카테고리 필터"),
    requester_name: Optional[str] = Query(default=None, description="요청자 필터"),
    date_from: Optional[str] = Query(default=None, description="시작일 (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(default=None, description="종료일 (YYYY-MM-DD)"),
    min_budget: Optional[float] = Query(default=None, ge=0, description="최소 예산"),
    max_budget: Optional[float] = Query(default=None, ge=0, description="최대 예산")
):
    """
    구매 요청 목록 조회 - 유효하지 않은 status 필터링
    """
    try:
        print(f"🔍 구매 요청 목록 조회 시작")
        
        # 🔥 유효한 상태만 조회하도록 필터 추가
        valid_statuses = ['SUBMITTED', 'APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED']
        
        query = db.query(DBPurchaseRequest).filter(
            DBPurchaseRequest.status.in_(valid_statuses)  # 🔥 유효한 상태만 조회
        )
        
        # 기존 필터들 적용
        if search:
            query = query.filter(
                or_(
                    DBPurchaseRequest.item_name.ilike(f"%{search}%"),
                    DBPurchaseRequest.requester_name.ilike(f"%{search}%")
                )
            )
        
        if status and status in valid_statuses:  # 🔥 상태 필터도 검증
            query = query.filter(DBPurchaseRequest.status == status)
            
        if urgency:
            query = query.filter(DBPurchaseRequest.urgency == urgency)
            
        if department:
            query = query.filter(DBPurchaseRequest.department == department)
            
        if category:
            query = query.filter(DBPurchaseRequest.category == category)
            
        if requester_name:
            query = query.filter(DBPurchaseRequest.requester_name.ilike(f"%{requester_name}%"))
            
        if min_budget is not None:
            query = query.filter(DBPurchaseRequest.total_budget >= min_budget)
            
        if max_budget is not None:
            query = query.filter(DBPurchaseRequest.total_budget <= max_budget)
        
        # 날짜 필터
        if date_from:
            try:
                date_from_dt = datetime.strptime(date_from, '%Y-%m-%d')
                query = query.filter(DBPurchaseRequest.request_date >= date_from_dt)
            except ValueError:
                pass
                
        if date_to:
            try:
                date_to_dt = datetime.strptime(date_to, '%Y-%m-%d')
                query = query.filter(DBPurchaseRequest.request_date <= date_to_dt)
            except ValueError:
                pass
        
        # 총 개수 조회
        total = query.count()
        print(f"📊 총 개수: {total}")
        
        # 데이터 조회
        items = query.order_by(DBPurchaseRequest.id.desc()).offset(skip).limit(limit).all()
        print(f"📋 조회된 항목 수: {len(items)}")
        
        # Response 객체로 변환
        response_items = []
        for item in items:
            try:
                response_item = PurchaseRequestResponse.from_orm(item)
                response_items.append(response_item)
            except Exception as e:
                print(f"⚠️ 항목 변환 실패 (ID: {item.id}, Status: {item.status}): {e}")
                # 🔥 변환 실패 시 안전한 기본값으로 추가
                response_items.append({
                    "id": item.id,
                    "item_name": item.item_name or "품목명 없음",
                    "quantity": item.quantity or 0,
                    "requester_name": item.requester_name or "요청자 없음",
                    "department": item.department or "부서 없음",
                    "urgency": item.urgency or "NORMAL",
                    "status": "SUBMITTED",  # 🔥 안전한 기본값
                    "created_at": item.request_date.isoformat() if item.request_date else datetime.now().isoformat(),
                    "total_budget": float(item.total_budget or 0),
                    "estimated_unit_price": float(item.estimated_unit_price or 0),
                    "unit": item.unit or "개",
                    "currency": item.currency or "KRW"
                })
        
        result = {
            "items": response_items,
            "total": total,
            "page": skip // limit + 1,
            "size": limit,
            "pages": (total + limit - 1) // limit if total > 0 else 0
        }
        
        print(f"✅ 목록 조회 완료")
        return result
        
    except Exception as e:
        print(f"❌ 구매 요청 목록 조회 오류: {e}")
        import traceback
        print(f"📋 스택 트레이스: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"구매 요청 목록 조회 중 오류가 발생했습니다: {str(e)}"
        )

@router.post("/{request_id}/complete", response_model=dict)
def complete_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_id: int,
    completion_data: dict
):
    """
    완전한 구매 요청 완료 처리 - 품목 생성 포함
    """
    print(f"🔥 구매완료 API 호출 시작: request_id={request_id}")
    print(f"📥 수신 데이터: {completion_data}")
    
    try:
        # 1. 구매 요청 조회
        purchase_request = crud_purchase_request.get(db=db, id=request_id)
        
        if not purchase_request:
            raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
        
        print(f"✅ 구매 요청 조회 성공: {purchase_request.item_name}")
        
        # 2. 데이터 추출
        item_name = purchase_request.item_name
        quantity = purchase_request.quantity
        estimated_price = purchase_request.estimated_unit_price or 0
        category = purchase_request.category or 'OTHER'
        
        received_quantity = completion_data.get("received_quantity", quantity)
        unit_price = completion_data.get("unit_price", estimated_price)
        
        print(f"📊 데이터: {item_name}, 수량={received_quantity}, 단가={unit_price}")
        
        # 3. 🔥 품목 생성 (원시 SQL 사용)
        item_code = f"ITM-{datetime.now().strftime('%Y%m%d')}-{request_id:04d}"
        inventory_item_id = None
        
        try:
            print("🏭 품목 생성 시도...")
            
            # 원시 SQL로 unified_inventory에 품목 생성
            insert_sql = text("""
                INSERT INTO unified_inventory 
                (item_code, item_name, category, unit, unit_price, currency, 
                 location, warehouse, minimum_stock, maximum_stock, is_active, 
                 notes, created_at, total_received, current_quantity, 
                 reserved_quantity, available_quantity)
                VALUES 
                (:item_code, :item_name, :category, :unit, :unit_price, :currency,
                 :location, :warehouse, :minimum_stock, :maximum_stock, :is_active,
                 :notes, :created_at, :total_received, :current_quantity,
                 :reserved_quantity, :available_quantity)
                RETURNING id
            """)
            
            result = db.execute(insert_sql, {
                "item_code": item_code,
                "item_name": item_name,
                "category": str(category),
                "unit": "개",
                "unit_price": float(unit_price) if unit_price else 0.0,
                "currency": "KRW",
                "location": completion_data.get("location", "창고"),
                "warehouse": completion_data.get("warehouse", "메인창고"),
                "minimum_stock": 1,
                "maximum_stock": int(received_quantity) * 2 if received_quantity else 2,
                "is_active": True,
                "notes": f"구매요청 #{request_id}에서 생성됨",
                "created_at": datetime.now(),
                "total_received": int(received_quantity) if received_quantity else 0,
                "current_quantity": int(received_quantity) if received_quantity else 0,
                "reserved_quantity": 0,
                "available_quantity": int(received_quantity) if received_quantity else 0
            })
            
            inventory_item_id = result.fetchone()[0]
            print(f"✅ 품목 생성 성공: ID={inventory_item_id}, 코드={item_code}")
            
        except Exception as inv_error:
            print(f"⚠️ 품목 생성 실패: {inv_error}")
            # 품목 생성 실패해도 구매 요청은 완료 처리
            
        # 4. 구매 요청 상태 업데이트
        try:
            purchase_request.status = "COMPLETED"
            purchase_request.approved_date = datetime.now()
            purchase_request.approved_by = completion_data.get("completed_by", "시스템")
            
            # 품목 ID가 있으면 연결 (notes에 기록)
            if inventory_item_id:
                if purchase_request.notes:
                    purchase_request.notes += f"\n[품목등록완료] ID: {inventory_item_id}, 코드: {item_code}"
                else:
                    purchase_request.notes = f"[품목등록완료] ID: {inventory_item_id}, 코드: {item_code}"
            
            db.commit()
            db.refresh(purchase_request)
            
            print("✅ 구매 요청 상태 업데이트 완료")
            
        except Exception as update_error:
            print(f"❌ 상태 업데이트 실패: {update_error}")
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"상태 업데이트 실패: {str(update_error)}"
            )
        
        # 5. 🔥 성공 응답 - 품목 생성 여부에 따라 다른 응답
        if inventory_item_id:
            # 품목 생성 성공
            response_data = {
                "success": True,
                "message": "구매 요청이 완료되어 품목으로 등록되었습니다!",
                "purchase_request_id": request_id,
                "inventory_item_id": inventory_item_id,
                "inventory_item_code": item_code,
                "redirect_url": f"/inventory/{inventory_item_id}",
                "completed_fully": True,  # 🔥 완전히 완료됨을 표시
                "data": {
                    "id": purchase_request.id,
                    "item_name": item_name,
                    "quantity": received_quantity,
                    "status": "COMPLETED",
                    "item_code": item_code,
                    "inventory_created": True
                }
            }
        else:
            # 품목 생성 실패했지만 구매 요청은 완료
            response_data = {
                "success": True,
                "message": "구매 요청이 완료되었습니다. (품목 등록은 수동으로 진행해주세요)",
                "purchase_request_id": request_id,
                "completed_fully": False,  # 🔥 부분적으로만 완료됨
                "warning": "품목 자동 생성에 실패했습니다.",
                "data": {
                    "id": purchase_request.id,
                    "item_name": item_name,
                    "quantity": received_quantity,
                    "status": "COMPLETED",
                    "inventory_created": False
                }
            }
        
        print(f"🎉 처리 완료 응답: {response_data}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 예상치 못한 오류: {e}")
        import traceback
        print(f"📋 스택 트레이스: {traceback.format_exc()}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"처리 중 오류: {str(e)}"
        )
        
        
@router.post("/", response_model=dict)
def create_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_in: dict  # 🔥 스키마 대신 dict 사용
):
    """
    새 구매 요청 생성 - 유연한 데이터 처리
    """
    try:
        print(f"🆕 새 구매 요청 생성 시작")
        print(f"📥 수신 데이터: {request_in}")
        
        # 필수 필드 검증
        required_fields = ['item_name', 'quantity', 'requester_name', 'department', 'justification']
        for field in required_fields:
            if field not in request_in or not request_in[field]:
                raise HTTPException(
                    status_code=422,
                    detail=f"필수 필드가 누락되었습니다: {field}"
                )
        
        # request_number 자동 생성
        from datetime import datetime
        now = datetime.now()
        request_number = f"PR{now.strftime('%Y%m%d')}{now.microsecond//1000:03d}"
        
        # 안전한 데이터 생성 (실제 DB 컬럼에만 매핑)
        safe_data = {
            'request_number': request_number,
            'item_name': str(request_in['item_name']).strip(),
            'specifications': request_in.get('specifications'),
            'quantity': int(request_in['quantity']),
            'unit': request_in.get('unit', '개'),
            'estimated_unit_price': float(request_in.get('estimated_unit_price', 0)) if request_in.get('estimated_unit_price') else None,
            'total_budget': float(request_in.get('total_budget', 0)) if request_in.get('total_budget') else None,
            'currency': request_in.get('currency', 'KRW'),
            'category': request_in.get('category', 'OTHER'),
            'urgency': request_in.get('urgency', 'NORMAL'),
            'purchase_method': request_in.get('purchase_method', 'DIRECT'),
            'requester_name': str(request_in['requester_name']).strip(),
            'requester_email': request_in.get('requester_email'),
            'department': str(request_in['department']).strip(),
            'position': request_in.get('position'),
            'phone_number': request_in.get('phone_number'),
            'project': request_in.get('project'),
            'budget_code': request_in.get('budget_code'),
            'cost_center': request_in.get('cost_center'),
            'preferred_supplier': request_in.get('preferred_supplier'),
            'supplier_contact': request_in.get('supplier_contact'),
            'justification': str(request_in['justification']).strip(),
            'business_case': request_in.get('business_case'),
            'notes': request_in.get('notes'),
            'status': 'SUBMITTED',
            'request_date': now,
        }
        
        # expected_delivery_date 처리
        if request_in.get('expected_delivery_date'):
            try:
                if isinstance(request_in['expected_delivery_date'], str):
                    safe_data['expected_delivery_date'] = datetime.strptime(
                        request_in['expected_delivery_date'], '%Y-%m-%d'
                    ).date()
                else:
                    safe_data['expected_delivery_date'] = request_in['expected_delivery_date']
            except ValueError:
                print(f"⚠️ 잘못된 날짜 형식: {request_in['expected_delivery_date']}")
        
        # total_budget 자동 계산
        if not safe_data['total_budget'] and safe_data['estimated_unit_price'] and safe_data['quantity']:
            safe_data['total_budget'] = safe_data['estimated_unit_price'] * safe_data['quantity']
        
        print(f"📋 처리된 안전 데이터: {safe_data}")
        
        # None 값 제거 (선택사항)
        filtered_data = {k: v for k, v in safe_data.items() if v is not None}
        
        # DB 객체 생성
        purchase_request = DBPurchaseRequest(**filtered_data)
        db.add(purchase_request)
        db.commit()
        db.refresh(purchase_request)
        
        print(f"✅ 구매 요청 생성 완료: ID={purchase_request.id}")
        
        return {
            "success": True,
            "message": "구매 요청이 성공적으로 생성되었습니다.",
            "data": {
                "id": purchase_request.id,
                "request_number": purchase_request.request_number,
                "item_name": purchase_request.item_name,
                "status": purchase_request.status,
                "total_budget": purchase_request.total_budget,
                "department": purchase_request.department,
                "requester_name": purchase_request.requester_name
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ 구매 요청 생성 실패: {e}")
        import traceback
        print(f"📋 스택 트레이스: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"구매 요청 생성에 실패했습니다: {str(e)}"
        )

@router.get("/stats", response_model=PurchaseRequestStats)
def read_purchase_request_stats(db: Session = Depends(get_db)):
    """
    구매 요청 통계 조회 - 직접 쿼리 방식
    """
    try:
        print("📊 통계 조회 시작")
        
        # 전체 개수
        total = db.query(func.count(DBPurchaseRequest.id)).scalar() or 0
        
        # 상태별 개수
        pending = db.query(func.count(DBPurchaseRequest.id)).filter(
            DBPurchaseRequest.status == 'SUBMITTED'
        ).scalar() or 0
        
        approved = db.query(func.count(DBPurchaseRequest.id)).filter(
            DBPurchaseRequest.status == 'APPROVED'
        ).scalar() or 0
        
        rejected = db.query(func.count(DBPurchaseRequest.id)).filter(
            DBPurchaseRequest.status == 'REJECTED'
        ).scalar() or 0
        
        completed = db.query(func.count(DBPurchaseRequest.id)).filter(
            DBPurchaseRequest.status == 'COMPLETED'
        ).scalar() or 0
        
        # 이번 달 요청
        current_month = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        this_month = db.query(func.count(DBPurchaseRequest.id)).filter(
            DBPurchaseRequest.request_date >= current_month
        ).scalar() or 0
        
        # 총 예산
        total_budget = db.query(func.sum(DBPurchaseRequest.total_budget)).scalar() or 0.0
        
        stats = {
            "total": total,
            "pending": pending,
            "approved": approved,
            "rejected": rejected,
            "completed": completed,
            "this_month": this_month,
            "total_budget": float(total_budget),
            "average_approval_time": None
        }
        
        print(f"✅ 통계 조회 완료: {stats}")
        return stats
        
    except Exception as e:
        print(f"❌ 통계 조회 오류: {e}")
        # 기본값 반환
        return {
            "total": 0,
            "pending": 0,
            "approved": 0,
            "rejected": 0,
            "completed": 0,
            "this_month": 0,
            "total_budget": 0.0,
            "average_approval_time": None
        }
@router.get("/categories", response_model=List[str])
def read_categories(db: Session = Depends(get_db)):
    """
    구매 요청에서 사용된 카테고리 목록 조회
    """
    return crud.purchase_request.get_categories(db=db)

@router.get("/departments", response_model=List[str])
def read_departments(db: Session = Depends(get_db)):
    """
    구매 요청에서 사용된 부서 목록 조회
    """
    return crud.purchase_request.get_departments(db=db)

@router.get("/suppliers", response_model=List[str])
def read_suppliers(db: Session = Depends(get_db)):
    """
    구매 요청에서 사용된 공급업체 목록 조회
    """
    return crud.purchase_request.get_suppliers(db=db)

@router.get("/pending", response_model=List[PurchaseRequest])
def read_pending_requests(
    db: Session = Depends(get_db),
    limit: int = Query(default=50, ge=1, le=100, description="반환할 최대 항목 수")
):
    """
    승인 대기 중인 구매 요청들 조회
    """
    return crud.purchase_request.get_pending_requests(db=db, limit=limit)

@router.get("/urgent", response_model=List[PurchaseRequest])
def read_urgent_requests(
    db: Session = Depends(get_db),
    limit: int = Query(default=30, ge=1, le=100, description="반환할 최대 항목 수")
):
    """
    긴급 구매 요청들 조회
    """
    return crud.purchase_request.get_urgent_requests(db=db, limit=limit)

@router.get("/recent", response_model=List[PurchaseRequest])
def read_recent_requests(
    db: Session = Depends(get_db),
    days: int = Query(default=7, ge=1, le=30, description="최근 며칠"),
    limit: int = Query(default=50, ge=1, le=100, description="반환할 최대 항목 수")
):
    """
    최근 구매 요청들 조회
    """
    return crud.purchase_request.get_recent_requests(db=db, days=days, limit=limit)

@router.get("/{request_id}", response_model=PurchaseRequest)
def read_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_id: int
):
    """
    특정 구매 요청 조회
    """
    purchase_request = crud.purchase_request.get(db=db, id=request_id)
    if not purchase_request:
        raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
    return purchase_request

@router.put("/{request_id}", response_model=dict)  # 🔥 경로 수정: "/purchase-requests/" 제거
async def update_purchase_request(
    request_id: int,
    update_data: PurchaseRequestUpdate,
    db: Session = Depends(get_db)
):
    """
    구매 요청 업데이트 (405 에러 수정)
    올바른 경로: PUT /api/v1/purchase-requests/{request_id}
    """
    print(f"🔥 PUT 엔드포인트 호출됨: ID={request_id}")
    print(f"📝 업데이트 데이터: {update_data.dict(exclude_unset=True)}")
    
    try:
        # 1. 기존 요청 조회
        purchase_request = db.query(DBPurchaseRequest).filter(
            DBPurchaseRequest.id == request_id
        ).first()
        
        if not purchase_request:
            print(f"❌ 구매 요청 {request_id}를 찾을 수 없음")
            raise HTTPException(
                status_code=404, 
                detail=f"구매 요청 {request_id}를 찾을 수 없습니다"
            )
        
        print(f"✅ 기존 구매 요청 조회 성공: {purchase_request.item_name}")
        
        # 2. 업데이트 데이터 적용
        update_dict = update_data.dict(exclude_unset=True)
        print(f"📤 적용할 필드: {list(update_dict.keys())}")
        
        for field, value in update_dict.items():
            if hasattr(purchase_request, field):
                setattr(purchase_request, field, value)
                print(f"🔄 {field} = {value}")
        
        # 3. 특별 처리: 상태가 COMPLETED로 변경되는 경우
        if update_data.status and str(update_data.status) == "COMPLETED":
            print("🎯 구매완료 상태로 변경 중...")
            
            # 현재 시간으로 승인일 설정
            purchase_request.approved_date = datetime.now()
            if not purchase_request.approved_by:
                purchase_request.approved_by = "현재사용자"
            
            print("✅ 완료 처리 데이터 설정됨")
        
        # 4. updated_at 설정
        purchase_request.updated_at = datetime.now()
        
        # 5. 데이터베이스 저장
        db.commit()
        db.refresh(purchase_request)
        
        print(f"💾 구매 요청 {request_id} 업데이트 성공")
        
        # 6. 응답 데이터 구성
        response_data = {
            "success": True,
            "message": "구매 요청이 성공적으로 업데이트되었습니다.",
            "data": {
                "id": purchase_request.id,
                "item_name": purchase_request.item_name,
                "quantity": purchase_request.quantity,
                "status": purchase_request.status,
                "department": purchase_request.department,
                "requester_name": purchase_request.requester_name,
                "updated_at": purchase_request.updated_at.isoformat() if purchase_request.updated_at else None
            }
        }
        
        print(f"🎉 응답 데이터: {response_data}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        print(f"❌ 데이터베이스 오류: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"데이터베이스 업데이트 실패: {str(e)}"
        )

@router.delete("/{request_id}")
def delete_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_id: int
):
    """
    구매 요청 삭제 (소프트 삭제)
    """
    purchase_request = crud.purchase_request.get(db=db, id=request_id)
    if not purchase_request:
        raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
    
    # 상태에 따른 삭제 권한 확인
    if purchase_request.status in [RequestStatus.APPROVED]:
        raise HTTPException(
            status_code=400,
            detail="승인된 요청은 삭제할 수 없습니다."
        )
    
    crud.purchase_request.soft_delete(db=db, id=request_id)
    return {"message": "구매 요청이 삭제되었습니다."}


@router.post("/bulk-upload", response_model=dict)
def bulk_upload_purchase_requests(
    *,
    db: Session = Depends(get_db),
    file: UploadFile = File(..., description="Excel 파일")
):
    """
    Excel 파일을 통한 구매 요청 대량 업로드
    """
    if not file.filename or not file.filename.endswith(('.xlsx', '.xls')):
        raise HTTPException(
            status_code=400,
            detail="Excel 파일만 업로드 가능합니다 (.xlsx, .xls)"
        )
    
    try:
        # 파일 읽기
        content = file.file.read()
        df = pd.read_excel(BytesIO(content))
        
        # 필수 컬럼 확인
        required_columns = ['품목명', '수량', '요청자명', '부서', '구매사유']
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise HTTPException(
                status_code=400,
                detail=f"필수 컬럼이 없습니다: {missing_columns}"
            )
        
        # 데이터 변환
        requests_data = []
        for index, row in df.iterrows():
            try:
                request_data = PurchaseRequestCreate(
                    item_name=str(row['품목명']).strip(),
                    specifications=str(row.get('사양', '')).strip() if pd.notna(row.get('사양')) else None,
                    quantity=int(row['수량']) if pd.notna(row['수량']) else 1,
                    unit=str(row.get('단위', '개')).strip() if pd.notna(row.get('단위')) else '개',
                    estimated_unit_price=float(row['예상단가']) if pd.notna(row.get('예상단가')) else None,
                    preferred_supplier=str(row.get('공급업체', '')).strip() if pd.notna(row.get('공급업체')) else None,
                    category=str(row.get('카테고리', '')).strip() if pd.notna(row.get('카테고리')) else None,
                    urgency=UrgencyLevel(row.get('긴급도', 'normal')) if pd.notna(row.get('긴급도')) else UrgencyLevel.NORMAL,
                    requester_name=str(row['요청자명']).strip(),
                    requester_email=str(row.get('요청자이메일', '')).strip() if pd.notna(row.get('요청자이메일')) else None,
                    department=str(row['부서']).strip(),
                    phone_number=str(row.get('연락처', '')).strip() if pd.notna(row.get('연락처')) else None,
                    project=str(row.get('프로젝트', '')).strip() if pd.notna(row.get('프로젝트')) else None,
                    budget_code=str(row.get('예산코드', '')).strip() if pd.notna(row.get('예산코드')) else None,
                    justification=str(row['구매사유']).strip(),
                    additional_notes=str(row.get('비고', '')).strip() if pd.notna(row.get('비고')) else None
                )
                requests_data.append(request_data)
            except Exception as e:
                raise HTTPException(
                    status_code=400,
                    detail=f"행 {index + 2}에서 오류: {str(e)}"
                )
        
        # 대량 생성
        created_requests = crud.purchase_request.bulk_create(db=db, items=requests_data)
        
        return {
            "message": f"{len(created_requests)}개의 구매 요청이 성공적으로 업로드되었습니다.",
            "created_count": len(created_requests),
            "request_numbers": [req.request_number for req in created_requests]
        }
        
    except pd.errors.EmptyDataError:
        raise HTTPException(status_code=400, detail="Excel 파일이 비어있습니다.")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"파일 처리 중 오류: {str(e)}")

@router.get("/export/excel")
def export_purchase_requests_excel(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(default=None),
    status: Optional[RequestStatus] = Query(default=None),
    urgency: Optional[UrgencyLevel] = Query(default=None),
    department: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    date_from: Optional[str] = Query(default=None),
    date_to: Optional[str] = Query(default=None)
):
    """
    구매 요청 목록을 Excel 파일로 내보내기
    """
    # 필터 설정
    filters = PurchaseRequestFilter(
        search=search,
        status=status,
        urgency=urgency,
        department=department,
        category=category,
        date_from=pd.to_datetime(date_from) if date_from else None,
        date_to=pd.to_datetime(date_to) if date_to else None
    )
    
    # 모든 데이터 조회 (제한 없음)
    requests = crud.purchase_request.get_multi_with_filter(
        db=db, skip=0, limit=10000, filters=filters
    )
    
    # DataFrame 생성
    data = []
    for req in requests:
        data.append({
            '요청번호': req.request_number,
            '품목명': req.item_name,
            '사양': req.specifications or '',
            '수량': req.quantity,
            '단위': req.unit,
            '예상단가': req.estimated_unit_price or 0,
            '총예산': req.total_budget or 0,
            '공급업체': req.preferred_supplier or '',
            '카테고리': req.category or '',
            '긴급도': req.urgency.value,
            '상태': req.status.value,
            '요청자': req.requester_name,
            '부서': req.department,
            '프로젝트': req.project or '',
            '예산코드': req.budget_code or '',
            '구매사유': req.justification,
            '요청일': req.created_at.strftime('%Y-%m-%d'),
            '승인자': req.approver_name or '',
            '승인일': req.approval_date.strftime('%Y-%m-%d') if req.approval_date else '',
            '비고': req.additional_notes or ''
        })
    
    df = pd.DataFrame(data)
    
    # Excel 파일 생성
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='구매요청목록', index=False)
        
        # 워크시트 스타일링
        worksheet = writer.sheets['구매요청목록']
        
        # 컬럼 너비 조정
        for column in worksheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 50)
            worksheet.column_dimensions[column_letter].width = adjusted_width
    
    output.seek(0)
    
    # 파일명 생성
    from datetime import datetime
    today = datetime.now().strftime('%Y%m%d')
    filename = f"purchase_requests_{today}.xlsx"
    
    # 응답 생성
    response = Response(
        content=output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response.headers["Content-Disposition"] = f"attachment; filename={filename}"
    
    return response

@router.get("/template/download")
def download_upload_template():
    """
    구매 요청 업로드용 Excel 템플릿 다운로드
    """
    # 템플릿 데이터 생성
    template_data = {
        '품목명': ['노트북', '사무용 의자'],
        '사양': ['14인치, 8GB RAM, 256GB SSD', '인체공학적 디자인'],
        '수량': [2, 5],
        '단위': ['대', '개'],
        '예상단가': [1200000, 250000],
        '공급업체': ['테크월드', '오피스퍼니처'],
        '카테고리': ['전자기기', '사무용품'],
        '긴급도': ['normal', 'high'],
        '요청자명': ['김철수', '이영희'],
        '요청자이메일': ['kim@company.com', 'lee@company.com'],
        '부서': ['개발팀', '총무부'],
        '연락처': ['010-1234-5678', '010-8765-4321'],
        '프로젝트': ['신제품개발', '사무환경개선'],
        '예산코드': ['DEV001', 'ADM002'],
        '구매사유': ['신입사원 업무용', '기존 의자 노후화'],
        '비고': ['고성능 모델 필요', '인체공학적 디자인 우선']
    }
    
    df = pd.DataFrame(template_data)
    
    # Excel 파일 생성
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='구매요청템플릿', index=False)
        
        # 워크시트 스타일링
        worksheet = writer.sheets['구매요청템플릿']
        
        # 컬럼 너비 조정
        for column in worksheet.columns:
            max_length = 0
            column_letter = column[0].column_letter
            for cell in column:
                try:
                    if len(str(cell.value)) > max_length:
                        max_length = len(str(cell.value))
                except:
                    pass
            adjusted_width = min(max_length + 2, 30)
            worksheet.column_dimensions[column_letter].width = adjusted_width
    
    output.seek(0)
    
    # 응답 생성
    response = Response(
        content=output.getvalue(),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response.headers["Content-Disposition"] = "attachment; filename=purchase_request_template.xlsx"
    
    return response

# server/app/api/v1/endpoints/purchase_request.py 에 추가할 엔드포인트

@router.post("/{request_id}/complete", response_model=dict)
def complete_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_id: int,
    completion_data: dict
):
    """
    실제 DB 스키마에 맞는 구매 요청 완료 처리
    """
    print(f"🔥 구매완료 API 호출 시작: request_id={request_id}")
    print(f"📥 수신 데이터: {completion_data}")
    
    try:
        # 1. 구매 요청 조회
        purchase_request = crud.purchase_request.get(db=db, id=request_id)
        if not purchase_request:
            raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
        
        print(f"✅ 구매 요청 조회 성공")
        
        # 2. 데이터 추출
        item_name = getattr(purchase_request, 'item_name', '품목명 없음')
        quantity = getattr(purchase_request, 'quantity', 1)
        estimated_price = getattr(purchase_request, 'estimated_unit_price', 0)
        category = getattr(purchase_request, 'category', 'OTHER')
        
        received_quantity = completion_data.get("received_quantity", quantity)
        unit_price = completion_data.get("unit_price", estimated_price)
        
        print(f"📊 데이터: {item_name}, 수량={received_quantity}, 단가={unit_price}")
        
        # 3. 품목 생성 시도 (실제 스키마에 맞게)
        item_code = f"ITM-{datetime.now().strftime('%Y%m%d')}-{request_id:04d}"
        created_inventory = None
        
        try:
            print("🏭 품목 생성 시도...")
            
            # 실제 unified_inventory 스키마에 맞는 데이터
            inventory_data = {
                "item_code": item_code,
                "item_name": item_name,
                "category": str(category) if category else "OTHER",  # 문자열로 변환
                "unit": "개",
                "unit_price": float(unit_price) if unit_price else 0.0,
                "currency": "KRW",
                "location": completion_data.get("location", "창고"),
                "warehouse": completion_data.get("warehouse", "메인창고"),
                "minimum_stock": 1,
                "maximum_stock": int(received_quantity) * 2 if received_quantity else 2,
                "is_active": True,
                "notes": f"구매요청 #{request_id}에서 생성",
                "total_received": int(received_quantity) if received_quantity else 0,
                "current_quantity": int(received_quantity) if received_quantity else 0,
                "reserved_quantity": 0,
                "condition_quantities": {"excellent": 0, "good": int(received_quantity) if received_quantity else 0, "damaged": 0, "defective": 0},
                "receipt_history": [],
                "image_urls": [],
                "tags": ["구매완료"]
            }
            
            print(f"📋 품목 생성 데이터: {inventory_data}")
            created_inventory = crud.inventory.create(db=db, obj_in=inventory_data)
            print(f"✅ 품목 생성 성공: ID={created_inventory.id}")
            
        except Exception as inv_error:
            print(f"⚠️ 품목 생성 실패 (계속 진행): {inv_error}")
            db.rollback()  # 품목 생성 실패 시 롤백
        
        # 4. 구매 요청 상태 업데이트 (실제 필드명 사용)
        print("📝 상태 업데이트 중...")
        
        try:
            # 실제 스키마에 맞는 업데이트
            now = datetime.now()
            
            update_sql = text("""
                UPDATE purchase_requests 
                SET status = :status,
                    approved_date = :approved_date,
                    approved_by = :approved_by,
                    updated_at = :updated_at
                WHERE id = :id
            """)
            
            params = {
                "status": "COMPLETED",
                "approved_date": now,  # completed_date 대신 approved_date 사용
                "approved_by": completion_data.get("completed_by", "시스템"),  # completed_by 대신 approved_by 사용
                "updated_at": now,
                "id": request_id
            }
            
            result = db.execute(update_sql, params)
            
            if result.rowcount > 0:
                print("✅ 기본 상태 업데이트 완료")
                
                # 품목 ID 연결은 별도 필드가 없으므로 notes에 기록
                if created_inventory:
                    try:
                        notes_sql = text("""
                            UPDATE purchase_requests 
                            SET notes = COALESCE(notes, '') || :inventory_note
                            WHERE id = :id
                        """)
                        db.execute(notes_sql, {
                            "inventory_note": f"\n[품목 등록] 품목코드: {item_code}, 품목ID: {created_inventory.id}",
                            "id": request_id
                        })
                        print("✅ 품목 정보 기록 완료")
                    except Exception as note_error:
                        print(f"⚠️ 품목 정보 기록 실패 (무시): {note_error}")
                
                db.commit()
                print("✅ 전체 업데이트 완료")
            else:
                raise Exception("업데이트된 레코드가 없습니다.")
                
        except Exception as update_error:
            print(f"❌ 상태 업데이트 실패: {update_error}")
            db.rollback()
            raise HTTPException(
                status_code=500,
                detail=f"상태 업데이트 실패: {str(update_error)}"
            )
        
        # 5. 성공 응답
        response_data = {
            "success": True,
            "message": "구매 요청이 완료되었습니다.",
            "purchase_request_id": request_id,
            "data": {
                "item_name": item_name,
                "quantity": received_quantity,
                "status": "COMPLETED"
            }
        }
        
        if created_inventory:
            response_data.update({
                "inventory_item_id": created_inventory.id,
                "inventory_item_code": item_code,
                "redirect_url": f"/inventory/{created_inventory.id}",
                "message": "구매 요청이 완료되어 품목으로 등록되었습니다."
            })
            response_data["data"]["item_code"] = item_code
        else:
            response_data.update({
                "message": "구매 요청이 완료되었습니다. (품목 등록은 수동으로 진행해주세요)",
                "warning": "품목 자동 생성에 실패했습니다."
            })
        
        print(f"🎉 처리 완료: {response_data}")
        return response_data
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"💥 예상치 못한 오류: {e}")
        import traceback
        print(f"📋 스택 트레이스: {traceback.format_exc()}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"처리 중 오류: {str(e)}"
        )
        
# 완료 처리용 스키마 추가
class PurchaseRequestCompletionData(BaseModel):
    received_quantity: Optional[int] = None
    receiver_name: Optional[str] = None
    receiver_email: Optional[str] = None
    received_date: Optional[datetime] = None
    location: Optional[str] = "창고"
    condition: Optional[str] = "good"
    notes: Optional[str] = None
    completed_by: Optional[str] = "시스템"

# @router.post("/{request_id}/complete", response_model=dict)
# def complete_purchase_request(
#     *,
#     db: Session = Depends(get_db),
#     request_id: int,
#     completion_data: PurchaseRequestCompletionData
# ):
#     """
#     구매 요청 완료 처리 - 품목 자동 생성 포함
#     """
#     try:
#         # 구매 요청 조회
#         purchase_request = crud.purchase_request.get(db=db, id=request_id)
#         if not purchase_request:
#             raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
        
#         if purchase_request.status != RequestStatus.APPROVED:
#             raise HTTPException(
#                 status_code=400,
#                 detail="승인된 구매 요청만 완료 처리할 수 있습니다."
#             )
        
#         # 완료 데이터 준비
#         completion_dict = completion_data.dict()
#         completion_dict['completed_date'] = datetime.now()
        
#         # 트랜잭션으로 안전하게 처리
#         try:
#             # 1. 품목 생성
#             created_inventory = crud.inventory.create_from_purchase_request(
#                 db=db,
#                 purchase_request=purchase_request,
#                 completion_data=completion_dict
#             )
            
#             # 2. 구매 요청 완료 처리
#             completion_dict['inventory_item_id'] = created_inventory.id
#             completed_request = crud.purchase_request.complete_purchase(
#                 db=db,
#                 request_id=request_id,
#                 completion_data=completion_dict
#             )
            
#             return {
#                 "success": True,
#                 "message": "구매 요청이 완료되어 품목으로 등록되었습니다.",
#                 "purchase_request_id": request_id,
#                 "inventory_item_id": created_inventory.id,
#                 "inventory_item_code": created_inventory.item_code,
#                 "redirect_url": f"/inventory/{created_inventory.id}"
#             }
            
#         except Exception as e:
#             db.rollback()
#             raise HTTPException(
#                 status_code=500,
#                 detail=f"구매 완료 처리 중 오류가 발생했습니다: {str(e)}"
#             )
            
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(
#             status_code=500,
#             detail=f"알 수 없는 오류가 발생했습니다: {str(e)}"
#         )

# 활성 요청만 조회하는 엔드포인트 추가
@router.get("/active", response_model=List[PurchaseRequest])
def read_active_requests(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=20, ge=1, le=100)
):
    """
    완료되지 않은 활성 구매 요청들만 조회
    """
    return crud.purchase_request.get_active_requests_only(db=db, skip=skip, limit=limit)

# 1단계: 먼저 테이블 구조 확인
@router.get("/debug/check-tables")
def check_table_structure(db: Session = Depends(get_db)):
    """테이블 구조 확인"""
    try:
        # purchase_requests 테이블 구조 확인
        purchase_columns = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'purchase_requests'
            ORDER BY ordinal_position
        """)).fetchall()
        
        # unified_inventory 테이블 구조 확인  
        inventory_columns = db.execute(text("""
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'unified_inventory'
            ORDER BY ordinal_position
        """)).fetchall()
        
        return {
            "purchase_requests": [{"name": col[0], "type": col[1]} for col in purchase_columns],
            "unified_inventory": [{"name": col[0], "type": col[1]} for col in inventory_columns]
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/debug/test-create")
def test_create_endpoint(db: Session = Depends(get_db)):
    """구매 요청 생성 테스트 - 수정된 버전"""
    try:
        # 테스트 데이터 (NOT NULL 제약조건 고려)
        test_data = {
            'request_number': f"TEST{datetime.now().strftime('%Y%m%d%H%M%S')}",
            'item_name': '테스트 품목',
            'quantity': 1,
            'unit': '개',
            'estimated_unit_price': 1000.0,  # 🔥 기본값 설정
            'total_budget': 1000.0,  # 🔥 기본값 설정 (quantity * estimated_unit_price)
            'currency': 'KRW',
            'category': 'OFFICE_SUPPLIES',
            'urgency': 'NORMAL',
            'purchase_method': 'DIRECT',  # 🔥 기본값 설정
            'requester_name': '테스트 사용자',
            'requester_email': 'test@test.com',
            'department': 'S/W 개발팀',
            'justification': '테스트용',
            'status': 'SUBMITTED',
            'request_date': datetime.now()
        }
        
        # DB 객체 생성
        test_request = DBPurchaseRequest(**test_data)
        db.add(test_request)
        db.commit()
        db.refresh(test_request)
        
        return {
            "success": True,
            "message": "테스트 구매 요청 생성 성공",
            "id": test_request.id,
            "request_number": test_request.request_number,
            "total_budget": test_request.total_budget
        }
        
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "error": str(e),
            "message": "테스트 구매 요청 생성 실패"
        }
        
@router.get("/debug/routes-info")
def get_routes_info():
    """현재 라우터의 모든 경로 정보 확인"""
    routes_info = []
    for route in router.routes:
        if hasattr(route, 'methods') and hasattr(route, 'path'):
            routes_info.append({
                "path": route.path,
                "methods": list(route.methods),
                "name": getattr(route, 'name', 'Unknown')
            })
    return {
        "router_prefix": "/purchase-requests",  # 현재 라우터 prefix
        "routes": routes_info,
        "expected_put_path": "/api/v1/purchase-requests/{request_id}",
        "note": "라우터 prefix + 엔드포인트 path = 최종 경로"
    }