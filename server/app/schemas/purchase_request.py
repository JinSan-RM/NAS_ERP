# server/app/schemas/purchase_request.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, field_validator
from app.enums import RequestStatus, UrgencyLevel, ItemCategory, PurchaseMethod  # 공유 Enum 사용

# 기본 스키마
class PurchaseRequestBase(BaseModel):
    item_name: str = Field(..., max_length=200, description="품목명")
    specifications: Optional[str] = Field(None, description="사양")
    quantity: int = Field(default=1, ge=1, description="수량")
    unit: str = Field(default="개", max_length=20, description="단위")
    estimated_unit_price: Optional[float] = Field(default=0.0, ge=0, description="예상 단가")
    total_budget: Optional[float] = Field(None, description="총 예산")
    currency: str = Field(default="KRW", max_length=10, description="통화")
    category: str = Field(..., description="카테고리")
    urgency: str = Field(..., description="긴급도")
    purchase_method: Optional[str] = Field(None, description="구매 방법")
    requester_name: str = Field(..., max_length=100, description="요청자명")
    department: str = Field(..., max_length=100, description="부서")
    position: Optional[str] = Field(None, max_length=100, description="직책")
    justification: Optional[str] = Field(None, description="구매 사유")
    status: str = Field(default="SUBMITTED", description="상태")
    class Config:
        from_attributes = True


# 생성용 스키마
class PurchaseRequestCreate(BaseModel):
    item_name: str
    specifications: Optional[str] = None
    quantity: int
    unit: Optional[str] = "개"
    estimated_unit_price: Optional[float] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = "KRW"
    category: str
    urgency: str
    purchase_method: Optional[str] = None
    requester_name: str
    requester_email: Optional[str] = None
    department: str
    position: Optional[str] = None
    justification: Optional[str] = None
    expected_delivery_date: Optional[datetime] = None


# 업데이트용 스키마
class PurchaseRequestUpdate(BaseModel):
    item_name: Optional[str] = Field(None, max_length=200, description="품목명")
    specifications: Optional[str] = Field(None, description="사양")
    quantity: Optional[int] = Field(None, ge=1, description="수량")
    unit: Optional[str] = Field(None, max_length=20, description="단위")
    estimated_unit_price: Optional[float] = Field(None, ge=0, description="예상 단가")
    currency: Optional[str] = Field(None, max_length=10, description="통화")
    
    category: Optional[str] = Field(None, description="카테고리")
    urgency: Optional[UrgencyLevel] = Field(None, description="긴급도")
    
    requester_name: Optional[str] = Field(None, max_length=100, description="요청자명")
    requester_email: Optional[str] = Field(None, max_length=255, description="요청자 이메일")
    department: Optional[str] = Field(None, max_length=100, description="부서")
    phone_number: Optional[str] = Field(None, max_length=20, description="연락처")
    
    project: Optional[str] = Field(None, max_length=200, description="프로젝트")
    budget_code: Optional[str] = Field(None, max_length=50, description="예산코드")
    
    preferred_supplier: Optional[str] = Field(None, max_length=200, description="선호 공급업체")
    
    justification: Optional[str] = Field(None, description="구매 사유")
    additional_notes: Optional[str] = Field(None, description="비고")
    
    status: Optional[RequestStatus] = Field(None, description="상태")


# 승인/거절용 스키마
class PurchaseRequestApproval(BaseModel):
    action: str = Field(..., pattern="^(approve|reject)$", description="승인 액션")
    comments: Optional[str] = Field(None, description="승인/거절 코멘트")
    approval_level: Optional[int] = Field(None, description="승인 레벨")
    
# 응답용 스키마 (단순화)
class PurchaseRequestInDB(PurchaseRequestBase):
    id: int
    request_number: Optional[str]
    total_budget: float
    status: RequestStatus
    
    # 승인 관련 (단순화)
    approval_date: Optional[datetime] = None
    rejection_reason: Optional[str] = None
    
    # 완료 처리 관련
    completed_date: Optional[datetime] = None
    completed_by: Optional[str] = None
    completion_notes: Optional[str] = None
    inventory_item_id: Optional[int] = None
    
    # 시스템 필드
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    priority_score: int
    
    model_config = ConfigDict(from_attributes=True)

class PurchaseRequest(PurchaseRequestInDB):
    pass

# 목록 응답
class PurchaseRequestList(BaseModel):
    items: List[PurchaseRequest]
    total: int
    page: int
    size: int
    pages: int

# 통계 스키마 - 수정된 부분
class PurchaseRequestStats(BaseModel):
    total: int
    approved: int
    rejected: int
    completed: Optional[int] = 0
    this_month: int
    total_budget: float
    
    model_config = ConfigDict(from_attributes=True)
    
# 검색 필터
class PurchaseRequestFilter(BaseModel):
    search: Optional[str] = None
    status: Optional[RequestStatus] = None
    category: Optional[ItemCategory] = None
    urgency: Optional[UrgencyLevel] = None
    department: Optional[str] = None
    requester_name: Optional[str] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    min_budget: Optional[float] = None
    max_budget: Optional[float] = None
    
# 완료 처리용 스키마 (구매 요청 완료 → 품목 생성에 필요)
class PurchaseRequestCompletionData(BaseModel):
    received_quantity: Optional[int] = None
    receiver_name: Optional[str] = None
    receiver_email: Optional[str] = None
    received_date: Optional[datetime] = None
    location: Optional[str] = "창고"
    condition: Optional[str] = "good"
    notes: Optional[str] = None
    completed_by: Optional[str] = "시스템"
    
    
class PurchaseRequestResponse(BaseModel):
    # 실제 DB 필드들
    id: int
    request_number: Optional[str] = None
    item_name: str
    specifications: Optional[str] = None
    quantity: int
    unit: Optional[str] = "개"
    estimated_unit_price: Optional[float] = None
    total_budget: Optional[float] = None
    currency: Optional[str] = "KRW"
    category: Optional[str] = None
    urgency: str
    purchase_method: Optional[str] = None
    requester_name: str
    requester_email: Optional[str] = None
    department: str
    position: Optional[str] = None
    
    # FE가 요구하는 필드들 - 기본값 제공
    phone_number: Optional[str] = None
    project: Optional[str] = None
    budget_code: Optional[str] = None
    cost_center: Optional[str] = None
    preferred_supplier: Optional[str] = None
    supplier_contact: Optional[str] = None
    request_date: str = Field(default_factory=lambda: datetime.now().isoformat())
    expected_delivery_date: Optional[str] = None
    required_by_date: Optional[str] = None
    status: str = "SUBMITTED"
    approval_level: Optional[int] = None
    current_approver: Optional[str] = None
    approved_date: Optional[str] = None
    approved_by: Optional[str] = None
    rejected_date: Optional[str] = None
    rejected_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    justification: str = ""
    business_case: Optional[str] = None
    notes: Optional[str] = None
    attachment_urls: Optional[str] = None
    is_active: Optional[bool] = True
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: Optional[str] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    priority_score: Optional[float] = 0.0
    estimated_approval_time: Optional[int] = 0
    actual_approval_time: Optional[int] = 0

    @classmethod
    def from_orm(cls, obj):
        """DB 객체에서 Response 스키마로 변환"""
        return cls(
            # 실제 DB 필드들 (getattr 대신 직접 접근)
            id=obj.id,
            request_number=obj.request_number,
            item_name=obj.item_name,
            specifications=obj.specifications,
            quantity=obj.quantity,
            unit=obj.unit,
            estimated_unit_price=obj.estimated_unit_price,
            total_budget=obj.total_budget,
            currency=obj.currency,
            category=obj.category,
            urgency=obj.urgency,
            purchase_method=obj.purchase_method,
            requester_name=obj.requester_name,
            requester_email=obj.requester_email,
            department=obj.department,
            position=obj.position,
            justification=getattr(obj, 'justification', ''),  # DB에 있는 필드
            
            # DB에 있는 다른 필드들
            phone_number=getattr(obj, 'phone_number', None),
            project=getattr(obj, 'project', None),
            budget_code=getattr(obj, 'budget_code', None),
            cost_center=getattr(obj, 'cost_center', None),
            preferred_supplier=getattr(obj, 'preferred_supplier', None),
            supplier_contact=getattr(obj, 'supplier_contact', None),
            request_date=obj.request_date.isoformat() if obj.request_date else datetime.now().isoformat(),
            expected_delivery_date=obj.expected_delivery_date.isoformat() if obj.expected_delivery_date else None,
            required_by_date=obj.required_by_date.isoformat() if obj.required_by_date else None,
            status=obj.status,
            approval_level=getattr(obj, 'approval_level', None),
            current_approver=getattr(obj, 'current_approver', None),
            approved_date=obj.approved_date.isoformat() if getattr(obj, 'approved_date', None) else None,
            approved_by=getattr(obj, 'approved_by', None),
            rejected_date=obj.rejected_date.isoformat() if getattr(obj, 'rejected_date', None) else None,
            rejected_by=getattr(obj, 'rejected_by', None),
            rejection_reason=getattr(obj, 'rejection_reason', None),
            business_case=getattr(obj, 'business_case', None),
            notes=getattr(obj, 'notes', None),
            attachment_urls=getattr(obj, 'attachment_urls', None),
            is_active=obj.is_active,
            created_at=obj.created_at.isoformat() if obj.created_at else datetime.now().isoformat(),
            updated_at=obj.updated_at.isoformat() if getattr(obj, 'updated_at', None) else None,
            created_by=getattr(obj, 'created_by', None),
            updated_by=getattr(obj, 'updated_by', None),
            priority_score=float(obj.priority_score) if obj.priority_score else 0.0,
            estimated_approval_time=getattr(obj, 'estimated_approval_time', 0) or 0,
            actual_approval_time=getattr(obj, 'actual_approval_time', 0) or 0
        )

    class Config:
        from_attributes = True