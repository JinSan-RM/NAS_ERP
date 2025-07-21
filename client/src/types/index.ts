// client/src/types/index.ts

// 공통 타입들
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface SearchFilters {
  search?: string;
  status?: string;
  category?: string;
  department?: string;
  supplier?: string;
  urgency?: string;
  dateFrom?: string;
  dateTo?: string;
  is_active?: boolean;
  min_budget?: number;
  max_budget?: number;
  requester_name?: string;
}

// 테이블 관련 타입
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T) => React.ReactNode;
}

// 모달 관련 타입
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

// 구매 요청 관련 타입들
export type RequestStatus = 'draft' | 'submitted' | 'pending_approval' | 'approved' | 'rejected' | 'cancelled';
export type UrgencyLevel = 'low' | 'normal' | 'high' | 'urgent';
export type PurchaseMethod = 'direct' | 'quotation' | 'contract' | 'framework' | 'marketplace';
export type ItemCategory = 'office_supplies' | 'electronics' | 'furniture' | 'software' | 'equipment' | 'consumables' | 'services' | 'others';

export interface PurchaseRequest {
  id: number;
  request_number: string;
  
  // 품목 정보
  item_name: string;
  specifications?: string;
  quantity: number;
  unit: string;
  estimated_price?: number;
  total_budget?: number;
  
  // 공급업체 정보
  preferred_supplier?: string;
  supplier_contact?: string;
  
  // 분류 정보
  category?: string;
  urgency: UrgencyLevel;
  purchase_method: PurchaseMethod;
  
  // 요청자 정보
  requester_name: string;
  requester_email?: string;
  department: string;
  phone_number?: string;
  
  // 프로젝트 및 예산 정보
  project?: string;
  budget_code?: string;
  cost_center?: string;
  
  // 일정 정보
  expected_delivery_date?: string;
  requested_delivery_date?: string;
  
  // 사유 및 설명
  justification: string;
  business_purpose?: string;
  additional_notes?: string;
  
  // 상태 관리
  status: RequestStatus;
  priority_score: number;
  
  // 승인 정보
  approver_name?: string;
  approver_email?: string;
  approval_date?: string;
  approval_comments?: string;
  rejection_reason?: string;
  
  // 시스템 필드
  is_active: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface PurchaseRequestFormData {
  item_name: string;
  specifications?: string;
  quantity: number;
  unit?: string;
  estimated_price?: number;
  preferred_supplier?: string;
  supplier_contact?: string;
  category?: string;
  urgency: UrgencyLevel;
  purchase_method: PurchaseMethod;
  requester_name: string;
  requester_email?: string;
  department: string;
  phone_number?: string;
  project?: string;
  budget_code?: string;
  cost_center?: string;
  expected_delivery_date?: string;
  requested_delivery_date?: string;
  justification: string;
  business_purpose?: string;
  additional_notes?: string;
}

export interface PurchaseRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: number;
  totalBudget: number;
  averageProcessingTime?: number;
}

// 재고 관리 관련 타입들
export interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category?: string;
  description?: string;
  unit?: string;
  current_stock: number;
  min_stock: number;
  max_stock?: number;
  unit_price?: number;
  supplier?: string;
  location?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Receipt {
  id: number;
  receiptNumber: string;
  itemName: string;
  receivedQuantity: number;
  expectedQuantity: number;
  receiverName: string;
  department: string;
  receivedDate: string;
}

// 상태 및 긴급도 라벨
export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: '임시저장',
  submitted: '제출됨',
  pending_approval: '승인대기',
  approved: '승인됨',
  rejected: '거절됨',
  cancelled: '취소됨'
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  low: '낮음',
  normal: '보통',
  high: '높음',
  urgent: '긴급'
};

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  office_supplies: '사무용품',
  electronics: '전자기기',
  furniture: '가구',
  software: '소프트웨어',
  equipment: '장비',
  consumables: '소모품',
  services: '서비스',
  others: '기타'
};

export const PURCHASE_METHOD_LABELS: Record<PurchaseMethod, string> = {
  direct: '직접구매',
  quotation: '견적요청',
  contract: '계약',
  framework: '단가계약',
  marketplace: '마켓플레이스'
};

// 상태별 색상
export const STATUS_COLORS: Record<RequestStatus, string> = {
  draft: '#6b7280',
  submitted: '#3b82f6',
  pending_approval: '#f59e0b',
  approved: '#10b981',
  rejected: '#ef4444',
  cancelled: '#6b7280'
};

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  low: '#10b981',
  normal: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444'
};

// 승인 요청 타입
export interface ApprovalRequest {
  action: 'approve' | 'reject';
  comments?: string;
  approver_name?: string;
  approver_email?: string;
}