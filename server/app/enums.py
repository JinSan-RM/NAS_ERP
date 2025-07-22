# app/enums.py
from enum import Enum

class RequestStatus(str, Enum):
    DRAFT = "draft"
    SUBMITTED = "submitted"
    PENDING_APPROVAL = "pending_approval"
    APPROVED = "approved"
    REJECTED = "rejected"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class UrgencyLevel(str, Enum):
    LOW = "low"
    NORMAL = "normal"
    HIGH = "high"
    URGENT = "urgent"
    EMERGENCY = "emergency"

class ItemCategory(str, Enum):
    OFFICE_SUPPLIES = "office_supplies"
    ELECTRONICS = "electronics"
    FURNITURE = "furniture"
    SOFTWARE = "software"
    MAINTENANCE = "maintenance"
    SERVICES = "services"
    OTHER = "other"

class PurchaseMethod(str, Enum):
    DIRECT = "direct"
    QUOTATION = "quotation"
    CONTRACT = "contract"
    FRAMEWORK = "framework"
    MARKETPLACE = "marketplace"