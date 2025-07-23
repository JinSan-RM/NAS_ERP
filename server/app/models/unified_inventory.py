# server/app/models/unified_inventory.py
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, Boolean, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class UnifiedInventory(Base):
    """통합 품목관리 테이블 - 품목과 수령 이력을 관리"""
    __tablename__ = "unified_inventory"

    id = Column(Integer, primary_key=True, index=True)
    
    # 품목 기본 정보
    item_code = Column(String(50), unique=True, index=True, nullable=False)
    item_name = Column(String(200), nullable=False, index=True)
    category = Column(String(100), nullable=True)
    brand = Column(String(100), nullable=True)
    specifications = Column(Text, nullable=True)
    
    # 수량 정보
    total_received = Column(Integer, default=0, nullable=False)  # 총 수령 수량
    current_quantity = Column(Integer, default=0, nullable=False)  # 현재 보유 수량
    reserved_quantity = Column(Integer, default=0, nullable=False)  # 사용중/예약 수량
    unit = Column(String(20), default="개")
    
    # 상태별 수량
    condition_quantities = Column(JSON, default={
        "excellent": 0,
        "good": 0,
        "damaged": 0,
        "defective": 0
    })
    
    # 수령 이력 (JSON으로 저장)
    receipt_history = Column(JSON, default=[], nullable=False)  # 수령 이력 리스트
    
    # 가격 정보
    unit_price = Column(Float, nullable=True)
    currency = Column(String(10), default="KRW")
    total_value = Column(Float, nullable=True)
    
    # 위치 정보
    location = Column(String(200), nullable=True)
    warehouse = Column(String(100), nullable=True)
    storage_section = Column(String(100), nullable=True)
    
    # 공급업체 정보
    supplier_name = Column(String(200), nullable=True)
    supplier_contact = Column(String(100), nullable=True)
    
    # 최근 수령/사용 정보
    last_received_date = Column(DateTime(timezone=True), nullable=True)
    last_received_by = Column(String(100), nullable=True)
    last_received_department = Column(String(100), nullable=True)
    last_used_date = Column(DateTime(timezone=True), nullable=True)
    
    # 이미지 정보
    main_image_url = Column(String(500), nullable=True)
    image_urls = Column(JSON, default=[])
    
    # 재고 관리 설정
    minimum_stock = Column(Integer, default=0)
    maximum_stock = Column(Integer, nullable=True)
    reorder_point = Column(Integer, nullable=True)
    
    # 상태 정보
    is_active = Column(Boolean, default=True)
    is_consumable = Column(Boolean, default=False)
    requires_approval = Column(Boolean, default=False)
    
    # 메타데이터
    description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    tags = Column(JSON, default=[])
    
    # 시스템 필드
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    created_by = Column(String(100), nullable=True)
    updated_by = Column(String(100), nullable=True)
    
    # 관계 설정
    usage_logs = relationship("InventoryUsageLog", back_populates="inventory_item")
    
    def __repr__(self):
        return f"<UnifiedInventory {self.item_code}: {self.item_name}>"
    
    @property
    def available_quantity(self):
        return max(0, self.current_quantity - self.reserved_quantity)
    
    @property
    def utilization_rate(self):
        if self.total_received == 0:
            return 0
        return ((self.total_received - self.current_quantity) / self.total_received) * 100
    
    @property
    def is_low_stock(self):
        return self.current_quantity <= self.minimum_stock
    
    @property
    def stock_status(self):
        if self.current_quantity == 0:
            return "out_of_stock"
        elif self.current_quantity <= self.minimum_stock:
            return "low_stock"
        elif self.maximum_stock and self.current_quantity >= self.maximum_stock:
            return "overstocked"
        else:
            return "normal"
        
        
class InventoryUsageLog(Base):
    """품목 사용 이력 테이블"""
    __tablename__ = "inventory_usage_logs"

    id = Column(Integer, primary_key=True, index=True)
    unified_inventory_id = Column(Integer, ForeignKey("unified_inventory.id"), nullable=False)
    
    # 사용 정보
    usage_type = Column(String(50), nullable=False)  # 'consumption', 'return', 'transfer', 'disposal'
    quantity = Column(Integer, nullable=False)
    unit = Column(String(20), default="개")
    
    # 사용자 정보
    user_name = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=True)
    department = Column(String(100), nullable=False)
    
    # 사용 목적 및 위치
    purpose = Column(String(200), nullable=True)
    project = Column(String(100), nullable=True)
    from_location = Column(String(200), nullable=True)
    to_location = Column(String(200), nullable=True)
    
    # 승인 정보
    requires_approval = Column(Boolean, default=False)
    approved_by = Column(String(100), nullable=True)
    approved_date = Column(DateTime(timezone=True), nullable=True)
    
    # 반납 정보
    expected_return_date = Column(DateTime(timezone=True), nullable=True)
    actual_return_date = Column(DateTime(timezone=True), nullable=True)
    return_condition = Column(String(50), nullable=True)
    
    # 시스템 필드
    usage_date = Column(DateTime(timezone=True), server_default=func.now())
    notes = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    
    # 관계 설정
    inventory_item = relationship("UnifiedInventory", back_populates="usage_logs")
    
    def __repr__(self):
        return f"<InventoryUsageLog {self.usage_type}: {self.quantity} by {self.user_name}>"

    
# 이미지 업로드 테이블
class InventoryImage(Base):
    """품목 이미지 관리 테이블"""
    __tablename__ = "inventory_images"

    id = Column(Integer, primary_key=True, index=True)
    unified_inventory_id = Column(Integer, ForeignKey("unified_inventory.id"), nullable=False)
    
    # 이미지 정보
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)
    mime_type = Column(String(100), nullable=False)
    
    # 이미지 분류
    image_type = Column(String(50), default="general")  # 'main', 'detail', 'packaging', 'manual', 'general'
    description = Column(String(200), nullable=True)
    sort_order = Column(Integer, default=0)
    
    # 이미지 처리 정보
    thumbnail_path = Column(String(500), nullable=True)
    compressed_path = Column(String(500), nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    
    # 시스템 필드
    is_active = Column(Boolean, default=True)
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    uploaded_by = Column(String(100), nullable=True)
    
    def __repr__(self):
        return f"<InventoryImage {self.filename} for item {self.unified_inventory_id}>"