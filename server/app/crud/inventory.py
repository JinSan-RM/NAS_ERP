# server/app/crud/inventory.py - Unified Inventory 지원
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_, extract, text
from app.crud.base import CRUDBase
from app.models.unified_inventory import UnifiedInventory, InventoryUsageLog, InventoryImage
from app.schemas.unified_inventory import (
    UnifiedInventoryCreate, 
    UnifiedInventoryUpdate, 
    ReceiptHistoryCreate,
    UnifiedInventoryFilter,
    InventoryUsageLogCreate,
    InventoryImageCreate,
    InventoryQuantityUpdate,
    UnifiedInventoryStats
)

class CRUDInventory(CRUDBase[UnifiedInventory, UnifiedInventoryCreate, UnifiedInventoryUpdate]):
    
    def get_by_item_code(self, db: Session, *, item_code: str) -> Optional[UnifiedInventory]:
        """품목 코드로 재고 조회"""
        return db.query(UnifiedInventory).filter(
            UnifiedInventory.item_code == item_code
        ).first()
    
    def get_multi_with_filter(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[UnifiedInventoryFilter] = None
    ) -> List[UnifiedInventory]:
        """필터링된 재고 목록 조회"""
        query = db.query(UnifiedInventory).filter(UnifiedInventory.is_active == True)
        
        if filters:
            # 텍스트 검색
            if filters.search:
                search_term = f"%{filters.search}%"
                query = query.filter(
                    or_(
                        UnifiedInventory.item_name.ilike(search_term),
                        UnifiedInventory.item_code.ilike(search_term),
                        UnifiedInventory.brand.ilike(search_term),
                        UnifiedInventory.supplier_name.ilike(search_term),
                        UnifiedInventory.description.ilike(search_term)
                    )
                )
            
            # 카테고리 필터
            if filters.category:
                query = query.filter(UnifiedInventory.category == filters.category)
            
            # 브랜드 필터
            if filters.brand:
                query = query.filter(UnifiedInventory.brand.ilike(f"%{filters.brand}%"))
            
            # 공급업체 필터
            if filters.supplier_name:
                query = query.filter(UnifiedInventory.supplier_name.ilike(f"%{filters.supplier_name}%"))
            
            # 위치 필터
            if filters.location:
                query = query.filter(UnifiedInventory.location.ilike(f"%{filters.location}%"))
            
            # 창고 필터
            if filters.warehouse:
                query = query.filter(UnifiedInventory.warehouse.ilike(f"%{filters.warehouse}%"))
            
            # 재고 상태 필터
            if filters.stock_status:
                if filters.stock_status == "low_stock":
                    query = query.filter(UnifiedInventory.current_quantity <= UnifiedInventory.minimum_stock)
                elif filters.stock_status == "out_of_stock":
                    query = query.filter(UnifiedInventory.current_quantity == 0)
                elif filters.stock_status == "overstocked":
                    query = query.filter(
                        and_(
                            UnifiedInventory.maximum_stock.isnot(None),
                            UnifiedInventory.current_quantity >= UnifiedInventory.maximum_stock
                        )
                    )
                elif filters.stock_status == "normal":
                    query = query.filter(
                        and_(
                            UnifiedInventory.current_quantity > UnifiedInventory.minimum_stock,
                            or_(
                                UnifiedInventory.maximum_stock.is_(None),
                                UnifiedInventory.current_quantity < UnifiedInventory.maximum_stock
                            )
                        )
                    )
            
            # 소모품 여부 필터
            if filters.is_consumable is not None:
                query = query.filter(UnifiedInventory.is_consumable == filters.is_consumable)
            
            # 승인 필요 여부 필터
            if filters.requires_approval is not None:
                query = query.filter(UnifiedInventory.requires_approval == filters.requires_approval)
            
            # 날짜 범위 필터
            if filters.last_received_from:
                query = query.filter(UnifiedInventory.last_received_date >= filters.last_received_from)
            if filters.last_received_to:
                query = query.filter(UnifiedInventory.last_received_date <= filters.last_received_to)
            
            # 수량 범위 필터
            if filters.min_quantity is not None:
                query = query.filter(UnifiedInventory.current_quantity >= filters.min_quantity)
            if filters.max_quantity is not None:
                query = query.filter(UnifiedInventory.current_quantity <= filters.max_quantity)
            
            # 이미지 보유 여부 필터
            if filters.has_images is not None:
                if filters.has_images:
                    query = query.filter(UnifiedInventory.main_image_url.isnot(None))
                else:
                    query = query.filter(UnifiedInventory.main_image_url.is_(None))
            
            # 태그 필터
            if filters.tags:
                for tag in filters.tags:
                    query = query.filter(UnifiedInventory.tags.contains([tag]))
        
        # 정렬: 품목명 오름차순
        query = query.order_by(UnifiedInventory.item_name)
        
        return query.offset(skip).limit(limit).all()
    
    def count_with_filter(
        self,
        db: Session,
        *,
        filters: Optional[UnifiedInventoryFilter] = None
    ) -> int:
        """필터링된 재고 총 개수"""
        query = db.query(func.count(UnifiedInventory.id)).filter(UnifiedInventory.is_active == True)
        
        if filters:
            # 동일한 필터 로직 적용
            if filters.search:
                search_term = f"%{filters.search}%"
                query = query.filter(
                    or_(
                        UnifiedInventory.item_name.ilike(search_term),
                        UnifiedInventory.item_code.ilike(search_term),
                        UnifiedInventory.brand.ilike(search_term),
                        UnifiedInventory.supplier_name.ilike(search_term),
                        UnifiedInventory.description.ilike(search_term)
                    )
                )
            
            if filters.category:
                query = query.filter(UnifiedInventory.category == filters.category)
            
            if filters.brand:
                query = query.filter(UnifiedInventory.brand.ilike(f"%{filters.brand}%"))
            
            if filters.supplier_name:
                query = query.filter(UnifiedInventory.supplier_name.ilike(f"%{filters.supplier_name}%"))
            
            if filters.location:
                query = query.filter(UnifiedInventory.location.ilike(f"%{filters.location}%"))
            
            if filters.warehouse:
                query = query.filter(UnifiedInventory.warehouse.ilike(f"%{filters.warehouse}%"))
            
            if filters.stock_status:
                if filters.stock_status == "low_stock":
                    query = query.filter(UnifiedInventory.current_quantity <= UnifiedInventory.minimum_stock)
                elif filters.stock_status == "out_of_stock":
                    query = query.filter(UnifiedInventory.current_quantity == 0)
                elif filters.stock_status == "overstocked":
                    query = query.filter(
                        and_(
                            UnifiedInventory.maximum_stock.isnot(None),
                            UnifiedInventory.current_quantity >= UnifiedInventory.maximum_stock
                        )
                    )
                elif filters.stock_status == "normal":
                    query = query.filter(
                        and_(
                            UnifiedInventory.current_quantity > UnifiedInventory.minimum_stock,
                            or_(
                                UnifiedInventory.maximum_stock.is_(None),
                                UnifiedInventory.current_quantity < UnifiedInventory.maximum_stock
                            )
                        )
                    )
            
            if filters.is_consumable is not None:
                query = query.filter(UnifiedInventory.is_consumable == filters.is_consumable)
            
            if filters.requires_approval is not None:
                query = query.filter(UnifiedInventory.requires_approval == filters.requires_approval)
            
            if filters.last_received_from:
                query = query.filter(UnifiedInventory.last_received_date >= filters.last_received_from)
            if filters.last_received_to:
                query = query.filter(UnifiedInventory.last_received_date <= filters.last_received_to)
            
            if filters.min_quantity is not None:
                query = query.filter(UnifiedInventory.current_quantity >= filters.min_quantity)
            if filters.max_quantity is not None:
                query = query.filter(UnifiedInventory.current_quantity <= filters.max_quantity)
            
            if filters.has_images is not None:
                if filters.has_images:
                    query = query.filter(UnifiedInventory.main_image_url.isnot(None))
                else:
                    query = query.filter(UnifiedInventory.main_image_url.is_(None))
            
            if filters.tags:
                for tag in filters.tags:
                    query = query.filter(UnifiedInventory.tags.contains([tag]))
        
        return query.scalar()
    
    def get_low_stock_items(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[UnifiedInventory]:
        """재고 부족 품목 조회"""
        return (
            db.query(UnifiedInventory)
            .filter(UnifiedInventory.current_quantity <= UnifiedInventory.minimum_stock)
            .filter(UnifiedInventory.is_active == True)
            .order_by(UnifiedInventory.current_quantity)
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
            .order_by(UnifiedInventory.last_received_date.desc().nullslast())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_categories(self, db: Session) -> List[str]:
        """모든 카테고리 목록 조회"""
        result = db.query(UnifiedInventory.category).distinct().filter(
            and_(
                UnifiedInventory.category.isnot(None),
                UnifiedInventory.is_active == True
            )
        ).all()
        return [category[0] for category in result if category[0]]
    
    def get_brands(self, db: Session) -> List[str]:
        """모든 브랜드 목록 조회"""
        result = db.query(UnifiedInventory.brand).distinct().filter(
            and_(
                UnifiedInventory.brand.isnot(None),
                UnifiedInventory.is_active == True
            )
        ).all()
        return [brand[0] for brand in result if brand[0]]
    
    def get_suppliers(self, db: Session) -> List[str]:
        """모든 공급업체 목록 조회"""
        result = db.query(UnifiedInventory.supplier_name).distinct().filter(
            and_(
                UnifiedInventory.supplier_name.isnot(None),
                UnifiedInventory.is_active == True
            )
        ).all()
        return [supplier[0] for supplier in result if supplier[0]]
    
    def get_locations(self, db: Session) -> List[str]:
        """모든 위치 목록 조회"""
        result = db.query(UnifiedInventory.location).distinct().filter(
            and_(
                UnifiedInventory.location.isnot(None),
                UnifiedInventory.is_active == True
            )
        ).all()
        return [location[0] for location in result if location[0]]
    
    def get_warehouses(self, db: Session) -> List[str]:
        """모든 창고 목록 조회"""
        result = db.query(UnifiedInventory.warehouse).distinct().filter(
            and_(
                UnifiedInventory.warehouse.isnot(None),
                UnifiedInventory.is_active == True
            )
        ).all()
        return [warehouse[0] for warehouse in result if warehouse[0]]
    
    def get_all_tags(self, db: Session) -> List[str]:
        """모든 태그 목록 조회"""
        # JSON 배열에서 태그 추출 (PostgreSQL의 경우)
        try:
            result = db.execute(
                text("SELECT DISTINCT jsonb_array_elements_text(tags) as tag FROM unified_inventory WHERE is_active = true AND tags IS NOT NULL")
            ).fetchall()
            return [row[0] for row in result if row[0]]
        except:
            # 다른 DB의 경우 또는 오류 시 빈 리스트 반환
            return []
    
    def update_stock(self, db: Session, *, item_id: int, quantity: int) -> Optional[UnifiedInventory]:
        """재고 수량 업데이트"""
        db_obj = self.get(db, id=item_id)
        if db_obj:
            db_obj.current_quantity = max(0, db_obj.current_quantity + quantity)
            db_obj.updated_at = datetime.now()
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def add_receipt(self, db: Session, *, item_id: int, receipt_in: ReceiptHistoryCreate) -> Optional[UnifiedInventory]:
        """수령 이력 추가"""
        inventory = self.get(db=db, id=item_id)
        if not inventory:
            return None
        
        # 수령 번호 생성 (현재 시간 기반)
        receipt_number = f"RC{datetime.now().strftime('%Y%m%d')}{item_id:04d}{len(inventory.receipt_history or []) + 1:03d}"
        
        receipt_data = receipt_in.dict()
        receipt_data['receipt_number'] = receipt_number
        
        # 수령 이력 추가
        if inventory.receipt_history is None:
            inventory.receipt_history = []
        inventory.receipt_history.append(receipt_data)
        
        # 수량 업데이트
        inventory.total_received += receipt_in.received_quantity
        inventory.current_quantity += receipt_in.received_quantity
        
        # 최근 수령 정보 업데이트
        inventory.last_received_date = receipt_in.received_date
        inventory.last_received_by = receipt_in.receiver_name
        inventory.last_received_department = receipt_in.department
        
        # 상태별 수량 업데이트
        condition = receipt_in.condition or "good"
        if inventory.condition_quantities is None:
            inventory.condition_quantities = {"excellent": 0, "good": 0, "damaged": 0, "defective": 0}
        
        inventory.condition_quantities[condition] = inventory.condition_quantities.get(condition, 0) + receipt_in.received_quantity
        
        # 총 가치 업데이트
        if inventory.unit_price:
            inventory.total_value = inventory.current_quantity * inventory.unit_price
        
        inventory.updated_at = datetime.now()
        
        db.add(inventory)
        db.commit()
        db.refresh(inventory)
        return inventory
    
    def update_quantity_with_log(
        self, 
        db: Session, 
        *, 
        item_id: int, 
        quantity_change: int,
        usage_log: InventoryUsageLogCreate
    ) -> Optional[UnifiedInventory]:
        """사용 이력과 함께 수량 업데이트"""
        inventory = self.get(db=db, id=item_id)
        if not inventory:
            return None
        
        # 수량 변경
        new_quantity = max(0, inventory.current_quantity + quantity_change)
        inventory.current_quantity = new_quantity
        
        # 소모품인 경우 예약 수량 업데이트
        if inventory.is_consumable and quantity_change < 0:
            inventory.reserved_quantity = max(0, inventory.reserved_quantity + quantity_change)
        
        # 최근 사용일 업데이트
        if quantity_change < 0:  # 출고인 경우
            inventory.last_used_date = datetime.now()
        
        # 총 가치 업데이트
        if inventory.unit_price:
            inventory.total_value = inventory.current_quantity * inventory.unit_price
        
        inventory.updated_at = datetime.now()
     
        # 사용 이력 추가
        usage_log_obj = InventoryUsageLog(**usage_log.dict())
        db.add(usage_log_obj)
        
        db.add(inventory)
        db.commit()
        db.refresh(inventory)
        return inventory
    
    def get_inventory_stats(self, db: Session) -> UnifiedInventoryStats:
        """재고 통계 조회"""
        # 기본 통계
        total_items = db.query(func.count(UnifiedInventory.id)).filter(
            UnifiedInventory.is_active == True
        ).scalar() or 0
        
        low_stock_items = db.query(func.count(UnifiedInventory.id)).filter(
            and_(
                UnifiedInventory.current_quantity <= UnifiedInventory.minimum_stock,
                UnifiedInventory.is_active == True
            )
        ).scalar() or 0
        
        out_of_stock_items = db.query(func.count(UnifiedInventory.id)).filter(
            and_(
                UnifiedInventory.current_quantity == 0,
                UnifiedInventory.is_active == True
            )
        ).scalar() or 0
        
        overstocked_items = db.query(func.count(UnifiedInventory.id)).filter(
            and_(
                UnifiedInventory.maximum_stock.isnot(None),
                UnifiedInventory.current_quantity >= UnifiedInventory.maximum_stock,
                UnifiedInventory.is_active == True
            )
        ).scalar() or 0
        
        # 총 가치 계산
        total_value = db.query(
            func.sum(UnifiedInventory.current_quantity * UnifiedInventory.unit_price)
        ).filter(
            and_(
                UnifiedInventory.is_active == True,
                UnifiedInventory.unit_price.isnot(None)
            )
        ).scalar() or 0
        
        # 카테고리별 통계
        category_stats = db.query(
            UnifiedInventory.category,
            func.count(UnifiedInventory.id).label('count')
        ).filter(
            and_(
                UnifiedInventory.is_active == True,
                UnifiedInventory.category.isnot(None)
            )
        ).group_by(UnifiedInventory.category).all()
        
        total_categorized = sum(stat.count for stat in category_stats)
        category_distribution = [
            {
                "category": stat.category,
                "count": stat.count,
                "percentage": round((stat.count / total_categorized * 100), 2) if total_categorized > 0 else 0
            }
            for stat in category_stats
        ]
        
        # 최근 활동 통계
        recent_date = datetime.now() - timedelta(days=7)
        recent_receipts = db.query(func.count(UnifiedInventory.id)).filter(
            and_(
                UnifiedInventory.last_received_date >= recent_date,
                UnifiedInventory.is_active == True
            )
        ).scalar() or 0
        
        recent_usage = db.query(func.count(InventoryUsageLog.id)).filter(
            InventoryUsageLog.usage_date >= recent_date
        ).scalar() or 0
        
        # 승인 대기 건수
        pending_approvals = db.query(func.count(InventoryUsageLog.id)).filter(
            and_(
                InventoryUsageLog.requires_approval == True,
                InventoryUsageLog.approved_date.is_(None)
            )
        ).scalar() or 0
        
        # 평균 사용률 계산
        avg_utilization = db.query(
            func.avg(
                func.case(
                    [(UnifiedInventory.total_received > 0, 
                      (UnifiedInventory.total_received - UnifiedInventory.current_quantity) * 100.0 / UnifiedInventory.total_received)],
                    else_=0
                )
            )
        ).filter(UnifiedInventory.is_active == True).scalar() or 0
        
        return UnifiedInventoryStats(
            total_items=total_items,
            total_categories=len(category_distribution),
            low_stock_items=low_stock_items,
            out_of_stock_items=out_of_stock_items,
            overstocked_items=overstocked_items,
            total_value=float(total_value),
            average_utilization=round(float(avg_utilization), 2),
            status_distribution={
                "normal": total_items - low_stock_items - out_of_stock_items - overstocked_items,
                "low_stock": low_stock_items,
                "out_of_stock": out_of_stock_items,
                "overstocked": overstocked_items
            },
            category_distribution=category_distribution,
            recent_receipts=recent_receipts,
            recent_usage=recent_usage,
            pending_approvals=pending_approvals
        )
    
    def get_usage_logs(self, db: Session, *, item_id: int, skip: int = 0, limit: int = 100) -> List[InventoryUsageLog]:
        """품목 사용 이력 조회"""
        return db.query(InventoryUsageLog).filter(
            and_(
                InventoryUsageLog.unified_inventory_id == item_id,
                InventoryUsageLog.is_active == True
            )
        ).order_by(InventoryUsageLog.usage_date.desc()).offset(skip).limit(limit).all()
    
    def count_usage_logs(self, db: Session, *, item_id: int) -> int:
        """품목 사용 이력 개수"""
        return db.query(func.count(InventoryUsageLog.id)).filter(
            and_(
                InventoryUsageLog.unified_inventory_id == item_id,
                InventoryUsageLog.is_active == True
            )
        ).scalar()
    
    def create_usage_log(self, db: Session, *, obj_in: InventoryUsageLogCreate) -> InventoryUsageLog:
        """사용 이력 생성"""
        obj_in_data = obj_in.dict()
        obj_in_data['usage_date'] = datetime.now()
        obj_in_data['is_active'] = True
        
        db_obj = InventoryUsageLog(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def upload_image(self, db: Session, *, file, image_data: InventoryImageCreate) -> InventoryImage:
        """이미지 업로드"""
        import os
        import uuid
        from PIL import Image
        
        # 파일 저장 경로 설정
        upload_dir = "uploads/inventory_images"
        os.makedirs(upload_dir, exist_ok=True)
        
        # 고유 파일명 생성
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # 파일 저장
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
        
        # 썸네일 생성
        thumbnail_path = None
        try:
            with Image.open(file_path) as img:
                img.thumbnail((200, 200), Image.Resampling.LANCZOS)
                thumbnail_filename = f"thumb_{unique_filename}"
                thumbnail_path = os.path.join(upload_dir, thumbnail_filename)
                img.save(thumbnail_path)
        except Exception as e:
            print(f"썸네일 생성 실패: {e}")
        
        # 이미지 정보 저장
        image_obj = InventoryImage(
            unified_inventory_id=image_data.unified_inventory_id,
            filename=unique_filename,
            original_filename=file.filename,
            file_path=file_path,
            file_size=file.size,
            mime_type=file.content_type,
            image_type=image_data.image_type,
            description=image_data.description,
            thumbnail_path=thumbnail_path,
            is_active=True,
            uploaded_at=datetime.now()
        )
        
        db.add(image_obj)
        
        # 메인 이미지 설정 (첫 번째 이미지인 경우)
        inventory = self.get(db=db, id=image_data.unified_inventory_id)
        if inventory and not inventory.main_image_url:
            inventory.main_image_url = file_path
            inventory.image_urls = [file_path]
        elif inventory:
            if inventory.image_urls is None:
                inventory.image_urls = []
            inventory.image_urls.append(file_path)
        
        db.commit()
        db.refresh(image_obj)
        return image_obj
    
    def delete_image(self, db: Session, *, image_id: int, item_id: int) -> bool:
        """이미지 삭제"""
        image = db.query(InventoryImage).filter(
            and_(
                InventoryImage.id == image_id,
                InventoryImage.unified_inventory_id == item_id
            )
        ).first()
        
        if not image:
            return False
        
        # 파일 삭제
        try:
            if os.path.exists(image.file_path):
                os.remove(image.file_path)
            if image.thumbnail_path and os.path.exists(image.thumbnail_path):
                os.remove(image.thumbnail_path)
        except Exception as e:
            print(f"파일 삭제 실패: {e}")
        
        # DB에서 삭제
        db.delete(image)
        
        # 품목의 이미지 URL 업데이트
        inventory = self.get(db=db, id=item_id)
        if inventory:
            if inventory.main_image_url == image.file_path:
                # 메인 이미지였다면 다른 이미지로 교체
                remaining_images = db.query(InventoryImage).filter(
                    and_(
                        InventoryImage.unified_inventory_id == item_id,
                        InventoryImage.id != image_id
                    )
                ).first()
                inventory.main_image_url = remaining_images.file_path if remaining_images else None
            
            if inventory.image_urls and image.file_path in inventory.image_urls:
                inventory.image_urls.remove(image.file_path)
        
        db.commit()
        return True
    
    def get_dashboard_data(self, db: Session) -> Dict[str, Any]:
        """대시보드 데이터 조회"""
        stats = self.get_inventory_stats(db)
        
        # 월별 수령 현황 (최근 12개월)
        monthly_receipts = []
        for i in range(12):
            month_start = datetime.now().replace(day=1) - timedelta(days=30*i)
            month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
            
            count = db.query(func.count(UnifiedInventory.id)).filter(
                and_(
                    UnifiedInventory.last_received_date >= month_start,
                    UnifiedInventory.last_received_date <= month_end,
                    UnifiedInventory.is_active == True
                )
            ).scalar() or 0
            
            monthly_receipts.append({
                "month": month_start.strftime("%Y-%m"),
                "count": count
            })
        
        # 상위 사용 품목
        top_usage_items = db.query(
            UnifiedInventory.item_name,
            func.count(InventoryUsageLog.id).label('usage_count'),
            func.sum(InventoryUsageLog.quantity).label('total_quantity')
        ).join(
            InventoryUsageLog, 
            UnifiedInventory.id == InventoryUsageLog.unified_inventory_id
        ).filter(
            InventoryUsageLog.usage_date >= datetime.now() - timedelta(days=30)
        ).group_by(
            UnifiedInventory.item_name
        ).order_by(
            func.count(InventoryUsageLog.id).desc()
        ).limit(10).all()
        
        # 알림 생성
        alerts = []
        
        # 재고 부족 알림
        if stats.low_stock_items > 0:
            alerts.append({
                "type": "warning",
                "message": f"{stats.low_stock_items}개 품목의 재고가 부족합니다.",
                "priority": "high"
            })
        
        # 재고 없음 알림
        if stats.out_of_stock_items > 0:
            alerts.append({
                "type": "error",
                "message": f"{stats.out_of_stock_items}개 품목의 재고가 없습니다.",
                "priority": "critical"
            })
        
        # 승인 대기 알림
        if stats.pending_approvals > 0:
            alerts.append({
                "type": "info",
                "message": f"{stats.pending_approvals}건의 승인 대기 요청이 있습니다.",
                "priority": "medium"
            })
        
        # 추천사항
        recommendations = []
        if stats.low_stock_items > 0:
            recommendations.append("재고 부족 품목에 대한 주문을 검토하세요.")
        if stats.overstocked_items > 0:
            recommendations.append("과잉 재고 품목의 사용을 촉진하세요.")
        if stats.average_utilization < 50:
            recommendations.append("재고 회전율을 개선하기 위한 정책을 검토하세요.")
        
        return {
            "total_items": stats.total_items,
            "total_value": stats.total_value,
            "low_stock_alerts": stats.low_stock_items,
            "recent_receipts": stats.recent_receipts,
            "category_chart": stats.category_distribution,
            "stock_status_chart": [
                {"status": "정상", "count": stats.status_distribution["normal"], "percentage": 0},
                {"status": "부족", "count": stats.status_distribution["low_stock"], "percentage": 0},
                {"status": "없음", "count": stats.status_distribution["out_of_stock"], "percentage": 0},
                {"status": "과잉", "count": stats.status_distribution["overstocked"], "percentage": 0}
            ],
            "monthly_receipts": monthly_receipts,
            "top_usage_items": [
                {
                    "item_name": item.item_name,
                    "usage_count": item.usage_count,
                    "total_quantity": int(item.total_quantity or 0)
                }
                for item in top_usage_items
            ],
            "alerts": alerts,
            "recommendations": recommendations
        }
    
    def get_alerts(self, db: Session, *, alert_type: Optional[str] = None, priority: Optional[str] = None) -> List[Dict[str, Any]]:
        """재고 관련 알림 조회"""
        alerts = []
        
        # 재고 부족 알림
        low_stock_items = self.get_low_stock_items(db, limit=50)
        for item in low_stock_items:
            if not alert_type or alert_type == "low_stock":
                alerts.append({
                    "type": "low_stock",
                    "priority": "high" if item.current_quantity == 0 else "medium",
                    "message": f"{item.item_name} - 재고 부족 (현재: {item.current_quantity}, 최소: {item.minimum_stock})",
                    "item_id": item.id,
                    "created_at": datetime.now().isoformat()
                })
        
        # 만료 예정 알림 (수령일로부터 1년 경과)
        old_items = db.query(UnifiedInventory).filter(
            and_(
                UnifiedInventory.last_received_date < datetime.now() - timedelta(days=365),
                UnifiedInventory.is_active == True,
                UnifiedInventory.current_quantity > 0
            )
        ).limit(20).all()
        
        for item in old_items:
            if not alert_type or alert_type == "expiry":
                alerts.append({
                    "type": "expiry",
                    "priority": "low",
                    "message": f"{item.item_name} - 오래된 재고 확인 필요 (마지막 수령: {item.last_received_date.strftime('%Y-%m-%d') if item.last_received_date else '미상'})",
                    "item_id": item.id,
                    "created_at": datetime.now().isoformat()
                })
        
        # 우선순위 필터링
        if priority:
            alerts = [alert for alert in alerts if alert["priority"] == priority]
        
        return sorted(alerts, key=lambda x: {"critical": 4, "high": 3, "medium": 2, "low": 1}[x["priority"]], reverse=True)
    
    def get_recommendations(self, db: Session) -> List[str]:
        """재고 관리 추천사항"""
        recommendations = []
        stats = self.get_inventory_stats(db)
        
        if stats.low_stock_items > 0:
            recommendations.append(f"{stats.low_stock_items}개 품목의 재고가 부족합니다. 주문을 검토하세요.")
        
        if stats.out_of_stock_items > 0:
            recommendations.append(f"{stats.out_of_stock_items}개 품목의 재고가 없습니다. 긴급 주문이 필요합니다.")
        
        if stats.overstocked_items > 0:
            recommendations.append(f"{stats.overstocked_items}개 품목이 과잉 재고 상태입니다. 사용을 촉진하거나 재고 한도를 조정하세요.")
        
        if stats.average_utilization < 30:
            recommendations.append("전체 재고 사용률이 낮습니다. 불필요한 재고를 정리하고 주문 정책을 검토하세요.")
        
        if stats.total_items == 0:
            recommendations.append("등록된 품목이 없습니다. 품목을 등록하여 재고 관리를 시작하세요.")
        
        return recommendations

# 인스턴스 생성
inventory = CRUDInventory(UnifiedInventory)