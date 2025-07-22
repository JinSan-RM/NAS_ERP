# server/app/schemas/receipt.py
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict, validator
from app.models.receipt import ReceiptCondition

# 기본 스키마
class ReceiptBase(BaseModel):
    purchase_request_id: Optional[int] = Field(None, description="관련 구매 요청 ID")
    item_name: str = Field(..., max_length=200, description="품목명")
    item_code: Optional[str] = Field(None, max_length=50, description="품목 코드")
    specifications: Optional[str] = Field(None, description="사양")
    
    expected_quantity: int = Field(..., ge=1, description="예상 수량")
    received_quantity: int = Field(..., ge=0, description="실제 수령 수량")
    unit: str = Field(default="개", max_length=20, description="단위")
    
    receiver_name: str = Field(..., max_length=100, description="수령자명")
    receiver_email: Optional[str] = Field(None, max_length=255, description="수령자 이메일")
    department: str = Field(..., max_length=100, description="부서")
    position: Optional[str] = Field(None, max_length=100, description="직급")
    phone_number: Optional[str] = Field(None, max_length=20, description="연락처")
    
    received_date: datetime = Field(..., description="수령일시")
    delivery_date: Optional[datetime] = Field(None, description="배송일시")
    location: Optional[str] = Field(None, max_length=200, description="수령 위치")
    
    condition: ReceiptCondition = Field(default=ReceiptCondition.GOOD, description="품목 상태")
    is_complete: bool = Field(default=False, description="완전 수령 여부")
    
    supplier_name: Optional[str] = Field(None, max_length=200, description="공급업체명")
    delivery_person: Optional[str] = Field(None, max_length=100, description="배송담당자")
    delivery_contact: Optional[str] = Field(None, max_length=100, description="배송담당자 연락처")
    
    inspection_notes: Optional[str] = Field(None, description="검수 메모")
    notes: Optional[str] = Field(None, description="비고")
    quality_check_passed: bool = Field(default=True, description="품질 검사 통과 여부")

# 생성용 스키마
class ReceiptCreate(ReceiptBase):
    pass

# 업데이트용 스키마
class ReceiptUpdate(BaseModel):
    purchase_request_id: Optional[int] = Field(None, description="관련 구매 요청 ID")
    item_name: Optional[str] = Field(None, max_length=200, description="품목명")
    item_code: Optional[str] = Field(None, max_length=50, description="품목 코드")
    specifications: Optional[str] = Field(None, description="사양")
    
    expected_quantity: Optional[int] = Field(None, ge=1, description="예상 수량")
    received_quantity: Optional[int] = Field(None, ge=0, description="실제 수령 수량")
    unit: Optional[str] = Field(None, max_length=20, description="단위")
    
    receiver_name: Optional[str] = Field(None, max_length=100, description="수령자명")
    receiver_email: Optional[str] = Field(None, max_length=255, description="수령자 이메일")
    department: Optional[str] = Field(None, max_length=100, description="부서")
    position: Optional[str] = Field(None, max_length=100, description="직급")
    phone_number: Optional[str] = Field(None, max_length=20, description="연락처")
    
    received_date: Optional[datetime] = Field(None, description="수령일시")
    delivery_date: Optional[datetime] = Field(None, description="배송일시")
    location: Optional[str] = Field(None, max_length=200, description="수령 위치")
    
    condition: Optional[ReceiptCondition] = Field(None, description="품목 상태")
    is_complete: Optional[bool] = Field(None, description="완전 수령 여부")
    
    supplier_name: Optional[str] = Field(None, max_length=200, description="공급업체명")
    delivery_person: Optional[str] = Field(None, max_length=100, description="배송담당자")
    delivery_contact: Optional[str] = Field(None, max_length=100, description="배송담당자 연락처")
    
    inspection_notes: Optional[str] = Field(None, description="검수 메모")
    notes: Optional[str] = Field(None, description="비고")
    quality_check_passed: Optional[bool] = Field(None, description="품질 검사 통과 여부")

# 응답용 스키마
class ReceiptInDB(ReceiptBase):
    id: int
    receipt_number: str
    attachment_urls: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    created_by: Optional[str] = None
    updated_by: Optional[str] = None
    
    # 계산 필드
    is_partial_receipt: bool = Field(description="부분 수령 여부")
    is_over_receipt: bool = Field(description="초과 수령 여부")
    receipt_rate: float = Field(description="수령률 (%)")
    
    model_config = ConfigDict(from_attributes=True)

class Receipt(ReceiptInDB):
    pass

# 목록 응답
class ReceiptList(BaseModel):
    items: List[Receipt]
    total: int
    page: int
    size: int
    pages: int

# 수령 통계
class ReceiptStats(BaseModel):
    total_receipts: int
    total_items_received: int
    total_items_expected: int
    completion_rate: float
    partial_receipts: int
    over_receipts: int
    quality_issues: int
    recent_receipts: int

# 검색 필터
class ReceiptFilter(BaseModel):
    search: Optional[str] = None
    receiver_name: Optional[str] = None
    department: Optional[str] = None
    supplier_name: Optional[str] = None
    condition: Optional[ReceiptCondition] = None
    is_complete: Optional[bool] = None
    quality_check_passed: Optional[bool] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    purchase_request_id: Optional[int] = None