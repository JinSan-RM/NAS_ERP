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

from .unified_inventory import (
    UnifiedInventoryCreate,
    UnifiedInventoryUpdate,
    UnifiedInventoryInDB,
    UnifiedInventoryList,
    UnifiedInventoryStats,
    UnifiedInventoryBase,
    ReceiptHistoryCreate,
    ReceiptHistoryInDB,
    ReceiptHistoryBase,
    ReceiptBase,
    ReceiptCreate,
    ReceiptInDB
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
    "PurchaseRequestApproval",

    "UnifiedInventoryCreate",
    "UnifiedInventoryUpdate",
    "UnifiedInventoryInDB",
    "UnifiedInventoryList",
    "UnifiedInventoryStats",
    "UnifiedInventoryBase",
    "ReceiptHistoryCreate",
    "ReceiptHistoryInDB",
    "ReceiptHistoryBase",
    "ReceiptCreate",
    "ReceiptInDB",
    "ReceiptBase"
]