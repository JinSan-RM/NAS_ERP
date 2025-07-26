# server/app/schemas/unified_inventory.py - LOG 관련 스키마 제거
from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, ConfigDict

# 수령 이력 스키마 (단순화)
class ReceiptHistoryBase(BaseModel):
    receipt_number: str = Field(..., max_length=50, description="수령 번호")
    item_name: str = Field(..., max_length=200, description="품목명")
    expected_quantity: int = Field(..., ge=1, description="예상 수량")
    received_quantity: int = Field(..., ge=0, description="수령 수량")
    receiver_name: str = Field(..., max_length=100, description="수령자명")
    receiver_email: Optional[str] = Field(None, max_length=255, description="수령자 이메일")
    department: str = Field(..., max_length=100, description="부서")
    received_date: datetime = Field(..., description="수령일")
    location: Optional[str] = Field(None, max_length=200, description="수령 위치")
    condition: Optional[str] = Field(None, max_length=50, description="품목 상태")
    notes: Optional[str] = Field(None, description="비고")

class ReceiptHistoryCreate(ReceiptHistoryBase):
    receipt_number: Optional[str] = None
    received_quantity: int
    receiver_name: str
    receiver_email: Optional[str] = None
    department: str
    received_date: str
    location: Optional[str] = None
    condition: Optional[str] = 'good'
    notes: Optional[str] = None
    image_urls: Optional[List[str]] = None  # 새로 추가: 이미지 URL 배열

class ReceiptHistoryInDB(ReceiptHistoryBase):
    model_config = ConfigDict(from_attributes=True)

# 기본 스키마
class UnifiedInventoryBase(BaseModel):
    item_name: str = Field(..., max_length=200, description="품목명")
    category: Optional[str] = Field(None, max_length=100, description="카테고리")
    brand: Optional[str] = Field(None, max_length=100, description="브랜드")
    specifications: Optional[str] = Field(None, description="사양")
    unit: str = Field(default="개", max_length=20, description="단위")
    unit_price: Optional[float] = Field(None, ge=0, description="단가")
    currency: str = Field(default="KRW", max_length=10, description="통화")
    location: Optional[str] = Field(None, max_length=200, description="위치")
    warehouse: Optional[str] = Field(None, max_length=100, description="창고")
    supplier_name: Optional[str] = Field(None, max_length=200, description="공급업체명")
    supplier_contact: Optional[str] = Field(None, max_length=100, description="공급업체 연락처")
    minimum_stock: int = Field(default=0, ge=0, description="최소 재고")
    maximum_stock: Optional[int] = Field(None, ge=0, description="최대 재고")
    is_consumable: bool = Field(default=False, description="소모품 여부")
    requires_approval: bool = Field(default=False, description="사용 시 승인 필요")
    description: Optional[str] = Field(None, description="설명")
    notes: Optional[str] = Field(None, description="비고")
    tags: List[str] = Field(default=[], description="태그")

# 생성용 스키마
class UnifiedInventoryCreate(UnifiedInventoryBase):
    item_code: str = Field(..., max_length=50, description="품목 코드")
    receipt_history: Optional[List[ReceiptHistoryCreate]] = Field(default=[], description="수령 이력")

# 업데이트용 스키마
class UnifiedInventoryUpdate(BaseModel):
    item_name: Optional[str] = Field(None, max_length=200, description="품목명")
    category: Optional[str] = Field(None, max_length=100, description="카테고리")
    brand: Optional[str] = Field(None, max_length=100, description="브랜드")
    specifications: Optional[str] = Field(None, description="사양")
    unit_price: Optional[float] = Field(None, ge=0, description="단가")
    currency: Optional[str] = Field(None, max_length=10, description="통화")
    location: Optional[str] = Field(None, max_length=200, description="위치")
    warehouse: Optional[str] = Field(None, max_length=100, description="창고")
    supplier_name: Optional[str] = Field(None, max_length=200, description="공급업체명")
    supplier_contact: Optional[str] = Field(None, max_length=100, description="공급업체 연락처")
    minimum_stock: Optional[int] = Field(None, ge=0, description="최소 재고")
    maximum_stock: Optional[int] = Field(None, ge=0, description="최대 재고")
    is_consumable: Optional[bool] = Field(None, description="소모품 여부")
    requires_approval: Optional[bool] = Field(None, description="사용 시 승인 필요")
    description: Optional[str] = Field(None, description="설명")
    notes: Optional[str] = Field(None, description="비고")
    tags: Optional[List[str]] = Field(None, description="태그")

# 수량 업데이트용 (단순화)
class InventoryQuantityUpdate(BaseModel):
    quantity_change: int = Field(..., description="변경할 수량 (양수: 입고, 음수: 출고)")
    user_name: str = Field(..., description="처리자명")
    department: str = Field(..., description="부서")
    purpose: Optional[str] = Field(None, description="사용 목적")
    notes: Optional[str] = Field(None, description="비고")

# 응답용 스키마
class UnifiedInventoryInDB(UnifiedInventoryBase):
    id: int
    item_code: str
    total_received: int
    current_quantity: int
    reserved_quantity: int
    condition_quantities: Dict[str, int]
    total_value: Optional[float]
    receipt_history: List[ReceiptHistoryInDB]
    last_received_date: Optional[datetime]
    last_received_by: Optional[str]
    last_received_department: Optional[str]
    last_used_date: Optional[datetime]
    main_image_url: Optional[str]
    image_urls: List[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime]
    created_by: Optional[str]
    updated_by: Optional[str]
    available_quantity: int = Field(description="사용 가능한 수량")
    utilization_rate: float = Field(description="사용률 (%)")
    is_low_stock: bool = Field(description="재고 부족 여부")
    stock_status: str = Field(description="재고 상태")
    model_config = ConfigDict(from_attributes=True)
    
#
# 이미지 관련 스키마
class InventoryImageBase(BaseModel):
    image_type: str = Field(default="general", description="이미지 유형")
    description: Optional[str] = Field(None, max_length=200, description="이미지 설명")

class InventoryImageCreate(InventoryImageBase):
    unified_inventory_id: int = Field(..., description="품목 ID")

class InventoryImageInDB(InventoryImageBase):
    id: int
    unified_inventory_id: int
    filename: str
    original_filename: str
    file_path: str
    file_size: int
    mime_type: str
    thumbnail_path: Optional[str]
    is_active: bool
    uploaded_at: datetime
    uploaded_by: Optional[str]
    
    model_config = ConfigDict(from_attributes=True)

class InventoryImage(InventoryImageInDB):
    pass

# 목록 응답
class UnifiedInventoryList(BaseModel):
    items: List[UnifiedInventoryInDB]
    total: int
    page: int
    size: int
    pages: int

# 통계 스키마 (단순화)
class UnifiedInventoryStats(BaseModel):
    total_items: int
    total_categories: int
    low_stock_items: int
    out_of_stock_items: int
    overstocked_items: int
    total_value: float
    average_utilization: float
    
    # 상태별 통계
    status_distribution: Dict[str, int] = {
        "normal": 0,
        "low_stock": 0,
        "out_of_stock": 0,
        "overstocked": 0
    }
    
    # 카테고리별 통계
    category_distribution: List[Dict[str, Any]] = []
    
    # 최근 활동 (사용 로그 관련 제거)
    recent_receipts: int

# 검색 필터
class UnifiedInventoryFilter(BaseModel):
    search: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    supplier_name: Optional[str] = None
    location: Optional[str] = None
    warehouse: Optional[str] = None
    
    stock_status: Optional[str] = None
    is_consumable: Optional[bool] = None
    requires_approval: Optional[bool] = None
    
    last_received_from: Optional[datetime] = None
    last_received_to: Optional[datetime] = None
    
    min_quantity: Optional[int] = None
    max_quantity: Optional[int] = None
    
    has_images: Optional[bool] = None
    tags: Optional[List[str]] = None

# 구매 요청에서 품목 생성용 스키마
class CreateInventoryFromPurchase(BaseModel):
    purchase_request_id: int = Field(..., description="구매 요청 ID")
    received_quantity: int = Field(..., ge=1, description="수령 수량")
    receiver_name: str = Field(..., description="수령자명")
    receiver_email: Optional[str] = Field(None, description="수령자 이메일")
    department: str = Field(..., description="부서")
    received_date: datetime = Field(..., description="수령일시")
    location: Optional[str] = Field(None, description="수령 위치")
    condition: str = Field(default="good", description="품목 상태")
    notes: Optional[str] = Field(None, description="비고")

# 파일 업로드 응답
class ImageUploadResponse(BaseModel):
    success: bool
    image_id: int
    filename: str
    file_url: str
    thumbnail_url: Optional[str] = None
    message: str

# Excel 내보내기/가져오기
class InventoryExportOptions(BaseModel):
    include_receipts: bool = Field(default=False, description="수령 이력 포함")
    include_images: bool = Field(default=False, description="이미지 정보 포함")
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    categories: Optional[List[str]] = None

class InventoryImportResult(BaseModel):
    success: bool
    total_rows: int
    created_count: int
    updated_count: int
    skipped_count: int
    error_count: int
    
    created_items: List[str] = []
    updated_items: List[str] = []
    errors: List[Dict[str, Any]] = []
    warnings: List[Dict[str, Any]] = []
    
    processing_time: float
    message: str

# 대시보드용 요약 정보 (단순화)
class InventoryDashboard(BaseModel):
    total_items: int
    total_value: float
    low_stock_alerts: int
    recent_receipts: int
    
    # 차트 데이터
    category_chart: List[Dict[str, Any]]
    stock_status_chart: List[Dict[str, Any]]
    monthly_receipts: List[Dict[str, Any]]
    
    # 알림 정보
    alerts: List[Dict[str, Any]]
    recommendations: List[str]

# 재고 이동/전송 (단순화)
class InventoryTransfer(BaseModel):
    quantity: int = Field(..., ge=1, description="이동 수량")
    to_location: str = Field(..., description="이동할 위치")
    transfer_by: str = Field(..., description="이동 처리자")
    department: str = Field(..., description="부서")
    reason: str = Field(..., description="이동 사유")
    notes: Optional[str] = Field(None, description="비고")

# QR 코드 생성
class QRCodeGenerate(BaseModel):
    include_info: List[str] = Field(default=["name", "code", "location"], description="포함할 정보")
    size: str = Field(default="medium", description="QR 코드 크기")

class QRCodeResponse(BaseModel):
    qr_code_url: str
    qr_code_data: str
    expiry_date: Optional[datetime] = None
    usage_type: str = Field(..., description="사용 유형")  # 'consumption', 'return', 'transfer', 'disposal'
    quantity: int = Field(..., ge=1, description="수량")
    unit: str = Field(default="개", description="단위")
    
    user_name: str = Field(..., max_length=100, description="사용자명")
    user_email: Optional[str] = Field(None, max_length=255, description="사용자 이메일")
    department: str = Field(..., max_length=100, description="부서")
    
    purpose: Optional[str] = Field(None, max_length=200, description="사용 목적")
    project: Optional[str] = Field(None, max_length=100, description="프로젝트")
    from_location: Optional[str] = Field(None, max_length=200, description="출발 위치")
    to_location: Optional[str] = Field(None, max_length=200, description="도착 위치")
    
    expected_return_date: Optional[datetime] = Field(None, description="예상 반납일")
    notes: Optional[str] = Field(None, description="비고")
