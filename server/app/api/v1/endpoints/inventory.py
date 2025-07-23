from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import crud, schemas
from app.api.deps import get_db

router = APIRouter()


@router.get("/", response_model=schemas.UnifiedInventoryList)
def read_inventories(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_active: Optional[bool] = Query(None)
):
    items = crud.inventory.get_multi_with_search(
        db=db, skip=skip, limit=limit, search=search, category=category, is_active=is_active
    )
    total = crud.inventory.count_with_search(
        db=db, search=search, category=category, is_active=is_active
    )
    return {
        "items": items,
        "total": total,
        "page": skip // limit + 1,
        "size": limit,
        "pages": (total + limit - 1) // limit if total > 0 else 0
    }

@router.post("/", response_model=schemas.UnifiedInventoryInDB)
def create_inventory(
    inventory_in: schemas.UnifiedInventoryCreate,
    db: Session = Depends(get_db)
):
    existing_item = crud.inventory.get_by_item_code(db=db, item_code=inventory_in.item_code)
    if existing_item:
        raise HTTPException(status_code=400, detail=f"품목 코드 '{inventory_in.item_code}'가 이미 존재합니다.")
    
    inventory = crud.inventory.create(db=db, obj_in=inventory_in)
    return inventory

@router.put("/{item_id}/receipts/{receipt_number}", response_model=schemas.UnifiedInventoryInDB)
def update_receipt(
    item_id: int,
    receipt_number: str,
    receipt_in: schemas.ReceiptHistoryCreate,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    # 기존 수령 이력 제거
    old_receipt = next((r for r in inventory.receipt_history if r['receipt_number'] == receipt_number), None)
    if not old_receipt:
        raise HTTPException(status_code=404, detail="수령 이력을 찾을 수 없습니다.")
    inventory.receipt_history = [r for r in inventory.receipt_history if r['receipt_number'] != receipt_number]
    # 새 수령 이력 추가
    inventory.receipt_history.append(receipt_in.dict())
    # 수량 및 상태 업데이트
    inventory.total_received = sum(r['received_quantity'] for r in inventory.receipt_history)
    inventory.current_quantity = inventory.total_received - (inventory.reserved_quantity or 0)
    condition = receipt_in.condition or "good"
    inventory.condition_quantities = {
        "excellent": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "excellent"),
        "good": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "good"),
        "damaged": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "damaged"),
        "defective": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "defective")
    }
    db.commit()
    db.refresh(inventory)
    return inventory

@router.delete("/{item_id}/receipts/{receipt_number}", response_model=schemas.UnifiedInventoryInDB)
def delete_receipt(
    item_id: int,
    receipt_number: str,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    old_receipt = next((r for r in inventory.receipt_history if r['receipt_number'] == receipt_number), None)
    if not old_receipt:
        raise HTTPException(status_code=404, detail="수령 이력을 찾을 수 없습니다.")
    inventory.receipt_history = [r for r in inventory.receipt_history if r['receipt_number'] != receipt_number]
    inventory.total_received = sum(r['received_quantity'] for r in inventory.receipt_history)
    inventory.current_quantity = inventory.total_received - (inventory.reserved_quantity or 0)
    inventory.condition_quantities = {
        "excellent": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "excellent"),
        "good": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "good"),
        "damaged": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "damaged"),
        "defective": sum(r['received_quantity'] for r in inventory.receipt_history if r['condition'] == "defective")
    }
    db.commit()
    db.refresh(inventory)
    return inventory

@router.post("/{item_id}/receipts", response_model=schemas.UnifiedInventoryInDB)
def add_receipt(
    item_id: int,
    receipt_in: schemas.ReceiptHistoryCreate,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    inventory = crud.inventory.add_receipt(
        db=db,
        item_id=item_id,
        receipt_in=receipt_in
    )
    return inventory

@router.get("/stats", response_model=schemas.InventoryStats)
def read_inventory_stats(db: Session = Depends(get_db)):
    """
    재고 통계 조회
    """
    stats = crud.inventory.get_inventory_stats(db=db)
    return stats

@router.get("/categories", response_model=List[str])
def read_categories(db: Session = Depends(get_db)):
    """
    모든 카테고리 목록 조회
    """
    return crud.inventory.get_categories(db=db)

@router.get("/low-stock", response_model=List[schemas.Inventory])
def read_low_stock_items(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000)
):
    """
    재고 부족 품목 조회
    """
    return crud.inventory.get_low_stock_items(db=db, skip=skip, limit=limit)

@router.get("/out-of-stock", response_model=List[schemas.Inventory])
def read_out_of_stock_items(
    db: Session = Depends(get_db),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=1000)
):
    """
    재고 없는 품목 조회
    """
    return crud.inventory.get_out_of_stock_items(db=db, skip=skip, limit=limit)

@router.get("/{item_id}", response_model=schemas.UnifiedInventoryInDB)
def read_inventory(
    item_id: int,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    return inventory

@router.get("/code/{item_code}", response_model=schemas.Inventory)
def read_inventory_by_code(
    *,
    db: Session = Depends(get_db),
    item_code: str
):
    """
    품목 코드로 재고 항목 조회
    """
    inventory = crud.inventory.get_by_item_code(db=db, item_code=item_code)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    return inventory

@router.put("/{item_id}", response_model=schemas.UnifiedInventoryInDB)
def update_inventory(
    item_id: int,
    inventory_in: schemas.UnifiedInventoryUpdate,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    inventory = crud.inventory.update(db=db, db_obj=inventory, obj_in=inventory_in)
    return inventory


@router.patch("/{item_id}/stock", response_model=schemas.Inventory)
def update_inventory_stock(
    *,
    db: Session = Depends(get_db),
    item_id: int,
    quantity: int = Query(..., description="변경할 수량 (음수는 출고, 양수는 입고)")
):
    """
    재고 수량 업데이트
    """
    inventory = crud.inventory.update_stock(db=db, item_id=item_id, quantity=quantity)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    return inventory

@router.delete("/{item_id}")
def delete_inventory(
    item_id: int,
    db: Session = Depends(get_db)
):
    inventory = crud.inventory.get(db=db, id=item_id)
    if not inventory:
        raise HTTPException(status_code=404, detail="재고 항목을 찾을 수 없습니다.")
    
    crud.inventory.remove(db=db, id=item_id)
    return {"message": "재고 항목이 삭제되었습니다."}