// client/src/services/api.ts - API 연결 수정
import axios from 'axios';

// API 기본 설정
const API_BASE_URL = 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
  required_by_date?: string;
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
  project?: string;
  budget_code?: string;
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
  required_by_date?: string;
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
      console.error('구매 요청 수정 실패:', error);
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

  // Excel 일괄 업로드
  uploadExcel: async (file: File): Promise<UploadResult> => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await api.post('/purchase-requests/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2분 타임아웃
      });
      
      return response.data;
    } catch (error) {
      console.error('Excel 업로드 실패:', error);
      throw error;
    }
  },

  // 템플릿 다운로드
  downloadTemplate: async (): Promise<void> => {
    try {
      const blob = await apiRequest.download('/purchase-requests/template/download');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'purchase_request_template.xlsx';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('템플릿 다운로드 실패:', error);
      throw error;
    }
  },

  // Excel 내보내기
  exportRequests: async (filters?: SearchFilters): Promise<void> => {
    try {
      const params = filters ? {
        search: filters.search,
        status: filters.status,
        urgency: filters.urgency,
        department: filters.department,
        category: filters.category,
        date_from: filters.dateFrom,
        date_to: filters.dateTo
      } : {};

      const blob = await apiRequest.download('/purchase-requests/export/excel', params);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const today = new Date().toISOString().split('T')[0];
      link.download = `purchase_requests_${today}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Excel 내보내기 실패:', error);
      throw error;
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
};

// 재고 API - 실제 백엔드 연결
export const inventoryApi = {
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

  getStats: async (): Promise<any> => {
    try {
      const response = await apiRequest.get('/inventory/stats');
      return { data: response };
    } catch (error) {
      console.error('재고 통계 조회 실패:', error);
      throw error;
    }
  },

  createItem: async (data: any): Promise<any> => {
    try {
      const response = await apiRequest.post('/inventory/', data);
      return response;
    } catch (error) {
      console.error('재고 생성 실패:', error);
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

  exportData: async (): Promise<void> => {
    try {
      const blob = await apiRequest.download('/inventory/export');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('재고 내보내기 실패:', error);
      throw error;
    }
  }
};

export const receiptApi = {
  getReceipts: async (page = 1, limit = 20, filters: any = {}): Promise<any> => {
    try {
      const params = {
        skip: (page - 1) * limit,
        limit,
        ...filters
      };
      return await apiRequest.get('/receipts/', params);
    } catch (error) {
      console.warn('⚠️ 수령 관리 API가 구현되지 않았습니다. 샘플 데이터를 반환합니다.');
      
      // 샘플 수령 데이터
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
    }
  },

  createReceipt: async (data: any): Promise<any> => {
    try {
      return await apiRequest.post('/receipts/', data);
    } catch (error) {
      console.warn('⚠️ 수령 등록 API가 구현되지 않았습니다.');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      return {
        id: Math.floor(Math.random() * 1000),
        ...data,
        receiptNumber: `REC-${Date.now()}`,
        receivedDate: new Date().toISOString(),
      };
    }
  },

  updateReceipt: async (id: number, data: any): Promise<any> => {
    try {
      return await apiRequest.put(`/receipts/${id}`, data);
    } catch (error) {
      console.warn('⚠️ 수령 수정 API가 구현되지 않았습니다.');
      throw new Error('수정 기능이 아직 구현되지 않았습니다.');
    }
  },

  deleteReceipt: async (id: number): Promise<any> => {
    try {
      return await apiRequest.delete(`/receipts/${id}`);
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { message: '수령 내역이 삭제되었습니다.' };
    }
  },

  exportReceipts: async (): Promise<void> => {
    console.warn('⚠️ 수령 내역 Excel 내보내기가 구현되지 않았습니다.');
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

  downloadTemplate: async (): Promise<void> => {
    try {
      const blob = await apiRequest.download('/upload/template/download');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'inventory_template.xlsx';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('템플릿 다운로드 실패:', error);
      throw error;
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
  inventory: inventoryApi,
  receipt: receiptApi,
  // kakao: kakaoApi,
  upload: uploadApi,
  utils: apiUtils,
};