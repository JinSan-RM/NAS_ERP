# server/app/models/receipt.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum as PyEnum
from app.core.database import Base

class ReceiptCondition(str, PyEnum):
    EXCELLENT = "excellent"
    GOOD = "good"
    DAMAGED = "damaged"
    DEFECTIVE = "defective"

class Receipt(Base):
    __tablename__ = "receipts"

    id = Column(Integer, primary_key=True, index=True)
    receipt_number = Column(String(50), unique=True, index=True, nullable=False)
    
    # 구매 요청 연결 (선택사항)
    purchase_request_id = Column(Integer, ForeignKey("purchase_requests.id"), nullable=True)
    
    # 품목 정보
    item_name = Column(String(200), nullable=False, index=True)
    item_code = Column(String(50), nullable=True)
    specifications = Column(Text)
    
    # 수량 정보
    expected_quantity = Column(Integer, nullable=False, default=1)
    received_quantity = Column(Integer, nullable=False, default=0)
    unit = Column(String(20), default="개")
    
    # 수령자 정보
    receiver_name = Column(String(100), nullable=False)
    receiver_email = Column(String(255))
    department = Column(String(100), nullable=False)
    position = Column(String(100))
    phone_number = Column(String(20))
    
    # 수령 정보
    received_date = Column(DateTime(timezone=True), nullable=False)
    delivery_date = Column(DateTime(timezone=True))
    location = Column(String(200))
    
    # 상태 및 품질
    condition = Column(Enum(ReceiptCondition), default=ReceiptCondition.GOOD)
    is_complete = Column(Boolean, default=False)  # 완전히 수령되었는지
    
    # 공급업체 정보
    supplier_name = Column(String(200))
    delivery_person = Column(String(100))
    delivery_contact = Column(String(100))
    
    # 검수 및 확인
    inspection_notes = Column(Text)
    notes = Column(Text)
    quality_check_passed = Column(Boolean, default=True)
    
    # 첨부파일
    attachment_urls = Column(Text)  # JSON 형태로 저장
    
    # 시스템 필드
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True))
    created_by = Column(String(100))
    updated_by = Column(String(100))
    
    # 관계 설정
    purchase_request = relationship("PurchaseRequest", back_populates="receipts")
    
    def __repr__(self):
        return f"<Receipt {self.receipt_number}: {self.item_name}>"

    @property
    def is_partial_receipt(self):
        """부분 수령인지 확인"""
        return self.received_quantity < self.expected_quantity
    
    @property
    def is_over_receipt(self):
        """초과 수령인지 확인"""
        return self.received_quantity > self.expected_quantity
    
    @property
    def receipt_rate(self):
        """수령률 계산"""
        if self.expected_quantity == 0:
            return 0
        return (self.received_quantity / self.expected_quantity) * 100
    
    def generate_receipt_number(self):
        """수령번호 자동 생성"""
        from datetime import datetime
        now = datetime.now()
        prefix = f"RC{now.strftime('%Y%m')}"
        return f"{prefix}{self.id:06d}"