from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field, ConfigDict

# 기본 스키마
class InventoryBase(BaseModel):
    item_code: str = Field(..., max_length=50, description="품목 코드")
    item_name: str = Field(..., max_length=200, description="품목명")
    category: Optional[str] = Field(None, max_length=100, description="카테고리")
    brand: Optional[str] = Field(None, max_length=100, description="브랜드")
    
    current_stock: int = Field(default=0, ge=0, description="현재 재고")
    minimum_stock: int = Field(default=0, ge=0, description="최소 재고")
    maximum_stock: Optional[int] = Field(None, ge=0, description="최대 재고")
    
    unit_price: Optional[float] = Field(None, ge=0, description="단가")
    currency: str = Field(default="KRW", max_length=10, description="통화")
    
    supplier_name: Optional[str] = Field(None, max_length=200, description="공급업체명")
    supplier_contact: Optional[str] = Field(None, max_length=100, description="공급업체 연락처")
    
    location: Optional[str] = Field(None, max_length=100, description="위치")
    warehouse: Optional[str] = Field(None, max_length=100, description="창고")
    
    is_active: bool = Field(default=True, description="활성 상태")
    description: Optional[str] = Field(None, description="설명")

# 생성용 스키마
class InventoryCreate(InventoryBase):
    pass

# 업데이트용 스키마
class InventoryUpdate(BaseModel):
    item_name: Optional[str] = Field(None, max_length=200, description="품목명")
    category: Optional[str] = Field(None, max_length=100, description="카테고리")
    brand: Optional[str] = Field(None, max_length=100, description="브랜드")
    
    current_stock: Optional[int] = Field(None, ge=0, description="현재 재고")
    minimum_stock: Optional[int] = Field(None, ge=0, description="최소 재고")
    maximum_stock: Optional[int] = Field(None, ge=0, description="최대 재고")
    
    unit_price: Optional[float] = Field(None, ge=0, description="단가")
    currency: Optional[str] = Field(None, max_length=10, description="통화")
    
    supplier_name: Optional[str] = Field(None, max_length=200, description="공급업체명")
    supplier_contact: Optional[str] = Field(None, max_length=100, description="공급업체 연락처")
    
    location: Optional[str] = Field(None, max_length=100, description="위치")
    warehouse: Optional[str] = Field(None, max_length=100, description="창고")
    
    is_active: Optional[bool] = Field(None, description="활성 상태")
    description: Optional[str] = Field(None, description="설명")

# 응답용 스키마
class InventoryInDB(InventoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)

class Inventory(InventoryInDB):
    pass

# 재고 목록 응답
class InventoryList(BaseModel):
    items: list[Inventory]
    total: int
    page: int
    size: int
    pages: int

# 재고 통계
class InventoryStats(BaseModel):
    total_items: int
    low_stock_items: int
    out_of_stock_items: int
    total_value: float