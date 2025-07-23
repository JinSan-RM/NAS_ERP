# server/app/models/purchase_request.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, Enum
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base
from app.enums import RequestStatus, UrgencyLevel, ItemCategory, PurchaseMethod


class PurchaseRequest(Base):
    __tablename__ = "purchase_requests"

    id = Column(Integer, primary_key=True, index=True)
    request_number = Column(String(50), unique=True, index=True, nullable=True)
    
    # 품목 정보
    item_name = Column(String(200), nullable=False, index=True)
    specifications = Column(Text)
    quantity = Column(Integer, nullable=False, default=1)
    unit = Column(String(20), default="개")
    estimated_unit_price = Column(Float, default=0.0)
    total_budget = Column(Float, nullable=False, default=0.0)
    currency = Column(String(10), default="KRW")
    
    # 카테고리 및 분류
    category = Column(Enum(ItemCategory), default=ItemCategory.OTHER)
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
    status = Column(Enum(RequestStatus), nullable=False, default=RequestStatus.SUBMITTED)
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
    updated_at = Column(DateTime(timezone=True))
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
        return f"{prefix}{self.id:06d}"
    
    def calculate_priority_score(self):
        """우선순위 점수 계산"""
        score = 0
        
        # 긴급도에 따른 점수
        urgency_scores = {
            UrgencyLevel.LOW: 10,
            UrgencyLevel.NORMAL: 30,
            UrgencyLevel.HIGH: 70,
            UrgencyLevel.URGENT: 90,
            UrgencyLevel.EMERGENCY: 100
        }
        score += urgency_scores.get(self.urgency, 30)
        
        # 예산 규모에 따른 점수 (높을수록 더 높은 점수)
        if self.total_budget:
            if self.total_budget >= 10000000:  # 1천만원 이상
                score += 50
            elif self.total_budget >= 5000000:  # 500만원 이상
                score += 30
            elif self.total_budget >= 1000000:  # 100만원 이상
                score += 20
            else:
                score += 10
        
        # 요청일로부터 경과 시간 (오래된 요청일수록 높은 점수)
        if self.created_at:
            # 🔥 수정: 타임존 정보 통일
            from datetime import datetime, timezone
            now = datetime.now(timezone.utc)
            
            # created_at이 naive datetime인 경우 UTC로 가정
            if self.created_at.tzinfo is None:
                created_at_aware = self.created_at.replace(tzinfo=timezone.utc)
            else:
                created_at_aware = self.created_at
                
            days_elapsed = (now - created_at_aware).days
            score += min(days_elapsed * 5, 50)  # 최대 50점
        
        self.priority_score = score
        return score