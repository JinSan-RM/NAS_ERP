# server/app/schemas/purchase_request.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, validator
from app.enums import RequestStatus, UrgencyLevel, ItemCategory, PurchaseMethod  # 공유 Enum 사용

# 기본 스키마
class PurchaseRequestBase(BaseModel):
    item_name: str = Field(..., max_length=200, description="품목명")
    specifications: Optional[str] = Field(None, description="사양")
    quantity: int = Field(default=1, ge=1, description="수량")
    unit: str = Field(default="개", max_length=20, description="단위")
    estimated_unit_price: Optional[float] = Field(default=0.0, ge=0, description="예상 단가")
    total_budget: float = Field(..., ge=0, description="총 예산")
    currency: str = Field(default="KRW", max_length=10, description="통화")
    
    category: ItemCategory = Field(default=ItemCategory.OTHER, description="카테고리")
    urgency: UrgencyLevel = Field(default=UrgencyLevel.NORMAL, description="긴급도")
    purchase_method: PurchaseMethod = Field(default=PurchaseMethod.DIRECT, description="구매 방법")
    
    requester_name: str = Field(..., max_length=100, description="요청자명")
    requester_email: Optional[str] = Field(None, max_length=255, description="요청자 이메일")
    department: str = Field(..., max_length=100, description="부서")
    position: Optional[str] = Field(None, max_length=100, description="직급")
    phone_number: Optional[str] = Field(None, max_length=20, description="연락처")
    
    project: Optional[str] = Field(None, max_length=200, description="프로젝트")
    budget_code: Optional[str] = Field(None, max_length=50, description="링크")
    cost_center: Optional[str] = Field(None, max_length=50, description="코스트 센터")
    
    preferred_supplier: Optional[str] = Field(None, max_length=200, description="선호 공급업체")
    supplier_contact: Optional[str] = Field(None, max_length=255, description="공급업체 연락처")
    
    expected_delivery_date: Optional[datetime] = Field(None, description="희망 납기일")
    required_by_date: Optional[datetime] = Field(None, description="필요 완료일")
    
    justification: str = Field(..., description="구매 사유")
    business_case: Optional[str] = Field(None, description="비즈니스 케이스")
    notes: Optional[str] = Field(None, description="비고")

    @validator('total_budget', pre=True)
    def calculate_total_budget(cls, v, values):
        if 'quantity' in values and 'estimated_unit_price' in values:
            if values.get('estimated_unit_price', 0) > 0:
                return values['quantity'] * values['estimated_unit_price']
        return v

# 생성용 스키마
class PurchaseRequestCreate(PurchaseRequestBase):
    status: Optional[RequestStatus] = Field(default=RequestStatus.SUBMITTED, description="상태")

# 업데이트용 스키마
class PurchaseRequestUpdate(BaseModel):
    item_name: Optional[str] = Field(None, max_length=200, description="품목명")
    specifications: Optional[str] = Field(None, description="사양")
    quantity: Optional[int] = Field(None, ge=1, description="수량")
    unit: Optional[str] = Field(None, max_length=20, description="단위")
    estimated_unit_price: Optional[float] = Field(None, ge=0, description="예상 단가")
    total_budget: Optional[float] = Field(None, ge=0, description="총 예산")
    currency: Optional[str] = Field(None, max_length=10, description="통화")
    
    category: Optional[ItemCategory] = Field(None, description="카테고리")
    urgency: Optional[UrgencyLevel] = Field(None, description="긴급도")
    purchase_method: Optional[PurchaseMethod] = Field(None, description="구매 방법")
    
    requester_name: Optional[str] = Field(None, max_length=100, description="요청자명")
    requester_email: Optional[str] = Field(None, max_length=255, description="요청자 이메일")
    department: Optional[str] = Field(None, max_length=100, description="부서")
    position: Optional[str] = Field(None, max_length=100, description="직급")
    phone_number: Optional[str] = Field(None, max_length=20, description="연락처")
    
    project: Optional[str] = Field(None, max_length=200, description="프로젝트")
    budget_code: Optional[str] = Field(None, max_length=50, description="링크")
    cost_center: Optional[str] = Field(None, max_length=50, description="코스트 센터")
    
    preferred_supplier: Optional[str] = Field(None, max_length=200, description="선호 공급업체")
    supplier_contact: Optional[str] = Field(None, max_length=255, description="공급업체 연락처")
    
    expected_delivery_date: Optional[datetime] = Field(None, description="희망 납기일")
    required_by_date: Optional[datetime] = Field(None, description="필요 완료일")
    
    justification: Optional[str] = Field(None, description="구매 사유")
    business_case: Optional[str] = Field(None, description="비즈니스 케이스")
    notes: Optional[str] = Field(None, description="비고")
    
    status: Optional[RequestStatus] = Field(None, description="상태")

# 승인/거절용 스키마
class PurchaseRequestApproval(BaseModel):
    action: str = Field(..., pattern="^(approve|reject)$", description="승인 액션")
    comments: Optional[str] = Field(None, description="승인/거절 코멘트")
    approval_level: Optional[int] = Field(None, description="승인 레벨")

# 응답용 스키마
class PurchaseRequestInDB(PurchaseRequestBase):
    id: int
    request_number: str
    status: RequestStatus
    approval_level: int
    current_approver: Optional[str] = None
    approved_date: Optional[datetime] = None
    approved_by: Optional[str] = None
    rejected_date: Optional[datetime] = None
    rejected_by: Optional[str] = None
    rejection_reason: Optional[str] = None
    
    attachment_urls: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    
    priority_score: int
    estimated_approval_time: Optional[int] = None
    actual_approval_time: Optional[int] = None
    
    request_date: datetime
    
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
    pending: int
    approved: int
    rejected: int
    this_month: int = Field(alias="thisMonth")  # alias 추가
    total_budget: float = Field(alias="totalBudget")  # alias 추가
    average_approval_time: Optional[float] = Field(None, alias="averageProcessingTime")  # alias 추가
    
    class Config:
        populate_by_name = True  # alias와 원래 이름 모두 허용
        allow_population_by_field_name = True

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