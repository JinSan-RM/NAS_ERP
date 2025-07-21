from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.sql import func
from app.core.database import Base

class Inventory(Base):
    __tablename__ = "inventories"
    
    id = Column(Integer, primary_key=True, index=True)
    item_code = Column(String(50), unique=True, index=True, nullable=False)
    item_name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=True)
    brand = Column(String(100), nullable=True)
    
    # 재고 정보
    current_stock = Column(Integer, default=0)
    minimum_stock = Column(Integer, default=0)
    maximum_stock = Column(Integer, nullable=True)
    
    # 가격 정보
    unit_price = Column(Float, nullable=True)
    currency = Column(String(10), default="KRW")
    
    # 공급업체 정보
    supplier_name = Column(String(200), nullable=True)
    supplier_contact = Column(String(100), nullable=True)
    
    # 위치 정보
    location = Column(String(100), nullable=True)
    warehouse = Column(String(100), nullable=True)
    
    # 상태 정보
    is_active = Column(Boolean, default=True)
    description = Column(Text, nullable=True)
    
    # 타임스탬프
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Inventory(item_code='{self.item_code}', item_name='{self.item_name}')>"