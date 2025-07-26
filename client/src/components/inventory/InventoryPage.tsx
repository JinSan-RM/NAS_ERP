// client/src/components/inventory/InventoryPage.tsx
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Plus, Download, Filter, RefreshCw, Edit, Trash2, Package } from 'lucide-react';

// Components
import Table from '../common/Table';
import Button from '../common/Button';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import InventoryFilters from './InventoryFilters';
import InventoryForm from './InventoryForm';
import ReceiptModal from './ReceiptModal'; // 새로 만들 컴포넌트

import { inventoryApi } from '../../services/api'; // API 서비스


// Services
import api from '../../services/api';

// Types
import { TableColumn, SearchFilters } from '../../types';

interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category?: string;
  brand?: string;
  current_quantity: number;
  total_received: number;
  reserved_quantity: number;
  minimum_stock: number;
  maximum_stock?: number;
  unit_price?: number;
  currency: string;
  supplier_name?: string;
  supplier_contact?: string;
  location?: string;
  warehouse?: string;
  is_active: boolean;
  description?: string;
  receipt_history?: ReceiptHistory[];
  condition_quantities?: { [key: string]: number };
  last_received_date?: string;
  last_received_by?: string;
  stock_status: 'normal' | 'low_stock' | 'out_of_stock' | 'overstocked';
  created_at: string;
  updated_at?: string;
}

interface ReceiptHistory {
  receipt_number: string;
  item_name: string;
  expected_quantity: number;
  received_quantity: number;
  receiver_name: string;
  department: string;
  received_date: string;
  condition?: string;
  notes?: string;
  image_url?: string;  // 새로 추가: 이미지 URL 필드 (백엔드에서 제공)
}

const Container = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 30px;
  font-size: 1rem;
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(Card)<{ color?: string }>`
  text-align: center;
  background: ${props => props.color ? `linear-gradient(135deg, ${props.color}20 0%, ${props.color}10 100%)` : 'white'};
  border-left: 4px solid ${props => props.color || props.theme.colors.primary};
  
  h3 {
    font-size: 2rem;
    margin-bottom: 5px;
    color: ${props => props.color || props.theme.colors.primary};
  }
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const StatusBadge = styled.span<{ isActive: boolean }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => props.isActive ? '#10B98120' : '#EF444420'};
  color: ${props => props.isActive ? '#10B981' : '#EF4444'};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const StockIndicator = styled.div<{ stockLevel: 'high' | 'medium' | 'low' | 'out' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .stock-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.stockLevel) {
        case 'high': return '#10B981';
        case 'medium': return '#F59E0B';
        case 'low': return '#EF4444';
        case 'out': return '#6B7280';
        default: return '#6B7280';
      }
    }};
  }
  
  .stock-text {
    font-weight: 500;
  }
`;

const QuantityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .main-quantity {
    font-weight: bold;
    font-size: 0.95rem;
  }
  
  .sub-info {
    font-size: 0.8rem;
    color: #666;
  }
`;

const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isReceiptWithImagesModalOpen, setIsReceiptWithImagesModalOpen] = useState(false);
  const [selectedItemForReceipt, setSelectedItemForReceipt] = useState<InventoryItem | null>(null);

  // 재고 목록 조회 (unified_inventory API 사용)
  const { 
    data: inventoryData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['unified-inventory', currentPage, filters],
    queryFn: () => api.inventory.getItems(currentPage, 20, filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // 재고 통계 조회
  const { data: statsData } = useQuery({
    queryKey: ['unified-inventory-stats'],
    queryFn: () => api.inventory.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const highlightId = urlParams.get('highlight');
    
    if (highlightId) {
      // 해당 품목을 하이라이트 표시
      setTimeout(() => {
        const element = document.querySelector(`[data-item-id="${highlightId}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('highlight-item');
          
          // 3초 후 하이라이트 제거
          setTimeout(() => {
            element.classList.remove('highlight-item');
          }, 3000);
        }
      }, 500);
      
      // URL에서 파라미터 제거
      window.history.replaceState({}, '', '/inventory');
    }
  }, []);

  // 🔥 개선된 수령 추가 Mutation (이미지 포함)
  const addReceiptWithImagesMutation = useMutation({
    mutationFn: ({ itemId, receiptData, images }: { 
      itemId: number; 
      receiptData: any; 
      images: File[] 
    }) => inventoryApi.completeReceiptWithImages(itemId, receiptData, images),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('🎉 수령이 완료되고 이미지가 업로드되었습니다!');
      setIsReceiptWithImagesModalOpen(false);
      setSelectedItemForReceipt(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '수령 처리 중 오류가 발생했습니다.');
    },
  });


  // 품목 생성 Mutation
  const createItemMutation = useMutation({
    mutationFn: api.inventory.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('품목이 등록되었습니다.');
      handleFormModalClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '품목 등록 중 오류가 발생했습니다.');
    },
  });

  // 품목 수정 Mutation
  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.inventory.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('품목이 수정되었습니다.');
      handleFormModalClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '품목 수정 중 오류가 발생했습니다.');
    },
  });

  // 삭제 Mutation
  const deleteItemMutation = useMutation({
    mutationFn: api.inventory.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('품목이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    },
  });

  // 수령 추가 Mutation
  const addReceiptMutation = useMutation({
    mutationFn: ({ itemId, receiptData }: { itemId: number; receiptData: any }) =>
      api.inventory.addReceipt(itemId, receiptData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('수령 내역이 추가되었습니다.');
      setIsReceiptModalOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '수령 추가 중 오류가 발생했습니다.');
    },
  });

  // Excel 내보내기 Mutation
  const exportMutation = useMutation({
    mutationFn: () => api.inventory.exportData(),
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Excel 파일이 다운로드되었습니다.');
    },
    onError: () => {
      toast.error('내보내기 중 오류가 발생했습니다.');
    },
  });

  // 재고 수준 계산
  const getStockLevel = (current: number, minimum: number): 'high' | 'medium' | 'low' | 'out' => {
    // 🔥 안전한 숫자 변환
    const currentNum = Number(current) || 0;
    const minimumNum = Number(minimum) || 0;
    
    if (currentNum === 0) return 'out';
    if (minimumNum === 0) return 'high'; // 최소재고가 0이면 높음으로
    if (currentNum <= minimumNum) return 'low';
    if (currentNum <= minimumNum * 2) return 'medium';
    return 'high';
  };

  // 재고 상태 표시
  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'low_stock': return '#F59E0B';
      case 'out_of_stock': return '#EF4444';
      case 'overstocked': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  // 테이블 컬럼 정의
  const columns: TableColumn<InventoryItem>[] = useMemo(() => [
    {
      key: 'item_code',
      label: '품목코드',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: '500' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'item_name',
      label: '품목명',
      sortable: true,
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{value}</div>
          {item.brand && (
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              {item.brand}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'current_quantity',
      label: '재고 현황',
      sortable: true,
      width: '160px',
      render: (value, item) => (
        <QuantityInfo>
          <div className="main-quantity" style={{ color: getStockStatusColor(item.stock_status) }}>
            현재: {value.toLocaleString()}
          </div>
          <div className="sub-info">
            총수령: {item.total_received?.toLocaleString() || 0}
          </div>
          <div className="sub-info">
            최소: {item.minimum_stock?.toLocaleString() || 0}
          </div>
        </QuantityInfo>
      ),
    },
    {
      key: 'unit_price',
      label: '단가',
      sortable: true,
      width: '120px',
      align: 'right',
      render: (value, item) => {
        // 🔥 null/undefined 체크 추가
        if (!value || value === 0) return '-';
        const currency = item.currency || '원';
        return `${currency} ${value.toLocaleString()}`;
      },
    },
    {
      key: 'last_received_date',
      label: '최근수령일',
      width: '110px',
      render: (value) => value ? new Date(value).toLocaleDateString('ko-KR') : '-',
    },
    {
      key: 'image',
      label: '이미지',
      width: '500px',
      render: (value, item) => (
        <div className="image-preview-grid">
          {item.receipt_history?.slice(0, 3).map((receipt, index) => (
            receipt.image_url ? (
              <img
                key={index}
                src={receipt.image_url}
                alt={`Receipt ${index + 1}`}
                className="thumbnail"
                style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }}
              />
            ) : (
              <div key={index} className="no-image">이미지 없음</div>
            )
          ))}
          {item.receipt_history?.length > 3 && (
            <span className="more-images">+{item.receipt_history.length - 3}개</span>
          )}
        </div>
      ),
    },
    {
      key: 'is_active',
      label: '상태',
      width: '180px',
      render: (value) => (
        <StatusBadge isActive={value}>
          {value ? '수령 완료' : '수령 대기'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      width: '180px', // 폭 늘림
      render: (_, item) => (
        <ActionButtonGroup>
          {/* 🔥 새로운 수령완료 버튼 (이미지 포함) */}
          <Button
            size="sm"
            variant="success"
            onClick={() => handleReceiptWithImages(item)}
            title="수령완료 (이미지 포함)"
            style={{
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: 'white',
              fontWeight: '600'
            }}
          >
            <Package size={14} />
            수령완료
          </Button>
          
          {/* 기존 수령 추가 버튼 */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAddReceipt(item)}
            title="간단 수령 추가"
          >
            <Package size={14} />
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(item)}
            title="수정"
          >
            <Edit size={14} />
          </Button>
          
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(item.id)}
            title="삭제"
          >
            <Trash2 size={14} />
          </Button>
        </ActionButtonGroup>
      ),
    },
  ], []);

  // 🔥 새로운 이벤트 핸들러들
  const handleReceiptWithImages = (item: InventoryItem) => {
    setSelectedItemForReceipt(item);
    setIsReceiptWithImagesModalOpen(true);
  };

  const handleReceiptWithImagesSubmit = (receiptData: any, images: File[]) => {
    if (selectedItemForReceipt) {
      addReceiptWithImagesMutation.mutate({
        itemId: selectedItemForReceipt.id,
        receiptData,
        images
      });
    }
  };

  // 이벤트 핸들러
  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setCurrentPage(1);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('정말로 이 품목을 삭제하시겠습니까?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  const handleAddReceipt = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsReceiptModalOpen(true);
  };

  const handleReceiptSubmit = (receiptData: any) => {
    if (selectedItem) {
      addReceiptMutation.mutate({ 
        itemId: selectedItem.id, 
        receiptData 
      });
    }
  };

  // 데이터 추출
  const items = inventoryData?.data?.items || [];
  const totalPages = inventoryData?.data?.pages || 0;
  const stats = statsData?.data || {};

  if (isLoading) {
    return <LoadingSpinner text="재고 데이터를 불러오는 중..." />;
  }

  if (error) {
    console.error('Inventory error:', error);
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <Button onClick={() => refetch()}>다시 시도</Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>품목 관리</PageTitle>
      <PageSubtitle>전체 품목 현황을 관리하고 모니터링할 수 있습니다.</PageSubtitle>

      {/* 통계 카드 */}
      <StatsContainer>
        <StatCard color="#3B82F6">
          <h3>{stats?.total_items || 0}</h3>
          <p>전체 품목</p>
        </StatCard>
        <StatCard color="#10B981">
          <h3>{items.filter(item => item.stock_status === 'normal').length}</h3>
          <p>정상 재고</p>
        </StatCard>
        <StatCard color="#F59E0B">
          <h3>{stats?.low_stock_items || 0}</h3>
          <p>재고 부족</p>
        </StatCard>
        <StatCard color="#EF4444">
          <h3>{stats?.out_of_stock_items || 0}</h3>
          <p>재고 없음</p>
        </StatCard>
      </StatsContainer>

      <Card>
        {/* 필터 및 액션 버튼 */}
        <FilterContainer>
          <InventoryFilters onFilter={handleSearch} />
          
          <ActionButtons>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              새로고침
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exportMutation.isPending}
              loading={exportMutation.isPending}
            >
              <Download size={16} />
              Excel 다운로드
            </Button>
            <Button onClick={() => setIsFormModalOpen(true)}>
              <Plus size={16} />
              품목 추가
            </Button>
          </ActionButtons>
        </FilterContainer>

        {/* 테이블 */}
        <Table
          columns={columns}
          data={items}
          loading={isLoading}
          emptyMessage="등록된 품목이 없습니다."
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* 품목 추가/수정 모달 */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        title={editingItem ? '품목 수정' : '새 품목 추가'}
        size="lg"
      >
        <InventoryForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormModalClose}
          loading={createItemMutation.isPending || updateItemMutation.isPending}
        />
      </Modal>

      {/* 🔥 CSS 스타일 추가 (하이라이트 효과) */}
      <style jsx>{`
        .highlight-item {
          background: linear-gradient(135deg, #fef3c7, #fed7aa) !important;
          border: 2px solid #f59e0b !important;
          border-radius: 8px !important;
          animation: highlight-pulse 1s ease-in-out 3;
        }
        
        @keyframes highlight-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
      `}</style>

      {/* 🔥 새로운 수령완료 모달 (이미지 포함) */}
      <ReceiptModal
        item={selectedItemForReceipt}
        isOpen={isReceiptWithImagesModalOpen}
        onClose={() => {
          setIsReceiptWithImagesModalOpen(false);
          setSelectedItemForReceipt(null);
        }}
        onSubmit={handleReceiptWithImagesSubmit}
        loading={addReceiptWithImagesMutation.isPending}
      />

      {/* 수령 추가 모달 */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title={`수령 추가 - ${selectedItem?.item_name}`}
        size="lg"
      >
        <ReceiptModal
          item={selectedItem}
          onSubmit={handleReceiptSubmit}
          onCancel={() => setIsReceiptModalOpen(false)}
          loading={addReceiptMutation.isPending}
        />
      </Modal>
    </Container>
  );
};

export default InventoryPage;