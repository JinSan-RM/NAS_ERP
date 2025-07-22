# server/app/api/v1/endpoints/purchase_request.py
from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Response
from sqlalchemy.orm import Session
import pandas as pd
from io import BytesIO

from app import crud, schemas
from app.api.deps import get_db
from app.enums import RequestStatus, UrgencyLevel  # 공유 Enum 사용
from app.schemas.purchase_request import (
    PurchaseRequest,
    PurchaseRequestCreate,
    PurchaseRequestUpdate,
    PurchaseRequestList,
    PurchaseRequestStats,
    PurchaseRequestFilter,
)

router = APIRouter()

@router.get("/", response_model=PurchaseRequestList)
def read_purchase_requests(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0, description="건너뛸 항목 수"),
    limit: int = Query(default=20, ge=1, le=100, description="반환할 최대 항목 수"),
    search: Optional[str] = Query(default=None, description="검색어"),
    status: Optional[RequestStatus] = Query(default=None, description="상태 필터"),
    urgency: Optional[UrgencyLevel] = Query(default=None, description="긴급도 필터"),
    department: Optional[str] = Query(default=None, description="부서 필터"),
    category: Optional[str] = Query(default=None, description="카테고리 필터"),
    requester_name: Optional[str] = Query(default=None, description="요청자 필터"),
    date_from: Optional[str] = Query(default=None, description="시작일 (YYYY-MM-DD)"),
    date_to: Optional[str] = Query(default=None, description="종료일 (YYYY-MM-DD)"),
    min_budget: Optional[float] = Query(default=None, ge=0, description="최소 예산"),
    max_budget: Optional[float] = Query(default=None, ge=0, description="최대 예산")
):
    """
    구매 요청 목록 조회 (필터링 및 페이지네이션 지원)
    """
    # 필터 객체 생성
    filters = PurchaseRequestFilter(
        search=search,
        status=status,
        urgency=urgency,
        department=department,
        category=category,
        requester_name=requester_name,
        date_from=pd.to_datetime(date_from) if date_from else None,
        date_to=pd.to_datetime(date_to) if date_to else None,
        min_budget=min_budget,
        max_budget=max_budget
    )
    
    # 필터링된 목록 조회
    items = crud.purchase_request.get_multi_with_filter(
        db=db, skip=skip, limit=limit, filters=filters
    )
    
    # 총 개수 조회
    total = crud.purchase_request.count_with_filter(db=db, filters=filters)
    
    return {
        "items": items,
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 0
    }

@router.post("/", response_model=PurchaseRequest)
def create_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_in: PurchaseRequestCreate
):
    """
    새 구매 요청 생성
    """
    try:
        purchase_request = crud.purchase_request.create(db=db, obj_in=request_in)
        return purchase_request
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"구매 요청 생성에 실패했습니다: {str(e)}"
        )

@router.get("/stats", response_model=PurchaseRequestStats)
def read_purchase_request_stats(db: Session = Depends(get_db)):
    """
    구매 요청 통계 조회
    """
    stats = crud.purchase_request.get_stats(db=db)
    
    # snake_case로 반환 (alias를 사용해서 camelCase도 지원)
    return {
        "total": stats.get("total", 0),
        "pending": stats.get("pending", 0),
        "approved": stats.get("approved", 0),
        "rejected": stats.get("rejected", 0),
        "this_month": stats.get("thisMonth", stats.get("this_month", 0)),  # 둘 다 지원
        "total_budget": stats.get("totalBudget", stats.get("total_budget", 0.0)),  # 둘 다 지원
        "average_approval_time": stats.get("averageProcessingTime", stats.get("average_approval_time", None))  # 둘 다 지원
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

@router.put("/{request_id}", response_model=PurchaseRequest)
def update_purchase_request(
    *,
    db: Session = Depends(get_db),
    request_id: int,
    request_in: PurchaseRequestUpdate
):
    """
    구매 요청 업데이트
    """
    purchase_request = crud.purchase_request.get(db=db, id=request_id)
    if not purchase_request:
        raise HTTPException(status_code=404, detail="구매 요청을 찾을 수 없습니다.")
    
    # 상태에 따른 수정 권한 확인
    if purchase_request.status in [RequestStatus.APPROVED, RequestStatus.REJECTED]:
        raise HTTPException(
            status_code=400,
            detail="승인되었거나 거절된 요청은 수정할 수 없습니다."
        )
    
    try:
        purchase_request = crud.purchase_request.update(
            db=db, db_obj=purchase_request, obj_in=request_in
        )
        return purchase_request
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"구매 요청 수정에 실패했습니다: {str(e)}"
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
                    estimated_price=float(row['예상단가']) if pd.notna(row.get('예상단가')) else None,
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
            '예상단가': req.estimated_price or 0,
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