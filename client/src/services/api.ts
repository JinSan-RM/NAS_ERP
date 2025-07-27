// client/src/services/api.ts - API 연결 수정
import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// apiRequest 유틸리티 함수
const apiRequest = {
  get: async (url: string, params?: any) => {
    const response = await api.get(url, { params });
    return response.data;
  },
  
  post: async (url: string, data?: any) => {
    const response = await api.post(url, data);
    return response.data;
  },
  
  put: async (url: string, data?: any) => {
    const response = await api.put(url, data);
    return response.data;
  },
  
  delete: async (url: string) => {
    const response = await api.delete(url);
    return response.data;
  },
  
  download: async (url: string, params?: any) => {
    const response = await api.get(url, { 
      params, 
      responseType: 'blob' 
    });
    return response.data;
  }
};

// 타입 정의들
export interface PurchaseRequest {
  id: number;
  request_number?: string;
  item_name: string;
  specifications?: string;
  quantity: number;
  unit?: string;
  estimated_unit_price?: number;
  total_budget?: number;
  currency?: string;
  category?: string;
  urgency: string;
  purchase_method?: string;
  requester_name: string;
  requester_email?: string;
  department: string;
  position?: string;
  phone_number?: string;
  project?: string;
  budget_code?: string;
  cost_center?: string;
  preferred_supplier?: string;
  supplier_contact?: string;
  request_date: string;
  expected_delivery_date?: string;
  status: string;
  approval_level?: number;
  current_approver?: string;
  approved_date?: string;
  approved_by?: string;
  rejected_date?: string;
  rejected_by?: string;
  rejection_reason?: string;
  justification: string;
  business_case?: string;
  notes?: string;
  attachment_urls?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
  priority_score?: number;
  estimated_approval_time?: number;
  actual_approval_time?: number;
}

// export interface SearchFilters {
//   search?: string;
//   status?: string;
//   category?: string;
//   department?: string;
//   supplier?: string;
//   urgency?: string;
//   dateFrom?: string;
//   dateTo?: string;
//   is_active?: boolean;
//   min_budget?: number;
//   max_budget?: number;
//   requester_name?: string;
//   project?: string;
//   budget_code?: string;
// }
export interface SearchFilters {
  search?: string;
  category?: string;
  brand?: string;
  supplier_name?: string;
  location?: string;
  warehouse?: string;
  stock_status?: string;
  is_consumable?: boolean;
  requires_approval?: boolean;
  is_active?: boolean;
  last_received_from?: string;
  last_received_to?: string;
  min_quantity?: number;
  max_quantity?: number;
  has_images?: boolean;
  tags?: string[];
}
export interface PurchaseRequestFormData {
  item_name: string;
  specifications?: string;
  quantity: number;
  unit?: string;
  estimated_unit_price?: number;
  total_budget?: number;
  currency?: string;
  category: string;
  urgency: string;
  purchase_method?: string;
  requester_name: string;
  requester_email?: string;
  department: string;
  position?: string;
  phone_number?: string;
  project?: string;
  budget_code?: string;
  cost_center?: string;
  preferred_supplier?: string;
  supplier_contact?: string;
  expected_delivery_date?: string;
  justification: string;
  business_case?: string;
  notes?: string;
}

export interface PurchaseRequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  this_month: number;
  total_budget?: number;
  average_approval_time?: number;
}

export interface PurchaseSearchFilters {
  search?: string;
  status?: string;
  urgency?: string;
  department?: string;
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  requester_name?: string;
  project?: string;
  budget_code?: string;
  is_active?: boolean;
  min_budget?: number;
  max_budget?: number;
}
export interface UploadResult {
  success: boolean;
  created_count: number;
  request_numbers: string[];
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
  message?: string;
}

// Unified Inventory 타입 정의
export interface UnifiedInventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category?: string;
  brand?: string;
  specifications?: string;
  total_received: number;
  current_quantity: number;
  reserved_quantity: number;
  unit: string;
  condition_quantities: { [key: string]: number };
  unit_price?: number;
  currency: string;
  total_value?: number;
  location?: string;
  warehouse?: string;
  storage_section?: string;
  supplier_name?: string;
  supplier_contact?: string;
  minimum_stock: number;
  maximum_stock?: number;
  reorder_point?: number;
  receipt_history: ReceiptHistory[];
  last_received_date?: string;
  last_received_by?: string;
  last_received_department?: string;
  last_used_date?: string;
  main_image_url?: string;
  image_urls: string[];
  is_active: boolean;
  is_consumable: boolean;
  requires_approval: boolean;
  description?: string;
  notes?: string;
  tags: string[];
  available_quantity: number;
  utilization_rate: number;
  is_low_stock: boolean;
  stock_status: 'normal' | 'low_stock' | 'out_of_stock' | 'overstocked';
  created_at: string;
  updated_at?: string;
  created_by?: string;
  updated_by?: string;
}

export interface ReceiptHistory {
  receipt_number: string;
  item_name: string;
  expected_quantity: number;
  received_quantity: number;
  receiver_name: string;
  receiver_email?: string;
  department: string;
  received_date: string;
  location?: string;
  condition?: string;
  notes?: string;
}

export interface UnifiedInventoryFormData {
  item_code: string;
  item_name: string;
  category?: string;
  brand?: string;
  specifications?: string;
  unit: string;
  unit_price?: number;
  currency: string;
  location?: string;
  warehouse?: string;
  storage_section?: string;
  supplier_name?: string;
  supplier_contact?: string;
  minimum_stock: number;
  maximum_stock?: number;
  reorder_point?: number;
  is_consumable: boolean;
  requires_approval: boolean;
  description?: string;
  notes?: string;
  tags: string[];
}

export interface UnifiedInventoryStats {
  total_items: number;
  total_categories: number;
  low_stock_items: number;
  out_of_stock_items: number;
  overstocked_items: number;
  total_value: number;
  average_utilization: number;
  status_distribution: { [key: string]: number };
  category_distribution: Array<{ category: string; count: number; percentage: number }>;
  recent_receipts: number;
  recent_usage: number;
  pending_approvals: number;
}



// 구매 요청 API - 실제 백엔드 연결
export const purchaseApi = {
  // 구매 요청 목록 조회
  getRequests: async (params: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
    urgency?: string;
    department?: string;
    dateFrom?: string;
    dateTo?: string;
    category?: string;
    [key: string]: any;
  }): Promise<{
    data: {
      items: PurchaseRequest[];
      total: number;
      pages: number;
      page: number;
      size: number;
    };
  }> => {
    const { page, limit, dateFrom, dateTo, ...filters } = params;
    
    try {
      const queryParams = {
        skip: (page - 1) * limit,
        limit,
        date_from: dateFrom,
        date_to: dateTo,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
        )
      };
      
      const response = await apiRequest.get('/purchase-requests/', queryParams);
      return { data: response };
    } catch (error) {
      console.error('구매 요청 조회 실패:', error);
      throw error;
    }
  },

  // 구매 요청 생성
  createRequest: async (data: PurchaseRequestFormData): Promise<PurchaseRequest> => {
    try {
      const response = await apiRequest.post('/purchase-requests/', data);
      return response;
    } catch (error) {
      console.error('구매 요청 생성 실패:', error);
      throw error;
    }
  },

  // 구매 요청 수정
  updateRequest: async (id: number, data: Partial<PurchaseRequestFormData>): Promise<PurchaseRequest> => {
    try {
      const response = await apiRequest.put(`/purchase-requests/${id}`, data);
      return response;
    } catch (error) {
      console.error('API 오류 상세:', error.response?.data); // 이 부분 추가
      throw error;
    }
  },

  // 구매 요청 삭제
  deleteRequest: async (id: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest.delete(`/purchase-requests/${id}`);
      return response;
    } catch (error) {
      console.error('구매 요청 삭제 실패:', error);
      throw error;
    }
  },

  // 구매 요청 통계
  getStats: async (): Promise<{ data: PurchaseRequestStats }> => {
    try {
      const response = await apiRequest.get('/purchase-requests/stats');
      return { data: response };
    } catch (error) {
      console.error('구매 요청 통계 조회 실패:', error);
      throw error;
    }
  },

  // Excel 업로드 개선
  uploadExcel: async (file: File): Promise<UploadResult> => {
    try {
      console.log('📤 구매요청 Excel 업로드 시작:', file.name);
      
      // 파일 유효성 검사
      if (!file) {
        throw new Error('파일이 선택되지 않았습니다.');
      }
      
      if (!file.name.match(/\.(xlsx|xls)$/i)) {
        throw new Error('Excel 파일만 업로드 가능합니다.');
      }
      
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
      }
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/purchase-requests/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 300000, // 5분 타임아웃
      });
      
      console.log('✅ 구매요청 업로드 성공:', response.data);
      
      // 응답 구조화
      const result: UploadResult = {
        success: response.data.success || true,
        created_count: response.data.created_count || 0,
        created_items: response.data.request_numbers || [],
        total_processed: response.data.total_processed || 0,
        errors: response.data.errors || [],
        message: response.data.message || '업로드가 완료되었습니다.'
      };
      
      return result;
    } catch (error: any) {
      console.error('구매요청 Excel 업로드 실패:', error);
      
      if (error.response?.data) {
        throw new Error(error.response.data.detail || '업로드 중 오류가 발생했습니다.');
      }
      throw new Error(error.message || '업로드 중 알 수 없는 오류가 발생했습니다.');
    }
  },

  // 템플릿 다운로드
  downloadTemplate: async (): Promise<void> => {
    try {
      console.log('📋 구매요청 템플릿 다운로드 시작...');
      
      const response = await api.get('/purchase-requests/template/download', {
        responseType: 'blob',
        timeout: 60000,
      });
      
      if (!response.data || response.data.size === 0) {
        throw new Error('빈 템플릿 파일이 반환되었습니다.');
      }
      
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.download = `구매요청_템플릿_${today}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ 구매요청 템플릿 다운로드 완료');
    } catch (error: any) {
      console.error('❌ 구매요청 템플릿 다운로드 실패:', error);
      throw new Error('템플릿 다운로드 중 오류가 발생했습니다.');
    }
  },
  // 🔥 Excel 내보내기 함수 추가
  exportRequests: async (filters?: SearchFilters): Promise<void> => {
    try {
      console.log('📊 구매요청 Excel 내보내기 시작...');
      
      const params = filters ? {
        search: filters.search,
        status: filters.status,
        urgency: filters.urgency,
        department: filters.department,
        category: filters.category,
        date_from: filters.dateFrom,
        date_to: filters.dateTo
      } : {};

      // undefined 값 제거
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
      );

      console.log('📋 내보내기 파라미터:', filteredParams);

      const response = await api.get('/purchase-requests/export/excel', {
        params: filteredParams,
        responseType: 'blob',
        timeout: 300000, // 5분 타임아웃
      });

      // Blob 유효성 검사
      if (!response.data || response.data.size === 0) {
        throw new Error('빈 파일이 반환되었습니다.');
      }

      console.log('📥 파일 다운로드 완료, 크기:', response.data.size);

      // 파일 다운로드 처리
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const today = new Date().toISOString().split('T')[0];
      link.download = `구매요청목록_${today}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('✅ 구매요청 Excel 내보내기 완료');
    } catch (error: any) {
      console.error('❌ 구매요청 Excel 내보내기 실패:', error);
      
      // 에러 타입별 처리
      if (error.response?.status === 404) {
        throw new Error('내보낼 데이터가 없습니다.');
      } else if (error.response?.status === 500) {
        throw new Error('서버에서 파일 생성 중 오류가 발생했습니다.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('파일 생성 시간이 너무 오래 걸립니다. 데이터를 줄여서 다시 시도해주세요.');
      } else {
        throw new Error(error.message || '내보내기 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  },
  // 승인/거절 처리
  approveRequest: async (params: {
    requestId: number;
    action: 'approve' | 'reject';
    comments?: string;
  }): Promise<PurchaseRequest> => {
    try {
      const { requestId, ...data } = params;
      const response = await apiRequest.post(`/purchase-requests/${requestId}/approve`, data);
      return response;
    } catch (error) {
      console.error('승인 처리 실패:', error);
      throw error;
    }
  },

  // 편의 메서드들
  getPendingRequests: async (limit = 50): Promise<PurchaseRequest[]> => {
    try {
      const response = await apiRequest.get('/purchase-requests/pending', { limit });
      return response;
    } catch (error) {
      console.error('대기 중 요청 조회 실패:', error);
      throw error;
    }
  },

  getUrgentRequests: async (limit = 30): Promise<PurchaseRequest[]> => {
    try {
      const response = await apiRequest.get('/purchase-requests/urgent', { limit });
      return response;
    } catch (error) {
      console.error('긴급 요청 조회 실패:', error);
      throw error;
    }
  },

  getRecentRequests: async (days = 7, limit = 50): Promise<PurchaseRequest[]> => {
    try {
      const response = await apiRequest.get('/purchase-requests/recent', { days, limit });
      return response;
    } catch (error) {
      console.error('최근 요청 조회 실패:', error);
      throw error;
    }
  },
  // 🔥 새로 추가: 구매 요청 완료 처리
  completePurchase: async (requestId: number, completionData: {
    received_quantity?: number;
    receiver_name?: string;
    receiver_email?: string;
    location?: string;
    condition?: string;
    notes?: string;
    completed_by?: string;
    received_date?: string;
  }): Promise<{
    success: boolean;
    message: string;
    purchase_request_id: number;
    inventory_item_id: number;
    inventory_item_code: string;
    redirect_url: string;
  }> => {
    try {
      const response = await apiRequest.post(`/purchase-requests/${requestId}/complete`, completionData);
      return response;
    } catch (error) {
      console.error('구매 완료 처리 실패:', error);
      throw error;
    }
  },

  // 구매 요청에서 품목 직접 생성 (기존 있지만 개선)
  createInventoryFromPurchase: async (requestId: number, inventoryData: {
    received_quantity: number;
    receiver_name: string;
    receiver_email?: string;
    department: string;
    received_date: string;
    location?: string;
    condition?: string;
    notes?: string;
  }): Promise<any> => {
    try {
      const response = await apiRequest.post('/inventory/from-purchase-request', {
        purchase_request_id: requestId,
        ...inventoryData
      });
      return response;
    } catch (error) {
      console.error('구매 요청에서 품목 생성 실패:', error);
      throw error;
    }
  },
};

// Unified Inventory API - 새로운 통합 재고 관리
export const inventoryApi = {
  // // 품목 목록 조회
  // getItems: async (page = 1, limit = 20, filters: SearchFilters = {}): Promise<{
  //   data: {
  //     items: UnifiedInventoryItem[];
  //     total: number;
  //     pages: number;
  //     page: number;
  //     size: number;
  //   };
  // }> => {
  //   try {
  //     const params = {
  //       skip: (page - 1) * limit,
  //       limit,
  //       ...Object.fromEntries(
  //         Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
  //       )
  //     };
      
  //     const response = await apiRequest.get('/inventory', params); // unified_inventory 엔드포인트
  //     return { data: response };
  //   } catch (error) {
  //     console.error('품목 조회 실패:', error);
  //     throw error;
  //   }
  // },
  getItems: async (page = 1, limit = 20, filters: any = {}): Promise<any> => {
    try {
      const params = {
        skip: (page - 1) * limit,
        limit,
        ...filters
      };
      const response = await apiRequest.get('/inventory/', params);
      return { data: response };
    } catch (error) {
      console.error('재고 조회 실패:', error);
      throw error;
    }
  },

  // 🔥 stats API 경로 수정
  getStats: async (): Promise<any> => {
    try {
      // /stats 대신 /inventory/stats 사용
      const response = await apiRequest.get('/inventory/stats');
      return { data: response };
    } catch (error) {
      console.error('재고 통계 조회 실패:', error);
      
      // 🔥 404 오류 시 기본값 반환
      return { 
        data: {
          total_items: 0,
          low_stock_items: 0,
          out_of_stock_items: 0,
          total_value: 0
        }
      };
    }
  },

  // 품목 생성
  createItem: async (data: UnifiedInventoryFormData): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.post('/inventory', data);
      return response;
    } catch (error) {
      console.error('품목 생성 실패:', error);
      throw error;
    }
  },

  updateItem: async (id: number, data: any): Promise<any> => {
    try {
      const response = await apiRequest.put(`/inventory/${id}`, data);
      return response;
    } catch (error) {
      console.error('재고 수정 실패:', error);
      throw error;
    }
  },

  deleteItem: async (itemId: number): Promise<any> => {
    try {
      const response = await apiRequest.delete(`/inventory/${itemId}`);
      return response;
    } catch (error) {
      console.error('재고 삭제 실패:', error);
      throw error;
    }
  },

  exportData: async (options?: {
  include_receipts?: boolean;
  include_images?: boolean;
  search?: string;
  category?: string;
  brand?: string;
  supplier_name?: string;
  is_active?: boolean;
}): Promise<void> => {
  try {
    const params = {
      include_receipts: options?.include_receipts || false,
      include_images: options?.include_images || false,
      search: options?.search,
      category: options?.category,
      brand: options?.brand,
      supplier_name: options?.supplier_name,
      is_active: options?.is_active
    };
    
    // undefined 값 제거
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined && value !== null)
    );
    
    const response = await api.get('/inventory/export', {
      params: filteredParams,
      responseType: 'blob'
    });
    if (!response.data || response.data.size === 0) {
      throw new Error('빈 파일이 반환되었습니다.');
    }
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = today.toTimeString().slice(0, 8).replace(/:/g, '');
    link.download = `품목목록_${dateStr}_${timeStr}.xlsx`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    console.log('✅ Excel 내보내기 완료');
    } catch (error) {
      console.error('❌ Excel 내보내기 실패:', error);
      
      // 에러 타입별 처리
      if (error.response?.status === 404) {
        throw new Error('내보낼 데이터가 없습니다.');
      } else if (error.response?.status === 500) {
        throw new Error('서버에서 파일 생성 중 오류가 발생했습니다.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('파일 생성 시간이 너무 오래 걸립니다. 데이터를 줄여서 다시 시도해주세요.');
      } else {
        throw new Error(error.message || '내보내기 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  },
  // 품목 상세 조회
  getItem: async (itemId: number): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.get(`/inventory/${itemId}`);
      return response;
    } catch (error) {
      console.error('품목 상세 조회 실패:', error);
      throw error;
    }
  },

  // 품목 코드로 조회
  getItemByCode: async (itemCode: string): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.get(`/inventory/code/${itemCode}`);
      return response;
    } catch (error) {
      console.error('품목 코드 조회 실패:', error);
      throw error;
    }
  },

  // 수령 추가
  addReceipt: async (itemId: number, receiptData: ReceiptHistory): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.post(`/inventory/${itemId}/receipts`, receiptData);
      return response;
    } catch (error) {
      console.error('수령 추가 실패:', error);
      throw error;
    }
  },

  // 수령 수정
  updateReceipt: async (itemId: number, receiptNumber: string, receiptData: Partial<ReceiptHistory>): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.put(`/inventory/${itemId}/receipts/${receiptNumber}`, receiptData);
      return response;
    } catch (error) {
      console.error('수령 수정 실패:', error);
      throw error;
    }
  },

  // 수령 삭제
  deleteReceipt: async (itemId: number, receiptNumber: string): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.delete(`/inventory/${itemId}/receipts/${receiptNumber}`);
      return response;
    } catch (error) {
      console.error('수령 삭제 실패:', error);
      throw error;
    }
  },

  // 재고 수량 업데이트
  updateStock: async (itemId: number, quantity: number): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.patch(`/inventory/${itemId}/stock?quantity=${quantity}`);
      return response;
    } catch (error) {
      console.error('재고 수량 업데이트 실패:', error);
      throw error;
    }
  },

  // 카테고리 목록 조회
  getCategories: async (): Promise<string[]> => {
    try {
      const response = await apiRequest.get('/inventory/categories');
      return response;
    } catch (error) {
      console.error('카테고리 조회 실패:', error);
      throw error;
    }
  },

  // 재고 부족 품목 조회
  getLowStockItems: async (skip = 0, limit = 100): Promise<UnifiedInventoryItem[]> => {
    try {
      const response = await apiRequest.get('/inventory/low-stock', { skip, limit });
      return response;
    } catch (error) {
      console.error('재고 부족 품목 조회 실패:', error);
      throw error;
    }
  },

  // 재고 없는 품목 조회
  getOutOfStockItems: async (skip = 0, limit = 100): Promise<UnifiedInventoryItem[]> => {
    try {
      const response = await apiRequest.get('/inventory/out-of-stock', { skip, limit });
      return response;
    } catch (error) {
      console.error('재고 없는 품목 조회 실패:', error);
      throw error;
    }
  },

  // // Excel 내보내기
  // exportData: async (): Promise<Blob> => {
  //   try {
  //     const blob = await apiRequest.download('/inventory/export');
  //     return blob;
  //   } catch (error) {
  //     console.error('Excel 내보내기 실패:', error);
  //     throw error;
  //   }
  // },

  // Excel 일괄 업로드
  // 🔥 개선된 Excel 업로드
  // Excel 업로드 개선
uploadExcel: async (file: File): Promise<UploadResult> => {
  try {
    console.log('📤 Excel 업로드 시작:', file.name, file.size);
    
    // 파일 유효성 검사
    if (!file) {
      throw new Error('파일이 선택되지 않았습니다.');
    }
    
    if (!file.name.match(/\.(xlsx|xls)$/i)) {
      throw new Error('Excel 파일만 업로드 가능합니다 (.xlsx, .xls)');
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('파일 크기는 10MB를 초과할 수 없습니다.');
    }
    
    // FormData 생성
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('🚀 서버에 업로드 요청...');
    
    const response = await api.post('/inventory/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5분 타임아웃
    });
    
    console.log('✅ 업로드 성공:', response.data);
    
    // 성공 응답 구조화
    const result: UploadResult = {
      success: response.data.success || true,
      created_count: response.data.created_count || 0,
      updated_count: response.data.updated_count || 0,
      created_items: response.data.created_items || [],
      updated_items: response.data.updated_items || [],
      total_processed: response.data.total_processed || 0,
      errors: response.data.errors || [],
      message: response.data.message || '업로드가 완료되었습니다.'
    };
    
    return result;
    
  } catch (error: any) {
    console.error('❌ Excel 업로드 실패:', error);
    
    if (error.response?.data) {
      const errorData = error.response.data;
      throw new Error(errorData.detail || errorData.message || '업로드 중 오류가 발생했습니다.');
    } else {
      throw new Error(error.message || '업로드 중 알 수 없는 오류가 발생했습니다.');
    }
  }
},

  // 🔥 개선된 템플릿 다운로드
  downloadTemplate: async (): Promise<void> => {
    try {
      console.log('📋 템플릿 다운로드 시작...');
      
      const response = await api.get('/inventory/template/download', {
        responseType: 'blob',
        timeout: 60000, // 1분 타임아웃
      });
      
      // Blob 유효성 검사
      if (!response.data || response.data.size === 0) {
        throw new Error('빈 템플릿 파일이 반환되었습니다.');
      }
      
      console.log('📥 템플릿 파일 다운로드 완료, 크기:', response.data.size);
      
      // 파일 다운로드 처리
      const blob = response.data;
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // 파일명 생성
      const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
      link.download = `품목등록_템플릿_${today}.xlsx`;
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ 템플릿 다운로드 완료');
    } catch (error: any) {
      console.error('❌ 템플릿 다운로드 실패:', error);
      
      if (error.response?.status === 404) {
        throw new Error('템플릿 파일을 찾을 수 없습니다.');
      } else if (error.response?.status === 500) {
        throw new Error('서버에서 템플릿 생성 중 오류가 발생했습니다.');
      } else {
        throw new Error('템플릿 다운로드 중 오류가 발생했습니다.');
      }
    }
  },
  // 이미지 업로드
  uploadImage: async (itemId: number, file: File, imageType = 'general'): Promise<{
    success: boolean;
    image_id: number;
    filename: string;
    file_url: string;
    thumbnail_url?: string;
    message: string;
  }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('image_type', imageType);
      
      const response = await api.post(`/inventory/${itemId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      throw error;
    }
  },

  // 이미지 삭제
  deleteImage: async (itemId: number, imageId: number): Promise<{ message: string }> => {
    try {
      const response = await apiRequest.delete(`/inventory/${itemId}/images/${imageId}`);
      return response;
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      throw error;
    }
  },

  // 품목 이동/전송
  transferItem: async (fromItemId: number, transferData: {
    to_location: string;
    quantity: number;
    transfer_type: string;
    transfer_by: string;
    department: string;
    reason: string;
    notes?: string;
    to_department?: string;
    to_receiver?: string;
  }): Promise<UnifiedInventoryItem> => {
    try {
      const response = await apiRequest.post(`/inventory/${fromItemId}/transfer`, transferData);
      return response;
    } catch (error) {
      console.error('품목 이동 실패:', error);
      throw error;
    }
  },

  // 사용 이력 조회
  getUsageLogs: async (itemId: number, page = 1, limit = 20): Promise<{
    data: {
      items: any[];
      total: number;
      pages: number;
      page: number;
      size: number;
    };
  }> => {
    try {
      const params = {
        skip: (page - 1) * limit,
        limit,
      };

      const response = await apiRequest.get(`/inventory/${itemId}/usage-logs`, params);
      return { data: response };
    } catch (error) {
      console.error('사용 이력 조회 실패:', error);
      throw error;
    }
  },

  // 사용 이력 추가
  addUsageLog: async (itemId: number, usageData: {
    usage_type: string;
    quantity: number;
    user_name: string;
    department: string;
    purpose?: string;
    notes?: string;
  }): Promise<any> => {
    try {
      const response = await apiRequest.post(`/inventory/${itemId}/usage-logs`, usageData);
      return response;
    } catch (error) {
      console.error('사용 이력 추가 실패:', error);
      throw error;
    }
  },

  // QR 코드 생성
  generateQRCode: async (itemId: number, options: {
    include_info: string[];
    size: string;
  }): Promise<{
    qr_code_url: string;
    qr_code_data: string;
    expiry_date?: string;
  }> => {
    try {
      const response = await apiRequest.post(`/inventory/${itemId}/qr-code`, options);
      return response;
    } catch (error) {
      console.error('QR 코드 생성 실패:', error);
      throw error;
    }
  },

  // 대시보드 데이터 조회
  getDashboardData: async (): Promise<{
    total_items: number;
    total_value: number;
    low_stock_alerts: number;
    recent_receipts: number;
    category_chart: Array<{ category: string; count: number; value: number }>;
    stock_status_chart: Array<{ status: string; count: number; percentage: number }>;
    monthly_receipts: Array<{ month: string; count: number; quantity: number }>;
    top_usage_items: Array<{ item_name: string; usage_count: number; total_quantity: number }>;
    alerts: Array<{ type: string; message: string; item_id?: number; priority: string }>;
    recommendations: string[];
  }> => {
    try {
      const response = await apiRequest.get('/inventory/dashboard');
      return response;
    } catch (error) {
      console.error('대시보드 데이터 조회 실패:', error);
      throw error;
    }
  },
  // 🔥 새로 추가: 수령 완료 처리 (이미지 포함)
  completeReceiptWithImages: async (itemId: number, receiptData: {
    receipt_number?: string;
    received_quantity: number;
    receiver_name: string;
    receiver_email?: string;
    department: string;
    received_date: string;
    location?: string;
    condition?: string;
    notes?: string;
  }, images?: File[]): Promise<any> => {
    try {
      // 1. 수령 이력 먼저 추가
      const receipt = await apiRequest.post(`/inventory/${itemId}/receipts`, receiptData);
      
      // 2. 이미지가 있으면 업로드 (명시적 체크 강화)
      if (images && images.length > 0) {
        const uploadPromises = images.map(async (file, index) => {
          console.log(`${successfulUploads.length}개 이미지 업로드 완료`);
          const formData = new FormData();
          formData.append('file', file);
          formData.append('image_type', 'receipt');
          
          return api.post(`/inventory/${itemId}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        });
        
        const imageResults = await Promise.allSettled(uploadPromises);
        const successfulUploads = imageResults
          .filter(result => result.status === 'fulfilled')
          .map(result => (result as PromiseFulfilledResult<any>).value.data);
        
        console.log(`${successfulUploads.length}개 이미지 업로드 완료`);
      } else {
        console.log('이미지 없음: 업로드 스킵');
      }
      
      return receipt;
    } catch (error) {
      console.log('오류 상세:', error.response?.data?.detail);
      console.error('수령 완료 처리 실패:', error);
      throw error;
    }
  },

  // 이미지와 함께 품목 업데이트
  updateItemWithImages: async (itemId: number, itemData: any, images?: File[]): Promise<any> => {
    try {
      // 1. 품목 정보 업데이트
      const updatedItem = await apiRequest.put(`/inventory/${itemId}`, itemData);
      
      // 2. 이미지 업로드
      if (images && images.length > 0) {
        for (const file of images) {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('image_type', 'general');
          
          await api.post(`/inventory/${itemId}/images`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
        }
      }
      
      return updatedItem;
    } catch (error) {
      console.error('품목 업데이트 실패:', error);
      throw error;
    }
  },
};

// 기존 수령 API는 deprecate하고 inventoryApi로 통합
export const receiptApi = {
  // 호환성을 위해 기존 API 유지하되, 실제로는 inventoryApi 사용을 권장
  getReceipts: async (page = 1, limit = 20, filters: any = {}): Promise<any> => {
    console.warn('receiptApi.getReceipts는 deprecated입니다. inventoryApi를 사용하세요.');
    
    try {
      // 샘플 데이터 반환 (기존 코드와 호환성 유지)
      const sampleReceipts = [
        {
          id: 1,
          receiptNumber: 'REC-001',
          itemName: '노트북',
          expectedQuantity: 5,
          receivedQuantity: 5,
          receiverName: '김철수',
          department: '개발팀',
          receivedDate: new Date().toISOString(),
        },
        {
          id: 2,
          receiptNumber: 'REC-002',
          itemName: '프린터',
          expectedQuantity: 2,
          receivedQuantity: 2,
          receiverName: '이영희',
          department: '총무부',
          receivedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        }
      ];

      return {
        data: {
          items: sampleReceipts.slice((page - 1) * limit, page * limit),
          total: sampleReceipts.length,
          pages: Math.ceil(sampleReceipts.length / limit),
          page,
          size: limit,
        }
      };
    } catch (error) {
      console.error('수령 내역 조회 실패:', error);
      throw error;
    }
  },

  createReceipt: async (data: any): Promise<any> => {
    console.warn('receiptApi.createReceipt는 deprecated입니다. inventoryApi.addReceipt를 사용하세요.');
    throw new Error('이 API는 더 이상 지원되지 않습니다. inventoryApi.addReceipt를 사용하세요.');
  },

  updateReceipt: async (id: number, data: any): Promise<any> => {
    console.warn('receiptApi.updateReceipt는 deprecated입니다. inventoryApi.updateReceipt를 사용하세요.');
    throw new Error('이 API는 더 이상 지원되지 않                                                     습니다. inventoryApi.updateReceipt를 사용하세요.');
  },

  deleteReceipt: async (id: number): Promise<any> => {
    console.warn('receiptApi.deleteReceipt는 deprecated입니다. inventoryApi.deleteReceipt를 사용하세요.');
    throw new Error('이 API는 더 이상 지원되지 않습니다. inventoryApi.deleteReceipt를 사용하세요.');
  },

  exportReceipts: async (): Promise<void> => {
    console.warn('receiptApi.exportReceipts는 deprecated입니다. inventoryApi.exportData를 사용하세요.');
    throw new Error('이 API는 더 이상 지원되지 않습니다. inventoryApi.exportData를 사용하세요.');
  }
};

// 업로드 API - 실제 백엔드 연결
export const uploadApi = {
  uploadExcel: async (file: File): Promise<{ 
    success: boolean; 
    data?: { itemCount: number }; 
    message: string; 
  }> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/upload/excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });
      
      return {
        success: true,
        data: { itemCount: response.data.created_count || 0 },
        message: response.data.message || '업로드가 완료되었습니다.',
      };
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      throw error;
    }
  },

  getUploadInfo: async (): Promise<{ data: any }> => {
    try {
      const response = await apiRequest.get('/upload/');
      return { data: response };
    } catch (error) {
      console.error('업로드 정보 조회 실패:', error);
      throw error;
    }
  },

  getTemplate: async (): Promise<{ data: any }> => {
    try {
      const response = await apiRequest.get('/upload/template');
      return { data: response };
    } catch (error) {
      console.error('템플릿 정보 조회 실패:', error);
      throw error;
    }
  },

  // 템플릿 다운로드 개선
downloadTemplate: async (): Promise<void> => {
  try {
    console.log('📋 템플릿 다운로드 시작...');
    
    const response = await api.get('/inventory/template/download', {
      responseType: 'blob',
      timeout: 60000, // 1분 타임아웃
    });
    
    if (!response.data || response.data.size === 0) {
      throw new Error('빈 템플릿 파일이 반환되었습니다.');
    }
    
    console.log('📥 템플릿 파일 다운로드 완료');
    
    // 파일 다운로드 처리
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    link.download = `품목등록_템플릿_${today}.xlsx`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('✅ 템플릿 다운로드 완료');
  } catch (error: any) {
    console.error('❌ 템플릿 다운로드 실패:', error);
    throw new Error('템플릿 다운로드 중 오류가 발생했습니다.');
    }
  },
};

// 대시보드 API
export const dashboardApi = {
  getStats: async (): Promise<{ data: any }> => {
    try {
      const response = await apiRequest.get('/dashboard/stats');
      return { data: response };
    } catch (error) {
      console.error('대시보드 통계 조회 실패:', error);
      throw error;
    }
  },

  getDashboard: async (): Promise<{ data: any }> => {
    try {
      const response = await apiRequest.get('/dashboard/');
      return { data: response };
    } catch (error) {
      console.error('대시보드 조회 실패:', error);
      throw error;
    }
  },
};

// API 연결 테스트
export const apiUtils = {
  testConnection: async (): Promise<boolean> => {
    try {
      await apiRequest.get('/dashboard/');
      return true;
    } catch (error) {
      console.error('API 연결 테스트 실패:', error);
      return false;
    }
  },

  checkHealth: async (): Promise<any> => {
    try {
      const response = await api.get('/health');
      return response.data;
    } catch (error) {
      console.error('헬스체크 실패:', error);
      throw error;
    }
  }
};

export default {
  dashboard: dashboardApi,
  purchase: purchaseApi,
  inventory: inventoryApi, // 새로운 통합 재고 API
  receipt: receiptApi, // deprecated
  // kakao: kakaoApi,
  upload: uploadApi,
  utils: apiUtils,
};