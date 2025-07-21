from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.crud.base import CRUDBase
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryCreate, InventoryUpdate

class CRUDInventory(CRUDBase[Inventory, InventoryCreate, InventoryUpdate]):
    def get_by_item_code(self, db: Session, *, item_code: str) -> Optional[Inventory]:
        """품목 코드로 재고 조회"""
        return db.query(Inventory).filter(Inventory.item_code == item_code).first()
    
    def get_multi_with_search(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
        category: Optional[str] = None,
        is_active: Optional[bool] = None
    ) -> List[Inventory]:
        """검색 조건으로 재고 목록 조회"""
        query = db.query(self.model)
        
        # 검색어 필터링
        if search:
            query = query.filter(
                or_(
                    Inventory.item_name.contains(search),
                    Inventory.item_code.contains(search),
                    Inventory.brand.contains(search),
                    Inventory.supplier_name.contains(search)
                )
            )
        
        # 카테고리 필터링
        if category:
            query = query.filter(Inventory.category == category)
        
        # 활성 상태 필터링
        if is_active is not None:
            query = query.filter(Inventory.is_active == is_active)
        
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
        query = db.query(func.count(self.model.id))
        
        if search:
            query = query.filter(
                or_(
                    Inventory.item_name.contains(search),
                    Inventory.item_code.contains(search),
                    Inventory.brand.contains(search),
                    Inventory.supplier_name.contains(search)
                )
            )
        
        if category:
            query = query.filter(Inventory.category == category)
        
        if is_active is not None:
            query = query.filter(Inventory.is_active == is_active)
        
        return query.scalar()
    
    def get_low_stock_items(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Inventory]:
        """재고 부족 품목 조회"""
        return (
            db.query(self.model)
            .filter(Inventory.current_stock <= Inventory.minimum_stock)
            .filter(Inventory.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_out_of_stock_items(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[Inventory]:
        """재고 없는 품목 조회"""
        return (
            db.query(self.model)
            .filter(Inventory.current_stock == 0)
            .filter(Inventory.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_categories(self, db: Session) -> List[str]:
        """모든 카테고리 목록 조회"""
        result = db.query(Inventory.category).distinct().filter(Inventory.category.isnot(None)).all()
        return [category[0] for category in result if category[0]]
    
    def update_stock(self, db: Session, *, item_id: int, quantity: int) -> Optional[Inventory]:
        """재고 수량 업데이트"""
        db_obj = self.get(db, id=item_id)
        if db_obj:
            db_obj.current_stock = max(0, db_obj.current_stock + quantity)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def get_inventory_stats(self, db: Session):
        """재고 통계 조회"""
        total_items = db.query(func.count(Inventory.id)).filter(Inventory.is_active == True).scalar()
        
        low_stock_items = (
            db.query(func.count(Inventory.id))
            .filter(Inventory.current_stock <= Inventory.minimum_stock)
            .filter(Inventory.is_active == True)
            .scalar()
        )
        
        out_of_stock_items = (
            db.query(func.count(Inventory.id))
            .filter(Inventory.current_stock == 0)
            .filter(Inventory.is_active == True)
            .scalar()
        )
        
        total_value = (
            db.query(func.sum(Inventory.current_stock * Inventory.unit_price))
            .filter(Inventory.is_active == True)
            .filter(Inventory.unit_price.isnot(None))
            .scalar() or 0
        )
        
        return {
            "total_items": total_items or 0,
            "low_stock_items": low_stock_items or 0,
            "out_of_stock_items": out_of_stock_items or 0,
            "total_value": float(total_value)
        }

inventory = CRUDInventory(Inventory)