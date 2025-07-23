from enum import Enum

class RequestStatus(str, Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class UrgencyLevel(str, Enum):
    LOW = "LOW"
    NORMAL = "NORMAL"
    HIGH = "HIGH"
    URGENT = "URGENT"
    EMERGENCY = "EMERGENCY"

class ItemCategory(str, Enum):
    OFFICE_SUPPLIES = "OFFICE_SUPPLIES"        # 사무 용품
    ELECTRONICS = "ELECTRONICS"                # 전자제품/IT 장비
    FURNITURE = "FURNITURE"                    # 가구
    SOFTWARE = "SOFTWARE"                      # 소프트웨어
    MAINTENANCE = "MAINTENANCE"                # 유지보수
    SERVICES = "SERVICES"                      # 서비스
    OTHER = "OTHER"                           # 기타

class PurchaseMethod(str, Enum):
    DIRECT = "DIRECT"
    QUOTATION = "QUOTATION"
    CONTRACT = "CONTRACT"
    FRAMEWORK = "FRAMEWORK"
    MARKETPLACE = "MARKETPLACE"