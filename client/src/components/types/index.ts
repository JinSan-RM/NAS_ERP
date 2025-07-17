// client/src/types/index.ts
// 기본 엔티티 타입들
export interface InventoryItem {
  no: number;
  itemName: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
  category: ItemCategory;
  urgency: UrgencyLevel;
  notes?: string;
  requestDate?: string;
  purchaseDate?: string;
  deliveryDate?: string;
  received: boolean;
  receivedDate?: string;
  status: ItemStatus;
  returnRefund?: string;
  createdAt: string;
  updatedAt: string;
  department?: string;
  project?: string;
  budgetCode?: string;
  requesterId: string;
  approverId?: string;
  purchaseMethod: PurchaseMethod;
}

export interface PurchaseRequest {
  id: number;
  requestNumber: string;
  itemName: string;
  specifications?: string;
  quantity: number;
  estimatedPrice?: number;
  totalBudget: number;
  preferredSupplier?: string;
  category: ItemCategory;
  urgency: UrgencyLevel;
  justification: string;
  requesterId: string;
  requesterName: string;
  department: string;
  project?: string;
  budgetCode?: string;
  status: RequestStatus;
  currentApprover?: string;
  approvalWorkflow: ApprovalStep[];
  requestDate: string;
  expectedDeliveryDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  purchaseMethod: PurchaseMethod;
  attachments: FileAttachment[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Receipt {
  id: number;
  receiptNumber: string;
  itemNo: number;
  purchaseRequestId?: number;
  itemName: string;
  receivedQuantity: number;
  expectedQuantity: number;
  receiverName: string;
  receiverId: string;
  department: string;
  receiptStatus: ReceiptStatus;
  receivedDate: string;
  expectedDate?: string;
  notes?: string;
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

// ENUM 타입들
export type ItemStatus = 'pending' | 'ordered' | 'shipped' | 'received' | 'cancelled' | 'returned';

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

export type ReceiptStatus = 'pending' | 'partial' | 'complete' | 'damaged' | 'rejected';

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

export type UrgencyLevel = 'low' | 'medium' | 'high' | 'emergency';
export type PurchaseMethod = 'direct' | 'quotation' | 'contract' | 'framework' | 'marketplace';
export type UserRole = 'employee' | 'team_lead' | 'manager' | 'purchaser' | 'finance' | 'admin';

// 중첩된 인터페이스들
export interface ApprovalStep {
  step: number;
  approverRole: UserRole;
  approverId?: string;
  approverName?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  approvedAt?: string;
  comments?: string;
  isRequired: boolean;
}

export interface FileAttachment {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  type: 'quotation' | 'contract' | 'receipt' | 'invoice' | 'photo' | 'document' | 'other';
}

// API 관련 타입들
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
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchFilters {
  search?: string;
  status?: string;
  category?: ItemCategory;
  department?: string;
  project?: string;
  supplier?: string;
  urgency?: UrgencyLevel;
  dateFrom?: string;
  dateTo?: string;
  budgetCode?: string;
  requesterId?: string;
  approverId?: string;
}

// UI 컴포넌트 타입들
export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

// 폼 타입들
export interface PurchaseRequestFormData {
  itemName: string;
  specifications: string;
  quantity: number;
  estimatedPrice: number;
  preferredSupplier: string;
  category: ItemCategory;
  urgency: UrgencyLevel;
  justification: string;
  department: string;
  project?: string;
  budgetCode?: string;
  expectedDeliveryDate?: string;
  purchaseMethod: PurchaseMethod;
  attachments?: File[];
}

// 대시보드 타입들
export interface DashboardStats {
  purchaseRequests: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    thisMonth: number;
    lastMonth: number;
  };
  inventory: {
    totalItems: number;
    receivedItems: number;
    pendingItems: number;
    totalValue: number;
  };
  budget: {
    totalBudget: number;
    usedBudget: number;
    remainingBudget: number;
    utilizationRate: number;
  };
  recentReceipts: Receipt[];
}

// 테마 타입
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    gray: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

// 카테고리 매핑
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
  medium: '보통',
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
  medium: '#F59E0B',
  high: '#F97316',
  emergency: '#EF4444'
};