// client/src/types/index.ts
// 서버와 동일한 타입들을 재사용하되, 클라이언트에 특화된 타입들 추가

// ==================== 기본 엔티티 타입들 ====================
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
  attachments?: FileAttachment[];
  requesterId: string;
  approverId?: string;
  purchaseMethod: PurchaseMethod;
  contractNumber?: string;
  warrantyInfo?: WarrantyInfo;
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
  alternativeSuppliers?: string[];
  category: ItemCategory;
  urgency: UrgencyLevel;
  justification: string;
  
  // 요청자 정보
  requesterId: string;
  requesterName: string;
  department: string;
  project?: string;
  budgetCode?: string;
  
  // 승인 관련
  status: RequestStatus;
  currentApprover?: string;
  approvalWorkflow: ApprovalStep[];
  
  // 날짜 정보
  requestDate: string;
  expectedDeliveryDate?: string;
  approvedDate?: string;
  rejectedDate?: string;
  
  // 구매 정보
  purchaseMethod: PurchaseMethod;
  quotations?: Quotation[];
  selectedQuotation?: string;
  contractInfo?: ContractInfo;
  
  // 파일 첨부
  attachments: FileAttachment[];
  
  // 메타 정보
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
  qualityCheck: QualityCheck;
  receivedDate: string;
  expectedDate?: string;
  notes?: string;
  damageReport?: string;
  returnRequest?: boolean;
  photos?: FileAttachment[];
  documents?: FileAttachment[];
  timestamp: number;
  createdAt: string;
  updatedAt: string;
}

export interface Supplier {
  id: string;
  name: string;
  businessNumber: string;
  representative: string;
  contactInfo: ContactInfo;
  address: Address;
  rating: SupplierRating;
  categories: ItemCategory[];
  paymentTerms: string;
  deliveryTerms: string;
  contracts: Contract[];
  isPreferred: boolean;
  isActive: boolean;
  performance: SupplierPerformance;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  employeeId: string;
  department: string;
  position: string;
  role: UserRole;
  permissions: Permission[];
  approvalLimits: Record<ItemCategory, number>;
  phone?: string;
  extension?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== ENUM 타입들 ====================
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

// ==================== 중첩된 인터페이스들 ====================
export interface ContactInfo {
  primaryContact: string;
  email: string;
  phone: string;
  fax?: string;
  website?: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface SupplierRating {
  overall: number;
  quality: number;
  delivery: number;
  price: number;
  service: number;
  lastUpdated: string;
}

export interface SupplierPerformance {
  totalOrders: number;
  completedOrders: number;
  averageDeliveryTime: number;
  defectRate: number;
  onTimeDeliveryRate: number;
}

export interface Contract {
  id: string;
  number: string;
  name: string;
  startDate: string;
  endDate: string;
  value: number;
  status: 'active' | 'expired' | 'terminated';
  terms: string;
}

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

export interface Quotation {
  id: string;
  supplierId: string;
  supplierName: string;
  quotationNumber: string;
  unitPrice: number;
  totalPrice: number;
  deliveryTime: number;
  validUntil: string;
  terms: string;
  isSelected: boolean;
  attachments: FileAttachment[];
  receivedAt: string;
}

export interface ContractInfo {
  contractId: string;
  contractNumber: string;
  terms: string;
  deliveryTerms: string;
  paymentTerms: string;
  warrantyPeriod?: number;
}

export interface WarrantyInfo {
  period: number;
  type: 'manufacturer' | 'supplier' | 'extended';
  terms: string;
  startDate: string;
  endDate: string;
  contact: string;
}

export interface QualityCheck {
  inspector: string;
  inspectionDate: string;
  passed: boolean;
  issues?: string[];
  notes?: string;
  photos?: FileAttachment[];
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

export interface Permission {
  resource: string;
  actions: string[];
}

// ==================== API 관련 타입들 ====================
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

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// ==================== 폼 관련 타입들 ====================
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

export interface ReceiptFormData {
  itemNo: number;
  receivedQuantity: number;
  receiverName: string;
  receiverId: string;
  department: string;
  qualityPassed: boolean;
  qualityNotes?: string;
  notes?: string;
  damageReport?: string;
  photos?: File[];
}

export interface InventoryFormData {
  itemName: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  supplier: string;
  category: ItemCategory;
  urgency: UrgencyLevel;
  notes?: string;
  deliveryDate?: string;
  department: string;
  project?: string;
  budgetCode?: string;
}

// ==================== UI 컴포넌트 타입들 ====================
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

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'date' | 'file' | 'checkbox';
  required?: boolean;
  options?: SelectOption[];
  validation?: any;
  placeholder?: string;
  description?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}

export interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
  onClose?: () => void;
}

export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

// ==================== 대시보드 타입들 ====================
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
  suppliers: {
    total: number;
    active: number;
    topPerformers: Supplier[];
  };
  recentReceipts: Receipt[];
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
  }>;
}

// ==================== 테마 및 스타일 타입들 ====================
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

// ==================== 상태 관리 타입들 ====================
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  currentPage: string;
  sidebarCollapsed: boolean;
  notifications: Notification[];
}

export interface InventoryState {
  items: InventoryItem[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  selectedItems: number[];
}

export interface PurchaseRequestState {
  requests: PurchaseRequest[];
  loading: boolean;
  error: string | null;
  filters: SearchFilters;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  selectedRequests: number[];
  pendingApprovals: PurchaseRequest[];
}

// ==================== 유틸리티 타입들 ====================
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  badge?: number;
  disabled?: boolean;
}

// ==================== 폼 검증 타입들 ====================
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string[]>;
}

// ==================== 익스포트/리포트 타입들 ====================
export interface ExportOptions {
  format: 'excel' | 'csv' | 'pdf';
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: SearchFilters;
  columns?: string[];
  includeDetails?: boolean;
}

export interface ReportData {
  summary: Record<string, number>;
  details: any[];
  charts: ChartData[];
  exportUrl?: string;
}

// ==================== 카카오톡 메시지 파싱 타입들 ====================
export interface KakaoMessageParsed {
  itemNo?: number;
  itemName?: string;
  quantity?: number;
  receiver?: string;
  notes?: string;
  department?: string;
  rawMessage?: string;
}

export interface MessageParsingResult {
  success: boolean;
  parsed: KakaoMessageParsed;
  confidence: number; // 파싱 신뢰도 (0-1)
  suggestions?: string[]; // 개선 제안
}

// ==================== 고급 검색 타입들 ====================
export interface AdvancedSearchFilters extends SearchFilters {
  priceRange?: {
    min: number;
    max: number;
  };
  suppliers?: string[];
  tags?: string[];
  hasAttachments?: boolean;
  approvedBy?: string;
  createdBy?: string;
  lastModifiedDays?: number;
}

export interface SearchSuggestion {
  type: 'item' | 'supplier' | 'category' | 'user';
  value: string;
  label: string;
  count?: number;
}

// ==================== 예산 관리 타입들 ====================
export interface Budget {
  id: string;
  name: string;
  code: string;
  type: 'department' | 'project' | 'category' | 'annual';
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
  reservedAmount: number;
  fiscalYear: number;
  startDate: string;
  endDate: string;
  department?: string;
  project?: string;
  ownerId: string;
  approvalLimits: ApprovalLimit[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalLimit {
  role: UserRole;
  category: ItemCategory;
  maxAmount: number;
  requiresSecondApproval: boolean;
}

export interface BudgetUsage {
  budgetId: string;
  period: string;
  used: number;
  allocated: number;
  remaining: number;
  percentUsed: number;
  trend: 'increasing' | 'decreasing' | 'stable';
}

// ==================== 워크플로우 타입들 ====================
export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: ItemCategory;
  conditions: WorkflowCondition[];
  steps: WorkflowStep[];
  isActive: boolean;
}

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'greater_than' | 'less_than' | 'contains' | 'in';
  value: any;
}

export interface WorkflowStep {
  id: string;
  order: number;
  type: 'approval' | 'notification' | 'automation';
  assigneeRole?: UserRole;
  assigneeId?: string;
  timeoutDays?: number;
  isRequired: boolean;
  conditions?: WorkflowCondition[];
}

// ==================== 알림 및 이벤트 타입들 ====================
export interface NotificationRule {
  id: string;
  name: string;
  event: NotificationEvent;
  conditions: Record<string, any>;
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  template: string;
  isActive: boolean;
}

export type NotificationEvent = 
  | 'request_submitted'
  | 'request_approved'
  | 'request_rejected'
  | 'budget_exceeded'
  | 'item_received'
  | 'deadline_approaching'
  | 'workflow_timeout';

export interface NotificationRecipient {
  type: 'user' | 'role' | 'department';
  id: string;
  name: string;
}

export type NotificationChannel = 'email' | 'sms' | 'slack' | 'teams' | 'in_app';

// ==================== 통합 및 API 연동 타입들 ====================
export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'erp' | 'accounting' | 'email' | 'chat' | 'storage';
  provider: string;
  isActive: boolean;
  settings: Record<string, any>;
  lastSyncAt?: string;
  status: 'connected' | 'disconnected' | 'error';
}

export interface SyncResult {
  success: boolean;
  recordsProcessed: number;
  recordsCreated: number;
  recordsUpdated: number;
  recordsSkipped: number;
  errors: string[];
  warnings: string[];
}

// ==================== 감사 및 로그 타입들 ====================
export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId: string;
  changes: Record<string, { old: any; new: any }>;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
}

export interface SystemLog {
  id: number;
  timestamp: string;
  level: 'debug' | 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  details?: Record<string, any>;
  userId?: string;
  requestId?: string;
}

// ==================== 설정 및 환경 타입들 ====================
export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  features: {
    advancedSearch: boolean;
    bulkOperations: boolean;
    realTimeNotifications: boolean;
    mobileApp: boolean;
    integrations: boolean;
  };
  limits: {
    maxFileSize: number;
    maxAttachments: number;
    sessionTimeout: number;
    requestsPerMinute: number;
  };
}

export interface UserPreferences {
  language: 'ko' | 'en' | 'ja';
  timezone: string;
  dateFormat: string;
  numberFormat: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  dashboard: {
    layout: 'default' | 'compact' | 'detailed';
    widgets: string[];
    refreshInterval: number;
  };
}

// ==================== 모바일 및 반응형 타입들 ====================
export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  os: string;
  browser: string;
  screenSize: {
    width: number;
    height: number;
  };
  isOnline: boolean;
  touchCapable: boolean;
}

export interface ResponsiveConfig {
  mobile: {
    columns: number;
    hideColumns?: string[];
    compactMode: boolean;
  };
  tablet: {
    columns: number;
    hideColumns?: string[];
    compactMode: boolean;
  };
  desktop: {
    columns: number;
    hideColumns?: string[];
    compactMode: boolean;
  };
}

// ==================== 헬퍼 및 유틸리티 타입들 ====================
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// ==================== 이벤트 및 액션 타입들 ====================
export interface AppAction {
  type: string;
  payload?: any;
  meta?: Record<string, any>;
}

export interface AsyncAction<T = any> {
  pending: boolean;
  data?: T;
  error?: string;
  lastFetch?: number;
}

// ==================== 카테고리 매핑 및 상수들 ====================
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

export const ROLE_LABELS: Record<UserRole, string> = {
  employee: '직원',
  team_lead: '팀장',
  manager: '부서장',
  purchaser: '구매담당자',
  finance: '재무담당자',
  admin: '관리자'
};

// ==================== 색상 및 테마 상수들 ====================
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

// ==================== 기본 내보내기 ====================
export default {
  CATEGORY_LABELS,
  STATUS_LABELS,
  URGENCY_LABELS,
  ROLE_LABELS,
  STATUS_COLORS,
  URGENCY_COLORS
};