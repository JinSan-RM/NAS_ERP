# server/app/crud/receipt.py
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_, extract

from app.crud.base import CRUDBase
from app.models.receipt import Receipt, ReceiptCondition
from app.schemas.receipt import ReceiptCreate, ReceiptUpdate, ReceiptFilter

class CRUDReceipt(CRUDBase[Receipt, ReceiptCreate, ReceiptUpdate]):
    
    def create(self, db: Session, *, obj_in: ReceiptCreate) -> Receipt:
        """새 수령 내역 생성"""
        # 딕셔너리로 변환
        obj_in_data = obj_in.dict()
        
        # 시스템 필드 설정
        obj_in_data['created_at'] = datetime.now()
        obj_in_data['is_active'] = True
        
        # 완전 수령 여부 자동 계산
        if obj_in_data.get('received_quantity', 0) >= obj_in_data.get('expected_quantity', 1):
            obj_in_data['is_complete'] = True
        
        # 데이터베이스 객체 생성
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.flush()  # ID를 얻기 위해 flush
        
        # 수령 번호 생성
        db_obj.receipt_number = db_obj.generate_receipt_number()
        
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self,
        db: Session,
        *,
        db_obj: Receipt,
        obj_in: ReceiptUpdate
    ) -> Receipt:
        """수령 내역 업데이트"""
        obj_data = obj_in.dict(exclude_unset=True)
        
        # 완전 수령 여부 재계산
        if 'received_quantity' in obj_data or 'expected_quantity' in obj_data:
            received_qty = obj_data.get('received_quantity', db_obj.received_quantity)
            expected_qty = obj_data.get('expected_quantity', db_obj.expected_quantity)
            obj_data['is_complete'] = received_qty >= expected_qty
        
        # 시스템 필드 업데이트
        obj_data['updated_at'] = datetime.now()
        
        # 업데이트 실행
        for field in obj_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, obj_data[field])
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_by_receipt_number(self, db: Session, *, receipt_number: str) -> Optional[Receipt]:
        """수령 번호로 수령 내역 조회"""
        return db.query(self.model).filter(
            Receipt.receipt_number == receipt_number
        ).first()
    
    def get_multi_with_filter(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[ReceiptFilter] = None
    ) -> List[Receipt]:
        """필터링된 수령 내역 목록 조회"""
        query = db.query(self.model).filter(Receipt.is_active == True)
        
        if filters:
            # 텍스트 검색
            if filters.search:
                query = query.filter(
                    or_(
                        Receipt.item_name.contains(filters.search),
                        Receipt.receipt_number.contains(filters.search),
                        Receipt.receiver_name.contains(filters.search),
                        Receipt.item_code.contains(filters.search)
                    )
                )
            
            # 수령자 필터
            if filters.receiver_name:
                query = query.filter(Receipt.receiver_name.contains(filters.receiver_name))
            
            # 부서 필터
            if filters.department:
                query = query.filter(Receipt.department.contains(filters.department))
            
            # 공급업체 필터
            if filters.supplier_name:
                query = query.filter(Receipt.supplier_name.contains(filters.supplier_name))
            
            # 상태 필터
            if filters.condition:
                query = query.filter(Receipt.condition == filters.condition)
            
            # 완료 여부 필터
            if filters.is_complete is not None:
                query = query.filter(Receipt.is_complete == filters.is_complete)
            
            # 품질 검사 통과 여부 필터
            if filters.quality_check_passed is not None:
                query = query.filter(Receipt.quality_check_passed == filters.quality_check_passed)
            
            # 날짜 범위 필터
            if filters.date_from:
                query = query.filter(Receipt.received_date >= filters.date_from)
            if filters.date_to:
                # 종료일은 해당 날짜의 끝까지 포함
                end_date = filters.date_to.replace(hour=23, minute=59, second=59)
                query = query.filter(Receipt.received_date <= end_date)
            
            # 구매 요청 ID 필터
            if filters.purchase_request_id:
                query = query.filter(Receipt.purchase_request_id == filters.purchase_request_id)
        
        # 정렬: 수령일 내림차순
        query = query.order_by(Receipt.received_date.desc())
        
        return query.offset(skip).limit(limit).all()
    
    def count_with_filter(
        self,
        db: Session,
        *,
        filters: Optional[ReceiptFilter] = None
    ) -> int:
        """필터링된 수령 내역 총 개수"""
        query = db.query(func.count(self.model.id)).filter(Receipt.is_active == True)
        
        if filters:
            if filters.search:
                query = query.filter(
                    or_(
                        Receipt.item_name.contains(filters.search),
                        Receipt.receipt_number.contains(filters.search),
                        Receipt.receiver_name.contains(filters.search),
                        Receipt.item_code.contains(filters.search)
                    )
                )
            
            if filters.receiver_name:
                query = query.filter(Receipt.receiver_name.contains(filters.receiver_name))
            
            if filters.department:
                query = query.filter(Receipt.department.contains(filters.department))
            
            if filters.supplier_name:
                query = query.filter(Receipt.supplier_name.contains(filters.supplier_name))
            
            if filters.condition:
                query = query.filter(Receipt.condition == filters.condition)
            
            if filters.is_complete is not None:
                query = query.filter(Receipt.is_complete == filters.is_complete)
            
            if filters.quality_check_passed is not None:
                query = query.filter(Receipt.quality_check_passed == filters.quality_check_passed)
            
            if filters.date_from:
                query = query.filter(Receipt.received_date >= filters.date_from)
            if filters.date_to:
                end_date = filters.date_to.replace(hour=23, minute=59, second=59)
                query = query.filter(Receipt.received_date <= end_date)
            
            if filters.purchase_request_id:
                query = query.filter(Receipt.purchase_request_id == filters.purchase_request_id)
        
        return query.scalar()
    
    def get_stats(self, db: Session) -> Dict[str, Any]:
        """수령 내역 통계 조회"""
        # 전체 수령 건수
        total_receipts = db.query(func.count(self.model.id)).filter(
            Receipt.is_active == True
        ).scalar()
        
        # 전체 수령 품목 수량
        total_items_received = db.query(func.sum(self.model.received_quantity)).filter(
            Receipt.is_active == True
        ).scalar() or 0
        
        # 전체 예상 품목 수량
        total_items_expected = db.query(func.sum(self.model.expected_quantity)).filter(
            Receipt.is_active == True
        ).scalar() or 0
        
        # 완료율 계산
        completion_rate = (total_items_received / total_items_expected * 100) if total_items_expected > 0 else 0
        
        # 부분 수령 건수
        partial_receipts = db.query(func.count(self.model.id)).filter(
            and_(
                Receipt.received_quantity < Receipt.expected_quantity,
                Receipt.is_active == True
            )
        ).scalar()
        
        # 초과 수령 건수
        over_receipts = db.query(func.count(self.model.id)).filter(
            and_(
                Receipt.received_quantity > Receipt.expected_quantity,
                Receipt.is_active == True
            )
        ).scalar()
        
        # 품질 이슈 건수
        quality_issues = db.query(func.count(self.model.id)).filter(
            and_(
                Receipt.quality_check_passed == False,
                Receipt.is_active == True
            )
        ).scalar()
        
        # 최근 7일 수령 건수
        recent_date = datetime.now() - timedelta(days=7)
        recent_receipts = db.query(func.count(self.model.id)).filter(
            and_(
                Receipt.received_date >= recent_date,
                Receipt.is_active == True
            )
        ).scalar()
        
        return {
            "total_receipts": total_receipts or 0,
            "total_items_received": int(total_items_received),
            "total_items_expected": int(total_items_expected),
            "completion_rate": round(completion_rate, 2),
            "partial_receipts": partial_receipts or 0,
            "over_receipts": over_receipts or 0,
            "quality_issues": quality_issues or 0,
            "recent_receipts": recent_receipts or 0
        }
    
    def get_by_purchase_request(self, db: Session, *, purchase_request_id: int) -> List[Receipt]:
        """구매 요청별 수령 내역 조회"""
        return db.query(self.model).filter(
            and_(
                Receipt.purchase_request_id == purchase_request_id,
                Receipt.is_active == True
            )
        ).order_by(Receipt.received_date.desc()).all()
    
    def get_recent_receipts(self, db: Session, *, days: int = 7, limit: int = 50) -> List[Receipt]:
        """최근 수령 내역 조회"""
        since_date = datetime.now() - timedelta(days=days)
        return db.query(self.model).filter(
            and_(
                Receipt.received_date >= since_date,
                Receipt.is_active == True
            )
        ).order_by(Receipt.received_date.desc()).limit(limit).all()
    
    def get_incomplete_receipts(self, db: Session, *, limit: int = 100) -> List[Receipt]:
        """미완료 수령 내역 조회"""
        return db.query(self.model).filter(
            and_(
                Receipt.is_complete == False,
                Receipt.is_active == True
            )
        ).order_by(Receipt.received_date.desc()).limit(limit).all()
    
    def get_quality_issues(self, db: Session, *, limit: int = 100) -> List[Receipt]:
        """품질 이슈 수령 내역 조회"""
        return db.query(self.model).filter(
            and_(
                Receipt.quality_check_passed == False,
                Receipt.is_active == True
            )
        ).order_by(Receipt.received_date.desc()).limit(limit).all()
    
    def bulk_create(self, db: Session, *, items: List[ReceiptCreate]) -> List[Receipt]:
        """대량 수령 내역 생성"""
        db_objects = []
        
        for item_data in items:
            obj_in_data = item_data.dict()
            
            # 시스템 필드 설정
            obj_in_data['created_at'] = datetime.now()
            obj_in_data['is_active'] = True
            
            # 완전 수령 여부 자동 계산
            if obj_in_data.get('received_quantity', 0) >= obj_in_data.get('expected_quantity', 1):
                obj_in_data['is_complete'] = True
            
            db_obj = self.model(**obj_in_data)
            db_objects.append(db_obj)
        
        # 모든 객체를 데이터베이스에 추가
        db.add_all(db_objects)
        db.flush()
        
        # 각 객체에 대해 수령 번호 생성
        for db_obj in db_objects:
            db_obj.receipt_number = db_obj.generate_receipt_number()
        
        db.commit()
        
        # 모든 객체 새로고침
        for db_obj in db_objects:
            db.refresh(db_obj)
        
        return db_objects
    
    def soft_delete(self, db: Session, *, id: int) -> Optional[Receipt]:
        """수령 내역 소프트 삭제"""
        db_obj = self.get(db, id=id)
        if db_obj:
            db_obj.is_active = False
            db_obj.updated_at = datetime.now()
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj

# 인스턴스 생성
receipt = CRUDReceipt(Receipt)