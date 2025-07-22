# server/app/schemas/__init__.py

from .inventory import (
    Inventory,
    InventoryCreate,
    InventoryUpdate,
    InventoryInDB,
    InventoryList,
    InventoryStats,
    InventoryBase
)

from .purchase_request import (
    PurchaseRequest,
    PurchaseRequestCreate,
    PurchaseRequestUpdate,
    PurchaseRequestInDB,
    PurchaseRequestList,
    PurchaseRequestStats,
    PurchaseRequestBase,
    PurchaseRequestFilter,
    PurchaseRequestApproval
)

__all__ = [
    # 재고 관리
    "Inventory",
    "InventoryCreate", 
    "InventoryUpdate",
    "InventoryInDB",
    "InventoryList",
    "InventoryStats",
    "InventoryBase",
    
    # 구매 요청
    "PurchaseRequest",
    "PurchaseRequestCreate",
    "PurchaseRequestUpdate", 
    "PurchaseRequestInDB",
    "PurchaseRequestList",
    "PurchaseRequestStats",
    "PurchaseRequestBase",
    "PurchaseRequestFilter",
    "PurchaseRequestApproval"
]