// client/src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  SearchFilters, 
  PurchaseRequest,
  PurchaseRequestFormData,
  PurchaseRequestStats,
  ApprovalRequest
} from '../types';

// Axios 인스턴스 생성
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    timeout: 30000, // Excel 업로드를 위해 타임아웃 증가
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (import.meta.env.DEV) {
        console.log('🚀 API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          params: config.params,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      if (import.meta.env.DEV) {
        console.log('✅ API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
      
      return response;
    },
    (error: AxiosError) => {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });

      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

// 공통 API 함수들
const apiRequest = {
  get: <T>(url: string, params?: any): Promise<T> =>
    api.get(url, { params }).then(res => res.data),
    
  post: <T>(url: string, data?: any): Promise<T> =>
    api.post(url, data).then(res => res.data),
    
  put: <T>(url: string, data?: any): Promise<T> =>
    api.put(url, data).then(res => res.data),
    
  patch: <T>(url: string, data?: any): Promise<T> =>
    api.patch(url, data).then(res => res.data),
    
  delete: <T>(url: string): Promise<T> =>
    api.delete(url).then(res => res.data),
    
  download: (url: string, params?: any): Promise<Blob> =>
    api.get(url, { 
      params,
      responseType: 'blob' 
    }).then(res => res.data),
};

// ==================== 대시보드 API ====================
export const dashboardApi = {
  getStats: (): Promise<any> =>
    apiRequest.get('/dashboard/stats'),

  getDashboard: (): Promise<any> =>
    apiRequest.get('/dashboard/'),
};

// ==================== 구매 요청 API ====================
export const purchaseApi = {
  // 구매 요청 목록 조회
  getRequests: (params: {
    page: number;
    limit: number;
    [key: string]: any;
  }): Promise<PaginatedResponse<PurchaseRequest>> => {
    const { page, limit, ...filters } = params;
    const requestParams = {
      skip: (page - 1) * limit,
      limit,
      ...filters
    };
    return apiRequest.get('/purchase-requests/', requestParams);
  },

  // 특정 구매 요청 조회
  getRequest: (id: number): Promise<PurchaseRequest> =>
    apiRequest.get(`/purchase-requests/${id}`),

  // 구매 요청 생성
  createRequest: (data: PurchaseRequestFormData): Promise<PurchaseRequest> =>
    apiRequest.post('/purchase-requests/', data),

  // 구매 요청 수정
  updateRequest: (id: number, data: Partial<PurchaseRequestFormData>): Promise<PurchaseRequest> =>
    apiRequest.put(`/purchase-requests/${id}`, data),

  // 구매 요청 삭제
  deleteRequest: (id: number): Promise<{ message: string }> =>
    apiRequest.delete(`/purchase-requests/${id}`),

  // 구매 요청 통계
  getStats: (): Promise<PurchaseRequestStats> =>
    apiRequest.get('/purchase-requests/stats'),

  // 승인/거절 처리
  approveRequest: (params: {
    requestId: number;
    action: 'approve' | 'reject';
    comments?: string;
    approver_name?: string;
    approver_email?: string;
  }): Promise<PurchaseRequest> => {
    const { requestId, ...data } = params;
    return apiRequest.post(`/purchase-requests/${requestId}/approve`, data);
  },

  // 카테고리 목록 조회
  getCategories: (): Promise<string[]> =>
    apiRequest.get('/purchase-requests/categories'),

  // 부서 목록 조회
  getDepartments: (): Promise<string[]> =>
    apiRequest.get('/purchase-requests/departments'),

  // 공급업체 목록 조회
  getSuppliers: (): Promise<string[]> =>
    apiRequest.get('/purchase-requests/suppliers'),

  // 승인 대기 요청들
  getPendingRequests: (limit = 50): Promise<PurchaseRequest[]> =>
    apiRequest.get('/purchase-requests/pending', { limit }),

  // 긴급 요청들
  getUrgentRequests: (limit = 30): Promise<PurchaseRequest[]> =>
    apiRequest.get('/purchase-requests/urgent', { limit }),

  // 최근 요청들
  getRecentRequests: (days = 7, limit = 50): Promise<PurchaseRequest[]> =>
    apiRequest.get('/purchase-requests/recent', { days, limit }),

  // Excel 내보내기
  exportRequests: async (filters?: SearchFilters): Promise<void> => {
    try {
      const blob = await apiRequest.download('/purchase-requests/export/excel', filters);
      
      // 파일 다운로드
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
      console.error('Excel export error:', error);
      throw new Error('Excel 파일 다운로드에 실패했습니다.');
    }
  },

  // Excel 일괄 업로드
  uploadExcel: async (file: File): Promise<{
    message: string;
    created_count: number;
    request_numbers: string[];
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post('/purchase-requests/bulk-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 1분 타임아웃
      });
      return response.data;
    } catch (error: any) {
      console.error('Excel upload error:', error);
      throw new Error(
        error.response?.data?.detail || 
        'Excel 파일 업로드에 실패했습니다.'
      );
    }
  },

  // 업로드 템플릿 다운로드
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
      console.error('Template download error:', error);
      throw new Error('템플릿 다운로드에 실패했습니다.');
    }
  },
};

// ==================== 재고 관리 API ====================
export const inventoryApi = {
  getItems: (params?: {
    skip?: number;
    limit?: number;
    search?: string;
    category?: string;
    is_active?: boolean;
  }): Promise<any> => {
    return apiRequest.get('/inventory/', params);
  },

  getItem: (itemId: number): Promise<any> =>
    apiRequest.get(`/inventory/${itemId}`),

  getItemByCode: (itemCode: string): Promise<any> =>
    apiRequest.get(`/inventory/code/${itemCode}`),

  createItem: (data: any): Promise<any> =>
    apiRequest.post('/inventory/', data),

  updateItem: (itemId: number, data: any): Promise<any> =>
    apiRequest.put(`/inventory/${itemId}`, data),

  deleteItem: (itemId: number): Promise<any> =>
    apiRequest.delete(`/inventory/${itemId}`),

  getStats: (): Promise<any> =>
    apiRequest.get('/inventory/stats'),

  getCategories: (): Promise<string[]> =>
    apiRequest.get('/inventory/categories'),

  getLowStockItems: (params?: { skip?: number; limit?: number }): Promise<any[]> =>
    apiRequest.get('/inventory/low-stock', params),

  getOutOfStockItems: (params?: { skip?: number; limit?: number }): Promise<any[]> =>
    apiRequest.get('/inventory/out-of-stock', params),

  updateStock: (itemId: number, data: { quantity: number; reason?: string }): Promise<any> =>
    apiRequest.patch(`/inventory/${itemId}/stock`, data),

  exportData: async (type: string): Promise<void> => {
    try {
      // 백엔드에 Excel 내보내기 API가 구현되면 사용
      // const blob = await apiRequest.download(`/inventory/export/${type}`);
      
      // 임시로 클라이언트에서 Excel 생성
      const { ExcelExportService } = await import('./excelExport');
      
      // 데이터 가져오기
      const response = await inventoryApi.getItems({ limit: 1000 });
      ExcelExportService.exportInventory(response.items || [], `재고목록_${type}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
      throw new Error('Excel 파일 생성에 실패했습니다.');
    }
  },
};

// ==================== 업로드 API ====================
export const uploadApi = {
  uploadExcel: (file: File): Promise<{ message: string; items_created: number }> => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload/excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  uploadMultiple: (files: File[]): Promise<{ message: string; uploaded_files: string[] }> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    return api.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  downloadTemplate: (): Promise<Blob> =>
    apiRequest.download('/upload/template'),

  getUploadInfo: (): Promise<any> =>
    apiRequest.get('/upload/'),
};

// ==================== 기타 API ====================
export const receiptApi = {
  getReceipts: (page = 1, limit = 20): Promise<any> => {
    console.warn('⚠️ 수령 관리 API가 백엔드에 구현되지 않았습니다.');
    return Promise.resolve({
      data: {
        items: [],
        total: 0,
        page,
        size: limit,
        pages: 0,
      }
    });
  },

  createReceipt: (data: any): Promise<any> => {
    console.warn('⚠️ 수령 처리 API가 백엔드에 구현되지 않았습니다.');
    return Promise.resolve({ success: true, data: null });
  },

  exportReceipts: async (): Promise<void> => {
    const { ExcelExportService } = await import('./excelExport');
    const response = await receiptApi.getReceipts(1, 1000);
    ExcelExportService.exportReceipts(response.data?.items || []);
  },
};

export const kakaoApi = {
  parseMessage: (message: string): Promise<any> => {
    console.warn('⚠️ 카카오톡 메시지 파싱 API가 백엔드에 구현되지 않았습니다.');
    return Promise.resolve({ success: true, data: null });
  },
};

export const statisticsApi = {
  getStats: (): Promise<any> => {
    console.warn('⚠️ 통계 API가 백엔드에 구현되지 않았습니다.');
    return Promise.resolve({ success: true, data: {} });
  },
};

export const logsApi = {
  getLogs: (page = 1, limit = 50): Promise<any> => {
    console.warn('⚠️ 시스템 로그 API가 백엔드에 구현되지 않았습니다.');
    return Promise.resolve({
      success: true,
      data: {
        items: [],
        total: 0,
        page,
        size: limit,
        pages: 0,
      }
    });
  },
};

// ==================== 유틸리티 함수들 ====================
export const apiUtils = {
  setAuthToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },

  removeAuthToken: () => {
    localStorage.removeItem('auth_token');
  },

  getAuthToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  getBaseUrl: (): string => {
    return api.defaults.baseURL || '';
  },

  checkConnection: async (): Promise<boolean> => {
    try {
      await api.get('/health');
      return true;
    } catch {
      return false;
    }
  },

  checkRoot: async (): Promise<any> => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// 기본 export
export default {
  dashboard: dashboardApi,
  purchase: purchaseApi,
  inventory: inventoryApi,
  upload: uploadApi,
  receipt: receiptApi,
  kakao: kakaoApi,
  statistics: statisticsApi,
  logs: logsApi,
  utils: apiUtils,
};

// Named exports for convenience
export { SearchFilters };