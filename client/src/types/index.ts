// client/src/types/index.ts

// 기본 타입들
export interface User {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
}

// ENUM 타입들
export type RequestStatus = 
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'cancelled'
  | 'purchased'
  | 'received'
  | 'closed';

export type UrgencyLevel = 'low' | 'normal' | 'high' | 'emergency';

export type ItemCategory = 
  | 'office_supplies'
  | 'it_equipment'
  | 'furniture'
  | 'facility'
  | 'marketing'
  | 'travel'
  | 'training'
  | 'maintenance'
  | 'software'
  | 'service'
  | 'other';

export type PurchaseMethod = 'direct' | 'quotation' | 'contract' | 'framework' | 'marketplace';
export type UserRole = 'employee' | 'team_lead' | 'manager' | 'purchaser' | 'finance' | 'admin';

// 구매 요청 관련 타입들
export interface PurchaseRequest {
  id: number;
  requestNumber: string;
  itemName: string;
  quantity: number;
  unitPrice?: number;
  totalBudget: number;
  specifications?: string;
  purpose?: string;
  requesterName: string;
  department: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  requestDate: string;
  requiredDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  approverName?: string;
  comments?: string;
  attachments?: string[];
  category: ItemCategory;
  preferredSupplier?: string;
  justification?: string;
  project?: string;
  budgetCode?: string;
  expectedDeliveryDate?: string;
  purchaseMethod: PurchaseMethod;
}

// 재고 관련 타입들
export interface InventoryItem {
  id: number;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  minQuantity?: number;
  maxQuantity?: number;
  unitPrice?: number;
  supplier?: string;
  description?: string;
  lastUpdated: string;
}

// 수령 관련 타입들
export interface Receipt {
  id: number;
  receiptNumber: string;
  itemName: string;
  expectedQuantity: number;
  receivedQuantity: number;
  receiverName: string;
  department: string;
  receivedDate: string;
  notes?: string;
}

// 테이블 관련 타입들
export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, item: T) => React.ReactNode;
}

// 검색 필터 타입들
export interface SearchFilters {
  search?: string;
  searchTerm?: string;
  status?: RequestStatus;
  urgency?: UrgencyLevel;
  department?: string;
  dateFrom?: string;
  dateTo?: string;
  category?: ItemCategory;
  location?: string;
}

// 통계 타입들
export interface Statistics {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  thisMonth: number;
  lastMonth: number;
}

// API 응답 타입들
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

// 컴포넌트 Props 타입들
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

// 상수 정의 (한 번만 정의)
export const STATUS_LABELS: Record<RequestStatus, string> = {
  draft: '임시저장',
  submitted: '제출됨',
  pending_approval: '승인대기',
  approved: '승인됨',
  rejected: '거절됨',
  cancelled: '취소됨',
  purchased: '구매완료',
  received: '수령완료',
  closed: '완료'
};

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  low: '낮음',
  normal: '보통',
  high: '높음',
  emergency: '긴급'
};

export const STATUS_COLORS: Record<RequestStatus, string> = {
  draft: '#6B7280',
  submitted: '#3B82F6',
  pending_approval: '#F59E0B',
  approved: '#10B981',
  rejected: '#EF4444',
  cancelled: '#6B7280',
  purchased: '#8B5CF6',
  received: '#059669',
  closed: '#374151'
};

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  low: '#10B981',
  normal: '#3B82F6',
  high: '#F59E0B',
  emergency: '#EF4444'
};

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  office_supplies: '사무용품',
  it_equipment: 'IT장비',
  furniture: '가구',
  facility: '시설관리',
  marketing: '마케팅',
  travel: '출장',
  training: '교육',
  maintenance: '유지보수',
  software: '소프트웨어',
  service: '서비스',
  other: '기타'
};

// 이벤트 핸들러 타입들
export type EventHandler<T = any> = (value: T) => void;
export type SubmitHandler<T = any> = (data: T) => void;

export default {};