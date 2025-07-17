// server/src/types/index.ts
export type ItemCategory = 'office_supplies' | 'electronics' | 'furniture' | 'maintenance' | 'software';

export interface SearchFilters {
  search?: string;
  status?: string;
  category?: ItemCategory;
  supplier?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
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

export interface InventoryItem {
  no: number;
  itemName: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  supplier: string;
  category: ItemCategory;
  urgency: string;
  department: string;
  purchaseMethod: string;
  requesterId: string;
  received: boolean;
  receivedDate?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateInventoryRequest {
  itemName: string;
  specifications: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;  // 추가
  supplier: string;
  category: ItemCategory;
  urgency: string;
  department: string;
  purchaseMethod: string;
  requesterId: string;
  received: boolean;   // 추가
  status: string;      // 추가
}

export interface UpdateInventoryRequest {
  itemName?: string;
  specifications?: string;
  quantity?: number;
  unitPrice?: number;
  supplier?: string;
  category?: ItemCategory;
  urgency?: string;
  department?: string;
  purchaseMethod?: string;
  status?: string;
  received?: boolean;
  receivedDate?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

export interface PurchaseRequest {
  id: number;
  itemName: string;
  specifications: string;
  quantity: number;
  estimatedPrice: number;
  urgency: string;
  status: string;
  requesterId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Receipt {
  id: number;
  itemNo: number;
  receivedQuantity: number;
  receiverName: string;
  receiverId: string;
  department: string;
  createdAt: Date;
}