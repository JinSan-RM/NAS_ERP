# server/app/crud/purchase_request.py
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_, extract

from app.crud.base import CRUDBase
from app.enums import RequestStatus, UrgencyLevel, ItemCategory, PurchaseMethod  # 공유 Enum 사용
from app.models.purchase_request import PurchaseRequest
from app.schemas.purchase_request import (
    PurchaseRequestCreate, 
    PurchaseRequestUpdate, 
    PurchaseRequestFilter
)

class CRUDPurchaseRequest(CRUDBase[PurchaseRequest, PurchaseRequestCreate, PurchaseRequestUpdate]):
    
    def create(self, db: Session, *, obj_in: PurchaseRequestCreate) -> PurchaseRequest:
        """새 구매 요청 생성"""
        # 딕셔너리로 변환
        obj_in_data = obj_in.dict()
        
        # 총 예산 계산
        if obj_in_data.get('estimated_unit_price') and obj_in_data.get('quantity'):
            obj_in_data['total_budget'] = obj_in_data['estimated_unit_price'] * obj_in_data['quantity']
        
        # 시스템 필드 설정
        obj_in_data['created_at'] = datetime.now()
        obj_in_data['is_active'] = True
        
        # 데이터베이스 객체 생성
        db_obj = self.model(**obj_in_data)
        db.add(db_obj)
        db.flush()  # ID를 얻기 위해 flush
        
        # 요청 번호 생성
        db_obj.request_number = db_obj.generate_request_number()
        
        # 우선순위 점수 계산
        # db_obj.calculate_priority_score()
        
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self,
        db: Session,
        *,
        db_obj: PurchaseRequest,
        obj_in: PurchaseRequestUpdate
    ) -> PurchaseRequest:
        """구매 요청 업데이트 - 개선된 버전"""
        try:
            obj_data = obj_in.dict(exclude_unset=True)
            
            # 가격이나 수량이 변경되면 총 예산 재계산
            if 'estimated_unit_price' in obj_data or 'quantity' in obj_data:
                estimated_unit_price = obj_data.get('estimated_unit_price', db_obj.estimated_unit_price)
                quantity = obj_data.get('quantity', db_obj.quantity)
                if estimated_unit_price and quantity:
                    obj_data['total_budget'] = estimated_unit_price * quantity
            
            # updated_at 자동 설정
            obj_data['updated_at'] = datetime.now()
            
            # 필드 업데이트
            for field, value in obj_data.items():
                if hasattr(db_obj, field):
                    setattr(db_obj, field, value)
            
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
            return db_obj
            
        except Exception as e:
            db.rollback()
            raise e
    
    def get_by_request_number(self, db: Session, *, request_number: str) -> Optional[PurchaseRequest]:
        """요청 번호로 구매 요청 조회"""
        return db.query(self.model).filter(
            PurchaseRequest.request_number == request_number
        ).first()
    
    def get_multi_with_filter(
        self, 
        db: Session, 
        *, 
        skip: int = 0, 
        limit: int = 100,
        filters  # 이 파라미터 추가
    ) -> List[PurchaseRequest]:
        """필터를 적용하여 구매 요청 목록 조회"""
        
        query = db.query(self.model)
        
        # filters 객체가 있다면 필터 적용 (실제 DB 컬럼에 맞게)
        if filters:
            if hasattr(filters, 'search') and filters.search:
                query = query.filter(
                    or_(
                        PurchaseRequest.item_name.ilike(f"%{filters.search}%"),
                        PurchaseRequest.requester_name.ilike(f"%{filters.search}%")
                    )
                )
            if hasattr(filters, 'category') and filters.category:
                query = query.filter(PurchaseRequest.category == filters.category)
            if hasattr(filters, 'urgency') and filters.urgency:
                query = query.filter(PurchaseRequest.urgency == filters.urgency)
            if hasattr(filters, 'department') and filters.department:
                query = query.filter(PurchaseRequest.department == filters.department)
            if hasattr(filters, 'requester_name') and filters.requester_name:
                query = query.filter(PurchaseRequest.requester_name.ilike(f"%{filters.requester_name}%"))
            if hasattr(filters, 'min_budget') and filters.min_budget:
                query = query.filter(PurchaseRequest.total_budget >= filters.min_budget)
            if hasattr(filters, 'max_budget') and filters.max_budget:
                query = query.filter(PurchaseRequest.total_budget <= filters.max_budget)
        
        return query.order_by(PurchaseRequest.id.desc()).offset(skip).limit(limit).all()

    
    def count_with_filter(self, db: Session, *, filters) -> int:
        """필터를 적용하여 총 개수 조회"""
        
        query = db.query(func.count(self.model.id))
        
        # 위와 동일한 필터 로직 적용
        if filters:
            if hasattr(filters, 'search') and filters.search:
                query = query.filter(
                    or_(
                        PurchaseRequest.item_name.ilike(f"%{filters.search}%"),
                        PurchaseRequest.requester_name.ilike(f"%{filters.search}%")
                    )
                )
            if hasattr(filters, 'category') and filters.category:
                query = query.filter(PurchaseRequest.category == filters.category)
            if hasattr(filters, 'urgency') and filters.urgency:
                query = query.filter(PurchaseRequest.urgency == filters.urgency)
            if hasattr(filters, 'department') and filters.department:
                query = query.filter(PurchaseRequest.department == filters.department)
            if hasattr(filters, 'requester_name') and filters.requester_name:
                query = query.filter(PurchaseRequest.requester_name.ilike(f"%{filters.requester_name}%"))
            if hasattr(filters, 'min_budget') and filters.min_budget:
                query = query.filter(PurchaseRequest.total_budget >= filters.min_budget)
            if hasattr(filters, 'max_budget') and filters.max_budget:
                query = query.filter(PurchaseRequest.total_budget <= filters.max_budget)
        
        return query.scalar()
    
    def get_by_status(self, db: Session, *, status: RequestStatus, limit: int = 100) -> List[PurchaseRequest]:
        """상태별 구매 요청 조회"""
        return db.query(self.model).filter(
            and_(
                PurchaseRequest.status == status,
                PurchaseRequest.is_active == True
            )
        ).order_by(PurchaseRequest.created_at.desc()).limit(limit).all()
    
    
    def get_urgent_requests(self, db: Session, *, limit: int = 50) -> List[PurchaseRequest]:
        """긴급 요청들 조회"""
        return db.query(self.model).filter(
            and_(
                PurchaseRequest.urgency == UrgencyLevel.URGENT,
                PurchaseRequest.status.in_([
                    RequestStatus.SUBMITTED,
                    RequestStatus.APPROVED
                ]),
                PurchaseRequest.is_active == True
            )
        ).order_by(PurchaseRequest.created_at.desc()).limit(limit).all()
    
    def get_stats(self, db: Session) -> Dict[str, Any]:
        """구매 요청 통계 조회"""
        
        total = db.query(func.count(self.model.id)).scalar()
        total_budget = db.query(func.sum(self.model.total_budget)).scalar() or 0
        
        return {
            "total": total or 0,
            "pending": 0,
            "approved": 0,
            "rejected": 0,
            "completed": 0,  # 🔥 이 필드 추가!
            "this_month": 0,
            "total_budget": float(total_budget),
            "average_approval_time": None
        }
        
    def approve_request(
        self,
        db: Session,
        *,
        request_id: int,
        approver_name: str,
        approver_email: Optional[str] = None,
        comments: Optional[str] = None
    ) -> Optional[PurchaseRequest]:
        """구매 요청 승인"""
        db_obj = self.get(db, id=request_id)
        if not db_obj:
            return None
        
        db_obj.status = RequestStatus.APPROVED
        db_obj.approver_name = approver_name
        db_obj.approver_email = approver_email
        db_obj.approval_date = datetime.now()
        db_obj.approval_comments = comments
        db_obj.updated_at = datetime.now()
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def reject_request(
        self,
        db: Session,
        *,
        request_id: int,
        approver_name: str,
        approver_email: Optional[str] = None,
        reason: Optional[str] = None
    ) -> Optional[PurchaseRequest]:
        """구매 요청 거절"""
        db_obj = self.get(db, id=request_id)
        if not db_obj:
            return None
        
        db_obj.status = RequestStatus.REJECTED
        db_obj.approver_name = approver_name
        db_obj.approver_email = approver_email
        db_obj.approval_date = datetime.now()
        db_obj.rejection_reason = reason
        db_obj.updated_at = datetime.now()
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_categories(self, db: Session) -> List[str]:
        """카테고리 목록 조회"""
        result = db.query(PurchaseRequest.category).distinct().filter(
            and_(
                PurchaseRequest.category.isnot(None),
                PurchaseRequest.is_active == True
            )
        ).all()
        return [category[0] for category in result if category[0]]
    
    def get_departments(self, db: Session) -> List[str]:
        """부서 목록 조회"""
        result = db.query(PurchaseRequest.department).distinct().filter(
            and_(
                PurchaseRequest.department.isnot(None),
                PurchaseRequest.is_active == True
            )
        ).all()
        return [dept[0] for dept in result if dept[0]]
    
    def get_suppliers(self, db: Session) -> List[str]:
        """공급업체 목록 조회"""
        result = db.query(PurchaseRequest.preferred_supplier).distinct().filter(
            and_(
                PurchaseRequest.preferred_supplier.isnot(None),
                PurchaseRequest.is_active == True
            )
        ).all()
        return [supplier[0] for supplier in result if supplier[0]]
    
    def bulk_create(self, db: Session, *, items: List[PurchaseRequestCreate]) -> List[PurchaseRequest]:
        """대량 구매 요청 생성"""
        db_objects = []
        
        for item_data in items:
            obj_in_data = item_data.dict()
            
            # 총 예산 계산
            if obj_in_data.get('estimated_unit_price') and obj_in_data.get('quantity'):
                obj_in_data['total_budget'] = obj_in_data['estimated_unit_price'] * obj_in_data['quantity']
            
            # 시스템 필드 설정
            obj_in_data['created_at'] = datetime.now()
            obj_in_data['is_active'] = True
            
            db_obj = self.model(**obj_in_data)
            db_objects.append(db_obj)
        
        # 모든 객체를 데이터베이스에 추가
        db.add_all(db_objects)
        db.flush()
        
        # 각 객체에 대해 요청 번호 생성 및 우선순위 계산
        for db_obj in db_objects:
            db_obj.request_number = db_obj.generate_request_number()
            # db_obj.calculate_priority_score()
        
        db.commit()
        
        # 모든 객체 새로고침
        for db_obj in db_objects:
            db.refresh(db_obj)
        
        return db_objects
    
    def soft_delete(self, db: Session, *, id: int) -> Optional[PurchaseRequest]:
        """구매 요청 소프트 삭제"""
        db_obj = self.get(db, id=id)
        if db_obj:
            db_obj.is_active = False
            db_obj.updated_at = datetime.now()
            db.add(db_obj)
            db.commit()
            db.refresh(db_obj)
        return db_obj
    
    def get_recent_requests(self, db: Session, *, days: int = 7, limit: int = 50) -> List[PurchaseRequest]:
        """최근 구매 요청들 조회"""
        since_date = datetime.now() - timedelta(days=days)
        return db.query(self.model).filter(
            and_(
                PurchaseRequest.created_at >= since_date,
                PurchaseRequest.is_active == True
            )
        ).order_by(PurchaseRequest.created_at.desc()).limit(limit).all()
    
    def get_high_value_requests(self, db: Session, *, min_amount: float = 1000000, limit: int = 50) -> List[PurchaseRequest]:
        """고액 구매 요청들 조회"""
        return db.query(self.model).filter(
            and_(
                PurchaseRequest.total_budget >= min_amount,
                PurchaseRequest.is_active == True
            )
        ).order_by(PurchaseRequest.total_budget.desc()).limit(limit).all()

    def complete_purchase(
        self,
        db: Session,
        *,
        request_id: int,
        completion_data: dict
    ) -> Optional[PurchaseRequest]:
        """구매 요청 완료 처리"""
        purchase_request = self.get(db=db, id=request_id)
        if not purchase_request:
            return None
            
        if purchase_request.status != RequestStatus.APPROVED:
            raise ValueError("승인된 구매 요청만 완료 처리할 수 있습니다.")
        
        # 상태 업데이트
        purchase_request.status = RequestStatus.COMPLETED
        purchase_request.completed_date = completion_data.get('completed_date', datetime.now())
        purchase_request.completed_by = completion_data.get('completed_by', 'system')
        purchase_request.completion_notes = completion_data.get('notes')
        purchase_request.inventory_item_id = completion_data.get('inventory_item_id')
        purchase_request.updated_at = datetime.now()
        
        db.add(purchase_request)
        db.commit()
        db.refresh(purchase_request)
        
        return purchase_request
    def get_completed_requests(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[PurchaseRequest]:
        """완료된 구매 요청들 조회"""
        return db.query(self.model).filter(
            and_(
                PurchaseRequest.status == RequestStatus.COMPLETED,
                PurchaseRequest.is_active == True
            )
        ).order_by(PurchaseRequest.completed_date.desc()).offset(skip).limit(limit).all()

    def get_active_requests_only(self, db: Session, *, skip: int = 0, limit: int = 100) -> List[PurchaseRequest]:
        """완료되지 않은 활성 구매 요청들만 조회"""
        return db.query(self.model).filter(
            and_(
                PurchaseRequest.status.in_([
                    RequestStatus.SUBMITTED, 
                    RequestStatus.PENDING_APPROVAL,
                    RequestStatus.APPROVED
                ]),
                PurchaseRequest.is_active == True
            )
        ).order_by(PurchaseRequest.created_at.desc()).offset(skip).limit(limit).all()
        
# 인스턴스 생성
purchase_request = CRUDPurchaseRequest(PurchaseRequest)