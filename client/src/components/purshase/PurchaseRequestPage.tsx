// client/src/components/purchase/PurchaseRequestPage.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Download, 
  RefreshCw, 
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle,
  FileText,
  Upload,
  Filter
} from 'lucide-react';

// Components
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';
import PurchaseRequestForm from './PurchaseRequestForm';
import ExcelBulkUpload from './ExcelBulkUpload';
import PurchaseRequestFilters from './PurchaseRequestFilters';
import RequestDetailModal from './RequestDetailModal';
import { useNavigate } from 'react-router-dom';
import { Package2, CheckCircle2 } from 'lucide-react';

// Services
import { purchaseApi, inventoryApi, SearchFilters } from '../../services/api';

// Types
interface PurchaseRequest {
  id: number;
  itemName: string;
  quantity: number;
  requestedBy: string;
  department: string;
  urgency: string;
  status: string;
  requestDate: string;
  reason: string;
  estimatedPrice?: number;
  supplier?: string;
  notes?: string;
  inventory_item_id?: number;
}

interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, item: T) => React.ReactNode;
}

type RequestStatus = 'all' | 'pending' | 'approved' | 'rejected' | 'in_review';
type UrgencyLevel = 'all' | 'low' | 'normal' | 'high' | 'urgent';

// Styled Components
const Container = styled.div`
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: #1f2937;
`;

const PageSubtitle = styled.p`
  color: #6b7280;
  margin-bottom: 0;
  font-size: 1rem;
  line-height: 1.5;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }
`;

const StatCard = styled(Card)<{ $color?: string }>`
  text-align: center;
  background: ${props => props.$color ? `linear-gradient(135deg, ${props.$color}15 0%, ${props.$color}08 100%)` : 'white'};
  border-left: 4px solid ${props => props.$color || '#3b82f6'};
  padding: 24px 20px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 16px;
    color: ${props => props.$color || '#3b82f6'};
    font-weight: 500;
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 8px;
    color: ${props => props.$color || '#3b82f6'};
    line-height: 1;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 12px;
  }
  
  .stat-change {
    font-size: 0.75rem;
    padding: 4px 8px;
    border-radius: 12px;
    font-weight: 500;
    display: inline-block;
    
    &.positive {
      background: #10b98120;
      color: #10b981;
    }
    
    &.negative {
      background: #ef444420;
      color: #ef4444;
    }
  }
`;

const ContentCard = styled(Card)`
  padding: 0;
  overflow: hidden;
`;

const FilterSection = styled.div`
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  justify-content: space-between;
  
  @media (max-width: 1024px) {
    flex-direction: column;
    gap: 16px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
  
  @media (max-width: 1024px) {
    width: 100%;
    justify-content: flex-end;
  }
  
  @media (max-width: 768px) {
    justify-content: stretch;
    
    > button {
      flex: 1;
      min-width: 0;
      
      span {
        display: none;
      }
      
      svg {
        margin: 0;
      }
    }
  }
`;

const TableContainer = styled.div`
  padding: 24px;
`;

const StatusBadge = styled.span<{ $status: string }>`
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.$status) {
      case 'pending':
        return `
          background: #fef3c7;
          color: #92400e;
        `;
      case 'approved':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      case 'rejected':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'in_review':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const UrgencyBadge = styled.span<{ $urgency: string }>`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.$urgency) {
      case 'urgent':
        return `
          background: #fee2e2;
          color: #991b1b;
        `;
      case 'high':
        return `
          background: #fed7aa;
          color: #9a3412;
        `;
      case 'normal':
        return `
          background: #dbeafe;
          color: #1e40af;
        `;
      case 'low':
        return `
          background: #d1fae5;
          color: #065f46;
        `;
      default:
        return `
          background: #f3f4f6;
          color: #374151;
        `;
    }
  }}
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 2px;
  align-items: center;
  justify-content: center;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s ease;
  min-width: 32px;
  height: 32px;
  
  &:hover {
    background: #f3f4f6;
    color: #374151;
  }
  
  &:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }
  
  &.edit:hover {
    background: #dbeafe;
    color: #1d4ed8;
  }
  
  &.delete:hover {
    background: #fee2e2;
    color: #dc2626;
  }
  
  &.view:hover {
    background: #f0fdf4;
    color: #16a34a;
  }
  &.receipt:hover {
    background: #059669 !important;
    transform: scale(1.05);
  }
  
  &.receipt {
    animation: pulse-green 2s infinite;
  }
  
  @keyframes pulse-green {
    0%, 100% { 
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); 
    }
    50% { 
      box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.3); 
    }
  }
  
  svg {
    flex-shrink: 0;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .error-icon {
    color: #ef4444;
    margin-bottom: 16px;
  }
  
  .error-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #1f2937;
  }
  
  .error-message {
    color: #6b7280;
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  
  .empty-icon {
    margin-bottom: 16px;
    color: #d1d5db;
  }
  
  .empty-title {
    font-size: 1.125rem;
    font-weight: 500;
    margin-bottom: 8px;
    color: #374151;
  }
  
  .empty-message {
    margin-bottom: 24px;
    line-height: 1.6;
  }
`;
const ConfirmDialog = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ConfirmContent = styled.div`
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 90%;
  text-align: center;
  
  .confirm-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #10b981, #059669);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    color: white;
  }
  
  .confirm-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: #1f2937;
  }
  
  .confirm-message {
    color: #6b7280;
    margin-bottom: 8px;
    line-height: 1.5;
  }
  
  .item-info {
    background: #f9fafb;
    padding: 16px;
    border-radius: 8px;
    margin: 20px 0;
    text-align: left;
    
    .info-row {
      display: flex;
      justify-content: between;
      margin-bottom: 8px;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .label {
        font-weight: 500;
        color: #6b7280;
        min-width: 80px;
      }
      
      .value {
        font-weight: 600;
        color: #1f2937;
        flex: 1;
      }
    }
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 24px;
  }
`;
const shimmerAnimation = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  .receipt {
    position: relative;
    overflow: hidden;
  }
  
  .receipt::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: shimmer 2s infinite;
  }
`;

// 메인 컴포넌트
const PurchaseRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<PurchaseRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [confirmingItem, setConfirmingItem] = useState<PurchaseRequest | null>(null);


  // 구매 요청 목록 조회
  const { 
    data: requestsData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['purchase-requests', currentPage, filters],
    queryFn: () => purchaseApi.getRequests({ page: currentPage, limit: 20, ...filters }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // 통계 데이터 조회
  const { data: statsData } = useQuery({
    queryKey: ['purchase-requests-stats'],
    queryFn: () => purchaseApi.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  // Export Mutation
  const exportMutation = useMutation({
    mutationFn: () => purchaseApi.exportRequests(filters),
    onSuccess: () => {
      toast.success('Excel 파일이 다운로드되었습니다.');
    },
    onError: (error) => {
      console.error('Export error:', error);
      toast.error('Excel 다운로드에 실패했습니다.');
    },
  });

  // 삭제 Mutation
  const deleteMutation = useMutation({
    mutationFn: purchaseApi.deleteRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] });
      toast.success('구매 요청이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    },
  });
  const completePurchaseMutation = useMutation({
    mutationFn: async ({ requestId, completionData }: { 
      requestId: number; 
      completionData: any 
    }) => {
      console.log('🚀 구매완료 처리 시작:', { requestId, completionData });
      
      const result = await purchaseApi.completePurchase(requestId, completionData);
      console.log('✅ API 응답:', result);
      
      return result;
    },
    onSuccess: (result, variables) => {
      console.log('🎉 구매완료 처리 성공:', result);
      
      // 즉시 상태 업데이트
      queryClient.setQueryData(['purchase-requests', currentPage, filters], (oldData: any) => {
        if (!oldData?.data?.items) return oldData;
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map((item: any) => {
              if (item.id === variables.requestId) {
                return {
                  ...item,
                  status: 'COMPLETED',
                  inventory_item_id: result.inventory_item_id,
                };
              }
              return item;
            })
          }
        };
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
        refetch(); // 강제로 다시 불러오기
      }, 500);
      
      // 성공 메시지
      if (result.inventory_item_code) {
        toast.success(
          `🎉 구매완료! 품목코드: ${result.inventory_item_code}로 등록되었습니다.`,
          { autoClose: 5000, position: 'top-center' }
        );
      } else {
        toast.success('✅ 구매요청이 완료되었습니다.');
      }
      
      // 쿼리 새로고침
      queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      
      setConfirmingItem(null);
      
      // 품목 페이지로 이동
      if (result.inventory_item_id) {
        setTimeout(() => {
          navigate(`/inventory?highlight=${result.inventory_item_id}`);
        }, 2000);
      }
    },
    onError: (error: any) => {
      console.error('❌ 구매완료 처리 실패:', error);
      
      let errorMessage = '구매완료 처리 중 오류가 발생했습니다.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        autoClose: 7000,
        position: 'top-center'
      });
      
      setConfirmingItem(null);
    },
  });

  // 테이블 컬럼 정의
  // 테이블 컬럼 정의 수정
const columns: TableColumn<PurchaseRequest>[] = useMemo(() => [
    {
      key: 'id',
      label: '번호',
      sortable: true,
      width: '80px',
      render: (value) => `#${value}`,
    },
    {
      key: 'item_name', // 백엔드 필드명과 일치
      label: '품목명',
      sortable: true,
      width: '200px',
      render: (value) => (
        <div style={{ fontWeight: '500', color: '#1f2937' }}>
          {value || '품목명 없음'}
        </div>
      ),
    },
    {
      key: 'quantity',
      label: '수량',
      width: '80px',
      render: (value) => (
        <div style={{ textAlign: 'center', fontWeight: '500' }}>
          {value?.toLocaleString() || '0'}
        </div>
      ),
    },
    {
      key: 'requester_name', // 백엔드 필드명과 일치
      label: '요청자',
      width: '120px',
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: '500' }}>{value}</div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{item.department}</div>
        </div>
      ),
    },
    {
      key: 'urgency',
      label: '긴급도',
      width: '100px',
      render: (value) => {
        const urgencyMap: Record<string, string> = {
          'low': '낮음',
          'normal': '보통',
          'high': '높음', 
          'urgent': '긴급',
          'emergency': '응급'
        };
        return <UrgencyBadge $urgency={value}>{urgencyMap[value] || value}</UrgencyBadge>;
      },
    },
    {
      key: 'status',
      label: '상태',
      width: '120px',
      render: (value) => {
        const statusMap: Record<string, string> = {
          'SUBMITTED': '요청됨',
          'COMPLETED': '구매완료', 
          'cancCANCELLEDelled': '취소됨'
        };
        return <StatusBadge $status={value}>{statusMap[value] || value}</StatusBadge>;
      },
    },
    {
      key: 'created_at', // 백엔드 필드명과 일치
      label: '요청일',
      sortable: true,
      width: '120px',
      render: (value) => value ? new Date(value).toLocaleDateString('ko-KR') : '-',
    },
    {
      key: 'total_budget', // 백엔드 필드명과 일치
      label: '예상금액',
      width: '120px',
      render: (value) => value ? `${value.toLocaleString()}원` : '-',
    },
    {
      key: 'actions',
      label: '작업',
      width: '160px', // 폭을 늘림
      render: (_, item) => (
        <ActionButtonGroup>
          <IconButton 
            className="view"
            onClick={() => handleView(item)}
            title="상세보기"
          >
            <Eye size={14} />
          </IconButton>
          <IconButton 
              className="delete"
              onClick={() => handleDelete(item.id)}
              title="삭제"
            >
              <Trash2 size={14} />
            </IconButton>
          
          {/* {item.status === 'SUBMITTED' && (
            <IconButton 
              className="complete"
              onClick={() => handlePurchaseComplete(item)}
              title="구매완료 & 품목등록"
            >
              <CheckCircle2 size={14} />
            </IconButton>
          )} */}
          
          {/* 🔥 완료된 상태 표시 */}
          {item.status !== 'COMPLETED' && (
            <IconButton 
              className="completed"
              title="구매완료됨 (품목관리에서 확인)"
              disabled
            >
              <Check size={14} />
            </IconButton>
          )}
          
          {/* 편집 가능한 상태일 때만 수정 버튼 표시 */}

            <IconButton 
              className="edit"
              onClick={() => handleEdit(item)}
              title="수정"
            >
              <Edit size={14} />
            </IconButton>
          {item.status === 'COMPLETED' && (
            <IconButton 
              className="receipt"
              onClick={() => handlePurchaseComplete(item)}
              title="구매완료"
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '6px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <CheckCircle2 size={14} />
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.3) 50%, transparent 70%)',
                animation: 'shimmer 2s infinite'
              }} />
            </IconButton>
          )}
          
        </ActionButtonGroup>
      ),
    },
  ], []);

  // 이벤트 핸들러
  const handleView = (request: PurchaseRequest) => {
    console.log('상세보기 데이터:', request); // 디버깅용
    setViewingRequest(request);
    setIsDetailModalOpen(true);
  };

  const handleEdit = (request: PurchaseRequest) => {
    setEditingRequest(request);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (requestId: number) => {
    if (window.confirm('정말로 이 구매 요청을 삭제하시겠습니까?')) {
      deleteMutation.mutate(requestId);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
    queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] });
    refetch();
  };

  const handleFilterChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // 필터 변경시 첫 페이지로 이동
  };

  const handleFormSuccess = () => {
    setIsFormModalOpen(false);
    setEditingRequest(null);
    handleRefresh();
  };

  const handleFormCancel = () => {
    setIsFormModalOpen(false);
    setEditingRequest(null);
  };

  const handleExcelSuccess = () => {
    setIsExcelModalOpen(false);
    handleRefresh();
  };

  // 3. 🔥 수령완료 처리 함수 추가
  const handleReceiptComplete = (request: PurchaseRequest) => {
    setConfirmingItem(request);
  };

  // 4. 실제 수령완료 처리 함수
  // 🔥 개선된 구매완료 처리 함수
  const confirmReceiptComplete = async () => {
    if (!confirmingItem) return;
    
    try {
      console.log('🚀 구매 완료 처리 시작:', confirmingItem);
      
      // 완료 데이터 준비
      const completionData = {
        received_quantity: Number(confirmingItem.quantity) || 1,
        receiver_name: confirmingItem.requester_name || '시스템',
        receiver_email: confirmingItem.requester_email || '',
        location: '창고',
        warehouse: '메인창고',
        condition: 'good',
        notes: `구매요청 #${confirmingItem.id}에서 자동 완료 처리`,
        completed_by: '현재사용자',
        received_date: new Date().toISOString(),
        unit_price: Number(confirmingItem.estimated_unit_price) || 0,
        specifications: confirmingItem.specifications || '',
        supplier_name: confirmingItem.preferred_supplier || ''
      };

      console.log('📤 전송 데이터:', completionData);
      
      // API 호출
      const completionResult = await purchaseApi.completePurchase(confirmingItem.id, completionData);
      console.log('✅ API 응답:', completionResult);
      
      // 성공 처리
      if (completionResult?.success) {
        const successMessage = completionResult.inventory_item_code 
          ? `🎉 구매가 완료되어 품목관리에 등록되었습니다!\n품목코드: ${completionResult.inventory_item_code}`
          : '🎉 구매가 완료되어 품목관리에 등록되었습니다!';
        
        toast.success(successMessage, { 
          autoClose: 5000,
          position: 'top-center'
        });
        
        // 쿼리 새로고침
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['purchase-requests'] }),
          queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] }),
          queryClient.invalidateQueries({ queryKey: ['inventory'] }),
          queryClient.invalidateQueries({ queryKey: ['inventory-stats'] })
        ]);
        
        setConfirmingItem(null);
        
        // 페이지 이동
        if (completionResult.inventory_item_id) {
          setTimeout(() => {
            navigate(`/inventory?highlight=${completionResult.inventory_item_id}`);
          }, 1500);
        }
        
      } else {
        throw new Error(completionResult?.message || '구매완료 처리에 실패했습니다.');
      }
      
    } catch (error) {
      console.error('❌ 구매완료 처리 실패:', error);
      
      // 에러 메시지 추출
      let errorMessage = '구매완료 처리 중 오류가 발생했습니다.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, {
        autoClose: 7000,
        position: 'top-center'
      });
    }
  };
  // API 호출 함수도 개선 (api.ts에 추가)
  completePurchase: async (requestId: number, completionData: any) => {
    console.log(`📡 구매완료 API 호출: /purchase-requests/${requestId}/complete`);
    console.log('📤 요청 데이터:', completionData);
    
    try {
      const response = await api.post(`/purchase-requests/${requestId}/complete`, completionData);
      console.log('📥 응답 데이터:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
      
      // 상세 에러 로깅
      if (error.response) {
        console.error('응답 상태:', error.response.status);
        console.error('응답 데이터:', error.response.data);
      }
      
      throw error;
    }
  }
  const handlePurchaseComplete = (request: PurchaseRequest) => {
    // 🔥 테스트: 즉시 상태 변경
    queryClient.setQueryData(['purchase-requests', currentPage, filters], (oldData: any) => {
      if (!oldData?.data?.items) return oldData;
      
      return {
        ...oldData,
        data: {
          ...oldData.data,
          items: oldData.data.items.map((item: any) => {
            if (item.id === request.id) {
              return {
                ...item,
                status: 'COMPLETED',
                inventory_item_id: 999 // 임시 값
              };
            }
            return item;
          })
        }
      };
    });
    
    setConfirmingItem(request);
  };

  const confirmPurchaseComplete = () => {
    if (!confirmingItem) return;
    
    // 구매완료 데이터 준비
    const completionData = {
      received_quantity: Number(confirmingItem.quantity) || 1,
      receiver_name: confirmingItem.requester_name || '시스템',
      receiver_email: confirmingItem.requester_email || '',
      department: confirmingItem.department,
      location: '창고',
      warehouse: '메인창고',
      condition: 'good',
      notes: `구매요청 #${confirmingItem.id}에서 자동 완료 처리`,
      completed_by: '현재사용자',
      received_date: new Date().toISOString(),
      unit_price: Number(confirmingItem.estimated_unit_price) || 0,
      specifications: confirmingItem.specifications || '',
      supplier_name: confirmingItem.preferred_supplier || ''
    };

    completePurchaseMutation.mutate({
      requestId: confirmingItem.id,
      completionData
    });
  };

  const cancelPurchaseComplete = () => {
    setConfirmingItem(null);
  };

  // 추가: 백업 구매완료 처리 함수 (API 실패 시 대안)
  const fallbackReceiptComplete = async (item: PurchaseRequest) => {
    try {
      console.log('🔄 백업 구매완료 처리 시작');
      
      // 1. 구매 요청 상태만 업데이트
      await purchaseApi.updateRequest(item.id, { 
        status: 'COMPLETED',
        completed_date: new Date().toISOString(),
        completed_by: '현재사용자'
      });
      
      toast.success('구매 요청이 완료 처리되었습니다. (품목 등록은 수동으로 진행해주세요)');
      
      // 쿼리 새로고침
      queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] });
      
      setConfirmingItem(null);
      
    } catch (error) {
      console.error('백업 처리도 실패:', error);
      toast.error('구매완료 처리에 실패했습니다. 관리자에게 문의하세요.');
    }
  };
//   const confirmReceiptComplete = async () => {
//   if (!confirmingItem) return;
  
//   try {
//     // 1. 🔥 구매 요청 데이터를 품목관리용 데이터로 변환
//     const inventoryData = {
//       item_code: `ITM-${Date.now()}`,
//       item_name: confirmingItem.item_name || '품목명 없음',
//       category: confirmingItem.category || 'OTHER',
//       description: confirmingItem.specifications || '',
//       current_stock: Number(confirmingItem.quantity) || 0,
//       minimum_stock: Math.max(1, Math.ceil((Number(confirmingItem.quantity) || 0) * 0.2)),
//       maximum_stock: (Number(confirmingItem.quantity) || 0) * 2,
//       unit: confirmingItem.unit || '개',
//       unit_price: Number(confirmingItem.estimated_unit_price) || 0,
//       currency: confirmingItem.currency || 'KRW',
//       supplier_name: confirmingItem.preferred_supplier || '',
//       location: '창고',
//       warehouse: '메인창고',
//       purchase_request_id: confirmingItem.id,
//       notes: `구매요청 #${confirmingItem.id}에서 자동 생성됨`,
//       is_active: true
//     };

//     // 2. 품목 추가 (에러가 나도 계속 진행)
//     try {
//       const inventoryResponse = await fetch('http://localhost:8000/api/v1/inventory/', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(inventoryData)
//       });

//       if (inventoryResponse.ok) {
//         const inventoryResult = await inventoryResponse.json();
//         console.log('품목 추가 성공:', inventoryResult);
//         toast.success('품목이 재고관리에 추가되었습니다!');
//       } else {
//         console.warn('품목 추가 실패, 상태 업데이트는 계속 진행');
//       }
//     } catch (inventoryError) {
//       console.warn('품목 추가 실패:', inventoryError);
//       toast.warning('품목 추가 중 문제가 있었지만 구매는 완료됩니다.');
//     }

//     // 3. 구매 요청 상태를 'COMPLETED'로 업데이트
//     await purchaseApi.updateRequest(confirmingItem.id, { 
//       status: 'COMPLETED',
//       completed_date: new Date().toISOString(),
//       completed_by: '현재사용자' // 실제로는 로그인한 사용자 정보
//     });

//     toast.success('🎉 구매가 완료되어 품목관리에 등록되었습니다!');
    
//     // 4. 쿼리 새로고침 (에러 방지)
//     try {
//       queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
//       queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] });
//       queryClient.invalidateQueries({ queryKey: ['inventory'] });
//       queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
//     } catch (queryError) {
//       console.warn('쿼리 새로고침 실패:', queryError);
//     }
//     setConfirmingItem(null);
    
//     // 5. 1.5초 후 품목관리 페이지로 이동
//     // 5. 안전한 페이지 이동
//     try {
//       setTimeout(() => {
//         navigate('/inventory');
//       }, 1000); // 시간을 줄여서 더 빠르게
//     } catch (navigationError) {
//       console.error('페이지 이동 실패:', navigationError);
//       // 수동으로 이동
//       window.location.href = '/inventory';
//     }
    
//   } catch (error: any) {
//     console.error('구매완료 처리 실패:', error);
//     toast.error(error.response?.data?.message || '구매완료 처리 중 오류가 발생했습니다.');
//   }
// };
  // 5. 확인 다이얼로그 닫기
  const cancelReceiptComplete = () => {
    setConfirmingItem(null);
  };

  // 데이터 추출
  const requests = requestsData?.data?.items || [];
  const totalPages = requestsData?.data?.pages || 0;
  const totalItems = requestsData?.data?.total || 0;
  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    this_month: 0,
  };

  if (isLoading && !requestsData) {
    return <LoadingSpinner text="구매 요청 데이터를 불러오는 중..." />;
  }

  if (error) {
    console.error('Purchase requests error:', error);
    return (
      <Container>
        <PageHeader>
          <PageTitle>구매 요청 관리</PageTitle>
        </PageHeader>
        <Card>
          <ErrorContainer>
            <AlertCircle size={48} className="error-icon" />
            <div className="error-title">데이터를 불러올 수 없습니다</div>
            <div className="error-message">
              백엔드 서버가 실행되지 않았거나 구매 요청 API가 구현되지 않았습니다.
              <br />
              서버 상태를 확인해주세요.
            </div>
            <Button onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw size={16} />
              다시 시도
            </Button>
          </ErrorContainer>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <PageHeader>
        <PageTitle>구매 요청 관리</PageTitle>
        <PageSubtitle>
          구매 요청을 등록하고 승인 프로세스를 관리할 수 있습니다.
          {totalItems > 0 && ` 총 ${totalItems.toLocaleString()}건의 요청이 있습니다.`}
        </PageSubtitle>
      </PageHeader>

      {/* 통계 카드 */}
      <StatsContainer>
        <StatCard $color="#3b82f6">
          <div className="stat-header">
            <FileText size={24} />
            <span>전체 요청</span>
          </div>
          <div className="stat-value">{stats.total.toLocaleString()}</div>
          <div className="stat-label">총 구매 요청</div>
          {stats.thisMonth > 0 && (
            <div className="stat-change positive">
              이번 달 +{stats.thisMonth}
            </div>
          )}
        </StatCard>

        <StatCard $color="#f59e0b">
          <div className="stat-header">
            <Clock size={24} />
            <span>승인 대기</span>
          </div>
          <div className="stat-value">{stats.pending?.toLocaleString() || '0'}</div>
          <div className="stat-label">처리 대기중</div>
        </StatCard>

        <StatCard $color="#10b981">
          <div className="stat-header">
            <Check size={24} />
            <span>승인 완료</span>
          </div>
          <div className="stat-value">{stats.approved.toLocaleString()}</div>
          <div className="stat-label">승인된 요청</div>
        </StatCard>

        <StatCard $color="#ef4444">
          <div className="stat-header">
            <X size={24} />
            <span>거절됨</span>
          </div>
          <div className="stat-value">{stats.rejected.toLocaleString()}</div>
          <div className="stat-label">거절된 요청</div>
        </StatCard>
      </StatsContainer>

      <ContentCard>
        {/* 필터 섹션 */}
        <FilterSection>
          <FilterContainer>
            <PurchaseRequestFilters onFilter={handleFilterChange} />
            
            <ActionButtons>
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isLoading}
                size="sm"
                title="새로고침"
              >
                <RefreshCw size={16} />
                <span>새로고침</span>
              </Button>
              <Button
                variant="secondary"
                onClick={handleExport}
                disabled={exportMutation.isPending}
                loading={exportMutation.isPending}
                size="sm"
                title="Excel 다운로드"
              >
                <Download size={16} />
                <span>Excel 다운로드</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsExcelModalOpen(true)}
                size="sm"
                title="Excel 일괄 업로드"
              >
                <Upload size={16} />
                <span>Excel 업로드</span>
              </Button>
              <Button 
                onClick={() => setIsFormModalOpen(true)}
                size="sm"
                title="구매 요청 추가"
              >
                <Plus size={16} />
                <span>구매 요청</span>
              </Button>
            </ActionButtons>
          </FilterContainer>
        </FilterSection>

        {/* 테이블 컨테이너 */}
        <TableContainer>
          {requests.length === 0 && !isLoading ? (
            <EmptyState>
              <FileText size={48} className="empty-icon" />
              <div className="empty-title">등록된 구매 요청이 없습니다</div>
              <div className="empty-message">
                새로운 구매 요청을 등록하여 시작해보세요.
              </div>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <Button onClick={() => setIsFormModalOpen(true)}>
                  <Plus size={16} />
                  개별 등록
                </Button>
                <Button variant="outline" onClick={() => setIsExcelModalOpen(true)}>
                  <Upload size={16} />
                  Excel 업로드
                </Button>
              </div>
            </EmptyState>
          ) : (
            <>
              <Table
                columns={columns}
                data={requests}
                loading={isLoading}
                emptyMessage="검색 조건에 맞는 구매 요청이 없습니다."
              />

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </TableContainer>
      </ContentCard>

      {/* 구매 요청 등록/수정 모달 */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormCancel}
        title={editingRequest ? '구매 요청 수정' : '새 구매 요청 등록'}
        size="xl"
      >
        <PurchaseRequestForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          initialData={editingRequest || undefined}
          isEdit={!!editingRequest}
        />
      </Modal>

      {/* Excel 일괄 업로드 모달 */}
      <ExcelBulkUpload
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        onSuccess={handleExcelSuccess}
      />

      {/* 상세보기 모달 */}
      {viewingRequest && (
        <RequestDetailModal
          request={viewingRequest}
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setViewingRequest(null);
          }}
          onEdit={() => {
            setEditingRequest(viewingRequest);
            setIsFormModalOpen(true);
            setIsDetailModalOpen(false);
            setViewingRequest(null);
          }}
        />
      )}
      {/* 구매완료 확인 다이얼로그 */}
      {/* {confirmingItem && (
        <ConfirmDialog onClick={cancelReceiptComplete}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <CheckCircle2 size={32} />
            </div>
            
            <div className="confirm-title">구매완료 처리</div>
            
            <div className="confirm-message">
              아래 구매 요청을 완료 처리하시겠습니까?
            </div>
            <div className="confirm-message">
              완료 후 품목관리 페이지로 이동합니다.
            </div>
            
            <div className="item-info">
              <div className="info-row">
                <span className="label">품목명:</span>
                <span className="value">{confirmingItem.item_name}</span>
              </div>
              <div className="info-row">
                <span className="label">수량:</span>
                <span className="value">{confirmingItem.quantity} {confirmingItem.unit || '개'}</span>
              </div>
              <div className="info-row">
                <span className="label">요청자:</span>
                <span className="value">{confirmingItem.requester_name}</span>
              </div>
              <div className="info-row">
                <span className="label">부서:</span>
                <span className="value">{confirmingItem.department}</span>
              </div>
              {confirmingItem.total_budget && (
                <div className="info-row">
                  <span className="label">예산:</span>
                  <span className="value">{confirmingItem.total_budget.toLocaleString()}원</span>
                </div>
              )}
            </div>
            
            <div className="button-group">
              <Button 
                variant="outline" 
                onClick={cancelReceiptComplete}
                size="lg"
              >
                취소
              </Button>
              <Button 
                onClick={confirmReceiptComplete}
                size="lg"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none'
                }}
              >
                <CheckCircle2 size={18} />
                구매완료
              </Button>
            </div>
          </ConfirmContent>
        </ConfirmDialog>
      )} */}
      {confirmingItem && (
        <ConfirmDialog onClick={cancelPurchaseComplete}>
          <ConfirmContent onClick={(e) => e.stopPropagation()}>
            <div className="confirm-icon">
              <CheckCircle2 size={32} />
            </div>
            
            <div className="confirm-title">구매완료 처리</div>
            
            <div className="confirm-message">
              아래 구매 요청을 완료 처리하시겠습니까?
            </div>
            <div className="confirm-message" style={{ color: '#10b981', fontWeight: 'bold' }}>
              ✨ 완료 후 자동으로 품목관리에 등록되고 해당 페이지로 이동합니다.
            </div>
            
            <div className="item-info">
              <div className="info-row">
                <span className="label">품목명:</span>
                <span className="value">{confirmingItem.item_name}</span>
              </div>
              <div className="info-row">
                <span className="label">수량:</span>
                <span className="value">{confirmingItem.quantity} {confirmingItem.unit || '개'}</span>
              </div>
              <div className="info-row">
                <span className="label">요청자:</span>
                <span className="value">{confirmingItem.requester_name}</span>
              </div>
              <div className="info-row">
                <span className="label">부서:</span>
                <span className="value">{confirmingItem.department}</span>
              </div>
              {confirmingItem.total_budget && (
                <div className="info-row">
                  <span className="label">예산:</span>
                  <span className="value">{confirmingItem.total_budget.toLocaleString()}원</span>
                </div>
              )}
              <div className="info-row">
                <span className="label">생성될 품목코드:</span>
                <span className="value" style={{ color: '#3b82f6' }}>
                  ITM-{new Date().toISOString().split('T')[0].replace(/-/g, '')}-{confirmingItem.id.toString().padStart(4, '0')}
                </span>
              </div>
            </div>
            
            <div className="button-group">
              <Button 
                variant="outline" 
                onClick={cancelPurchaseComplete}
                size="lg"
              >
                취소
              </Button>
              <Button 
                onClick={confirmPurchaseComplete}
                size="lg"
                loading={completePurchaseMutation.isPending}
                disabled={completePurchaseMutation.isPending}
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  border: 'none'
                }}
              >
                <CheckCircle2 size={18} />
                구매완료 & 품목등록
              </Button>
            </div>
          </ConfirmContent>
        </ConfirmDialog>
      )}
    </Container>
    
  );
};

export default PurchaseRequestPage;