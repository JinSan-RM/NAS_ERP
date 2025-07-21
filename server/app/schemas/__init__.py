# app/schemas/__init__.py

from .inventory import (
    Inventory,
    InventoryCreate,
    InventoryUpdate,
    InventoryInDB,
    InventoryList,
    InventoryStats,
    InventoryBase
)

__all__ = [
    "Inventory",
    "InventoryCreate", 
    "InventoryUpdate",
    "InventoryInDB",
    "InventoryList",
    "InventoryStats",
    "InventoryBase"
]