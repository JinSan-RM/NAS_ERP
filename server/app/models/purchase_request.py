# server/app/models/purchase_request.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base

class RequestStatus(PyEnum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class UrgencyLevel(PyEnum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
    EMERGENCY = "emergency"

class ItemCategory(PyEnum):
    OFFICE_SUPPLIES = "office_supplies"
    ELECTRONICS = "electronics"
    FURNITURE = "furniture"
    SOFTWARE = "software"
    MAINTENANCE = "maintenance"
    SERVICES = "services"
    OTHER = "other"

class PurchaseMethod(PyEnum):
    DIRECT = "direct"
    QUOTATION = "quotation"
    CONTRACT = "contract"
    FRAMEWORK = "framework"
    MARKETPLACE = "marketplace"

class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # 품목 정보
    item_name = Column(String(200), nullable=False, index=True)
    specifications = Column(Text)
    quantity = Column(Integer, nullable=False, default=1)
    unit = Column(String(20), default="개")
    estimated_unit_price = Column(Float, default=0.0)
    total_budget = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), default="KRW")
    
    # 카테고리 및 분류
    category = Column(Enum(ItemCategory), nullable=False, default=ItemCategory.OTHER)
    urgency = Column(Enum(UrgencyLevel), nullable=False, default=UrgencyLevel.NORMAL)
    purchase_method = Column(Enum(PurchaseMethod), default=PurchaseMethod.DIRECT)
    
    # 요청자 정보
    requester_name = Column(String(100), nullable=False)
    requester_email = Column(String(255))
    department = Column(String(100), nullable=False)
    position = Column(String(100))
    phone_number = Column(String(20))
    
    # 프로젝트 및 예산 정보
    project = Column(String(200))
    budget_code = Column(String(50))
    cost_center = Column(String(50))
    
    # 공급업체 정보
    preferred_supplier = Column(String(200))
    supplier_contact = Column(String(255))
    
    # 날짜 정보
    request_date = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    expected_delivery_date = Column(DateTime(timezone=True))
    required_by_date = Column(DateTime(timezone=True))
    
    # 승인 관련
    status = Column(Enum(RequestStatus), nullable=False, default=RequestStatus.DRAFT)
    approval_level = Column(Integer, default=1)
    current_approver = Column(String(100))
    approved_date = Column(DateTime(timezone=True))
    approved_by = Column(String(100))
    rejected_date = Column(DateTime(timezone=True))
    rejected_by = Column(String(100))
    rejection_reason = Column(Text)
    
    # 사유 및 설명
    justification = Column(Text, nullable=False)
    business_case = Column(Text)
    notes = Column(Text)
    
    # 첨부파일
    attachment_urls = Column(Text)  # JSON 형태로 저장
    
    # 시스템 필드
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100))
    updated_by = Column(String(100))
    
    # 추가 메타데이터
    priority_score = Column(Integer, default=0)
    estimated_approval_time = Column(Integer)  # 예상 승인 소요시간 (시간)
    actual_approval_time = Column(Integer)     # 실제 승인 소요시간 (시간)
    
    def __repr__(self):
        return f"<PurchaseRequest {self.request_number}: {self.item_name}>"

    @property
    def is_editable(self):
        """수정 가능한 상태인지 확인"""
        return self.status in [RequestStatus.DRAFT, RequestStatus.SUBMITTED, RequestStatus.REJECTED]
    
    @property
    def is_approvable(self):
        """승인 가능한 상태인지 확인"""
        return self.status == RequestStatus.PENDING_APPROVAL
    
    @property
    def is_deletable(self):
        """삭제 가능한 상태인지 확인"""
        return self.status in [RequestStatus.DRAFT, RequestStatus.SUBMITTED, RequestStatus.REJECTED]
    
    def generate_request_number(self):
        """요청번호 자동 생성"""
        from datetime import datetime
        now = datetime.now()
        prefix = f"PR{now.strftime('%Y%m')}"
        # 실제로는 시퀀스나 카운터를 사용해야 함
        return f"{prefix}{self.id:06d}"