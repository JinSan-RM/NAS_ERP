// client/src/services/api.ts
import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  PurchaseRequest, 
  InventoryItem, 
  Receipt, 
  SearchFilters,
  PurchaseRequestFormData,
  DashboardStats 
} from '../types';

// Axios 인스턴스 생성
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 요청 인터셉터
  instance.interceptors.request.use(
    (config) => {
      // JWT 토큰이 있다면 헤더에 추가
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // 요청 로깅 (개발 환경에서만)
      if (import.meta.env.DEV) {
        console.log('API Request:', {
          method: config.method?.toUpperCase(),
          url: config.url,
          data: config.data,
        });
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // 응답 로깅 (개발 환경에서만)
      if (import.meta.env.DEV) {
        console.log('API Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
      }
      
      return response;
    },
    (error: AxiosError) => {
      // 에러 로깅
      console.error('API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        data: error.response?.data,
      });

      // 인증 에러 처리
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

// 공통 API 함수들
const apiRequest = {
  get: <T>(url: string, params?: any): Promise<ApiResponse<T>> =>
    api.get(url, { params }).then(res => res.data),
    
  post: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.post(url, data).then(res => res.data),
    
  put: <T>(url: string, data?: any): Promise<ApiResponse<T>> =>
    api.put(url, data).then(res => res.data),
    
  delete: <T>(url: string): Promise<ApiResponse<T>> =>
    api.delete(url).then(res => res.data),
    
  // 파일 다운로드용
  download: (url: string, params?: any): Promise<Blob> =>
    api.get(url, { 
      params,
      responseType: 'blob' 
    }).then(res => res.data),
};

// ==================== 대시보드 API ====================
export const dashboardApi = {
  getStats: (): Promise<ApiResponse<DashboardStats>> =>
    apiRequest.get('/dashboard'),
};

// ==================== 구매 요청 API ====================
export const purchaseApi = {
  // 구매 요청 목록 조회
  getRequests: (page = 1, limit = 20, filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<PurchaseRequest>>> =>
    apiRequest.get('/purchase-requests', { page, limit, ...filters }),

  // 내 구매 요청 목록
  getMyRequests: (page = 1, limit = 20, filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<PurchaseRequest>>> =>
    apiRequest.get('/purchase-requests/my-requests', { page, limit, ...filters }),

  // 승인 대기 요청 목록
  getPendingRequests: (page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<PurchaseRequest>>> =>
    apiRequest.get('/purchase-requests/pending-approvals', { page, limit }),

  // 특정 구매 요청 조회
  getRequest: (id: number): Promise<ApiResponse<PurchaseRequest>> =>
    apiRequest.get(`/purchase-requests/${id}`),

  // 구매 요청 생성
  createRequest: (data: PurchaseRequestFormData): Promise<ApiResponse<PurchaseRequest>> =>
    apiRequest.post('/purchase-requests', data),

  // 구매 요청 수정
  updateRequest: (id: number, data: Partial<PurchaseRequestFormData>): Promise<ApiResponse<PurchaseRequest>> =>
    apiRequest.put(`/purchase-requests/${id}`, data),

  // 구매 요청 삭제
  deleteRequest: (id: number): Promise<ApiResponse<void>> =>
    apiRequest.delete(`/purchase-requests/${id}`),

  // 구매 요청 승인/거절
  approveRequest: (params: { requestId: number; action: 'approve' | 'reject'; comments?: string }): Promise<ApiResponse<PurchaseRequest>> =>
    apiRequest.post(`/purchase-requests/${params.requestId}/approve`, {
      action: params.action,
      comments: params.comments,
    }),

  // 구매 요청 복사
  duplicateRequest: (id: number): Promise<ApiResponse<PurchaseRequest>> =>
    apiRequest.post(`/purchase-requests/${id}/duplicate`),

  // 일괄 승인/거절
  bulkApprove: (requestIds: number[], action: 'approve' | 'reject', comments?: string): Promise<ApiResponse<void>> =>
    apiRequest.post('/purchase-requests/bulk/approve', { requestIds, action, comments }),

  // 구매 요청 통계
  getStats: (filters?: { department?: string; dateFrom?: string; dateTo?: string }): Promise<ApiResponse<any>> =>
    apiRequest.get('/purchase-requests/stats', filters),

  // Excel 내보내기
  exportRequests: (filters?: SearchFilters): Promise<Blob> =>
    apiRequest.download('/purchase-requests/export/excel', filters),
};

// ==================== 재고 관리 API ====================
export const inventoryApi = {
  // 품목 목록 조회
  getItems: (page = 1, limit = 20, filters?: SearchFilters): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> =>
    apiRequest.get('/inventory', { page, limit, ...filters }),

  // 특정 품목 조회
  getItem: (no: number): Promise<ApiResponse<InventoryItem>> =>
    apiRequest.get(`/inventory/${no}`),

  // 품목 생성
  createItem: (data: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> =>
    apiRequest.post('/inventory', data),

  // 품목 수정
  updateItem: (no: number, data: Partial<InventoryItem>): Promise<ApiResponse<InventoryItem>> =>
    apiRequest.put(`/inventory/${no}`, data),

  // 품목 삭제
  deleteItem: (no: number): Promise<ApiResponse<void>> =>
    apiRequest.delete(`/inventory/${no}`),

  // 품목 상태 업데이트
  updateItemStatus: (no: number, status: string, receivedDate?: string): Promise<ApiResponse<InventoryItem>> =>
    apiRequest.put(`/inventory/${no}/status`, { status, receivedDate }),

  // 공급업체 목록
  getSuppliers: (): Promise<ApiResponse<string[]>> =>
    apiRequest.get('/inventory/suppliers'),

  // 품목 검색 자동완성
  searchItems: (query: string, limit = 10): Promise<ApiResponse<InventoryItem[]>> =>
    apiRequest.get('/inventory/search', { q: query, limit }),

  // 재고 부족 품목
  getLowStockItems: (threshold = 5): Promise<ApiResponse<InventoryItem[]>> =>
    apiRequest.get('/inventory/low-stock', { threshold }),

  // Excel 내보내기
  exportData: (type: string): Promise<Blob> =>
    apiRequest.download(`/export/${type}`),
};

// ==================== 수령 관리 API ====================
export const receiptApi = {
  // 수령 내역 목록
  getReceipts: (page = 1, limit = 20): Promise<ApiResponse<PaginatedResponse<Receipt>>> =>
    apiRequest.get('/receipts', { page, limit }),

  // 수령 처리
  createReceipt: (data: {
    itemNo: number;
    receivedQuantity: number;
    receiverName: string;
    notes?: string;
  }): Promise<ApiResponse<Receipt>> =>
    apiRequest.post('/receipts', data),

  // Excel 내보내기
  exportReceipts: (): Promise<Blob> =>
    apiRequest.download('/receipts/export'),
};

// ==================== 파일 업로드 API ====================
export const uploadApi = {
  // Excel 파일 업로드
  uploadExcel: (file: File): Promise<ApiResponse<{ itemCount: number }>> => {
    const formData = new FormData();
    formData.append('excelFile', file);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // 첨부파일 업로드
  uploadFile: (file: File, type?: string): Promise<ApiResponse<{ url: string; filename: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    if (type) formData.append('type', type);
    
    return api.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },
};

// ==================== 카카오톡 메시지 파싱 API ====================
export const kakaoApi = {
  // 메시지 파싱
  parseMessage: (message: string): Promise<ApiResponse<{
    itemNo?: number;
    itemName?: string;
    quantity?: number;
    receiver?: string;
    notes?: string;
  }>> =>
    apiRequest.post('/kakao/parse', { message }),
};

// ==================== 통계 API ====================
export const statisticsApi = {
  // 전체 통계
  getStats: (): Promise<ApiResponse<any>> =>
    apiRequest.get('/statistics'),

  // 월별 통계
  getMonthlyStats: (year?: number): Promise<ApiResponse<any>> =>
    apiRequest.get('/statistics/monthly', { year }),

  // 공급업체별 통계
  getSupplierStats: (): Promise<ApiResponse<any>> =>
    apiRequest.get('/statistics/suppliers'),

  // 부서별 통계
  getDepartmentStats: (): Promise<ApiResponse<any>> =>
    apiRequest.get('/statistics/departments'),
};

// ==================== 시스템 로그 API ====================
export const logsApi = {
  // 시스템 로그 조회
  getLogs: (page = 1, limit = 50): Promise<ApiResponse<PaginatedResponse<any>>> =>
    apiRequest.get('/logs', { page, limit }),
};

// ==================== 인증 API ====================
export const authApi = {
  // 로그인
  login: (email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> =>
    apiRequest.post('/auth/login', { email, password }),

  // 로그아웃
  logout: (): Promise<ApiResponse<void>> =>
    apiRequest.post('/auth/logout'),

  // 현재 사용자 정보
  getCurrentUser: (): Promise<ApiResponse<any>> =>
    apiRequest.get('/auth/me'),

  // 토큰 새로고침
  refreshToken: (): Promise<ApiResponse<{ token: string }>> =>
    apiRequest.post('/auth/refresh'),
};

// ==================== 유틸리티 함수들 ====================
export const apiUtils = {
  // 토큰 설정
  setAuthToken: (token: string) => {
    localStorage.setItem('auth_token', token);
  },

  // 토큰 제거
  removeAuthToken: () => {
    localStorage.removeItem('auth_token');
  },

  // 토큰 가져오기
  getAuthToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  // API 베이스 URL 가져오기
  getBaseUrl: (): string => {
    return api.defaults.baseURL || '';
  },
};

// 기본 export
export default {
  dashboard: dashboardApi,
  purchase: purchaseApi,
  inventory: inventoryApi,
  receipt: receiptApi,
  upload: uploadApi,
  kakao: kakaoApi,
  statistics: statisticsApi,
  logs: logsApi,
  auth: authApi,
  utils: apiUtils,
};