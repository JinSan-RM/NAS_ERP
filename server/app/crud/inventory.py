from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_
from app.crud.base import CRUDBase
from app.models.unified_inventory import UnifiedInventory
from app.schemas.unified_inventory import UnifiedInventoryCreate, UnifiedInventoryUpdate, ReceiptHistoryCreate
from datetime import datetime

class CRUDInventory(CRUDBase[UnifiedInventory, UnifiedInventoryCreate, UnifiedInventoryUpdate]):
    def get_by_item_code(self, db: Session, *, item_code: str) -> Optional[UnifiedInventory]:
        """품목 코드로 재고 조회"""
        return db.query(UnifiedInventory).filter(UnifiedInventory.item_code == item_code).first()
    
    def get_multi_with_search(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        category: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[UnifiedInventory]:
        """검색 조건으로 재고 목록 조회"""
        query = db.query(UnifiedInventory)
        if search:
            query = query.filter(
                or_(
                    UnifiedInventory.item_name.contains(search),
                    UnifiedInventory.item_code.contains(search),
                    UnifiedInventory.brand.contains(search),
                    UnifiedInventory.supplier_name.contains(search)
                )
            )
        if category:
            query = query.filter(UnifiedInventory.category == category)
        if is_active is not None:
            query = query.filter(UnifiedInventory.is_active == is_active)
        return query.offset(skip).limit(limit).all()
    
    def count_with_search(
        self,
        db: Session,
        *,
        search: Optional[str] = None,
        category: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> int:
        """검색 조건에 맞는 총 개수"""
        query = db.query(func.count(UnifiedInventory.id))
        if search:
            query = query.filter(
                or_(
                    UnifiedInventory.item_name.contains(search),
                    UnifiedInventory.item_code.contains(search),
                    UnifiedInventory.brand.contains(search),
                    UnifiedInventory.supplier_name.contains(search)
                )
            )
        if category:
            query = query.filter(UnifiedInventory.category == category)
        if is_active is not None:
            query = query.filter(UnifiedInventory.is_active == is_active)
        return query.scalar()
    
    def get_low_stock_items(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[UnifiedInventory]:
        """재고 부족 품목 조회"""
        return (
            db.query(UnifiedInventory)
            .filter(UnifiedInventory.current_quantity <= UnifiedInventory.minimum_stock)
            .filter(UnifiedInventory.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_out_of_stock_items(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[UnifiedInventory]:
        """재고 없는 품목 조회"""
        return (
            db.query(UnifiedInventory)
            .filter(UnifiedInventory.current_quantity == 0)
            .filter(UnifiedInventory.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_categories(self, db: Session) -> List[str]:
        """모든 카테고리 목록 조회"""
        result = db.query(UnifiedInventory.category).distinct().filter(UnifiedInventory.category.isnot(None)).all()
        return [category[0] for category in result if category[0]]
    
    def update_stock(self, db: Session, *, item_id: int, quantity: int) -> Optional[UnifiedInventory]:
        """재고 수량 업데이트"""
        db_obj = self.get(db, id=item_id)
        if db_obj:
            db_obj.current_quantity = max(0, db_obj.current_quantity + quantity)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def add_receipt(self, db: Session, *, item_id: int, receipt_in: ReceiptHistoryCreate) -> Optional[UnifiedInventory]:
        """수령 이력 추가"""
        inventory = self.get(db=db, id=item_id)
        if not inventory:
            return None
        receipt_data = receipt_in.dict()
        inventory.receipt_history = inventory.receipt_history or []
        inventory.receipt_history.append(receipt_data)
        inventory.total_received += receipt_in.received_quantity
        inventory.current_quantity += receipt_in.received_quantity
        inventory.last_received_date = receipt_in.received_date
        inventory.last_received_by = receipt_in.receiver_name
        inventory.last_received_department = receipt_in.department
        condition = receipt_in.condition or "good"
        inventory.condition_quantities[condition] = inventory.condition_quantities.get(condition, 0) + receipt_in.received_quantity
        db.add(inventory)
        db.commit()
        db.refresh(inventory)
        return inventory
    
    def get_inventory_stats(self, db: Session):
        """재고 통계 조회"""
        total_items = db.query(func.count(UnifiedInventory.id)).filter(UnifiedInventory.is_active == True).scalar()
        low_stock_items = (
            db.query(func.count(UnifiedInventory.id))
            .filter(UnifiedInventory.current_quantity <= UnifiedInventory.minimum_stock)
            .filter(UnifiedInventory.is_active == True)
            .scalar()
        )
        out_of_stock_items = (
            db.query(func.count(UnifiedInventory.id))
            .filter(UnifiedInventory.current_quantity == 0)
            .filter(UnifiedInventory.is_active == True)
            .scalar()
        )
        total_value = (
            db.query(func.sum(UnifiedInventory.current_quantity * UnifiedInventory.unit_price))
            .filter(UnifiedInventory.is_active == True)
            .filter(UnifiedInventory.unit_price.isnot(None))
            .scalar() or 0
        )
        return {
            "total_items": total_items or 0,
            "low_stock_items": low_stock_items or 0,
            "out_of_stock_items": out_of_stock_items or 0,
            "total_value": float(total_value)
        }

inventory = CRUDInventory(UnifiedInventory)