// client/src/components/inventory/InventoryPage.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Plus, Download, Filter, RefreshCw, Edit, Trash2 } from 'lucide-react';

// Components
import Table from '../common/Table';
import Button from '../common/Button';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import InventoryFilters from './InventoryFilters';

// Services
import { inventoryApi } from '../../services/api';

// Types
import { TableColumn, SearchFilters } from '../../types';

interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category?: string;
  brand?: string;
  current_stock: number;
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
  created_at: string;
  updated_at?: string;
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

const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  // 재고 목록 조회
  const { 
    data: inventoryData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['inventory', currentPage, filters],
    queryFn: () => inventoryApi.getItems(currentPage, 20, filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // 재고 통계 조회
  const { data: statsData } = useQuery({
    queryKey: ['inventory-stats'],
    queryFn: () => inventoryApi.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  // 삭제 Mutation
  const deleteItemMutation = useMutation({
    mutationFn: inventoryApi.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      toast.success('품목이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    },
  });

  // Excel 내보내기 Mutation
  const exportMutation = useMutation({
    mutationFn: () => inventoryApi.exportData('inventory'),
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
    if (current === 0) return 'out';
    if (current <= minimum) return 'low';
    if (current <= minimum * 2) return 'medium';
    return 'high';
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
      key: 'category',
      label: '카테고리',
      sortable: true,
      width: '120px',
      render: (value) => value || '-',
    },
    {
      key: 'current_stock',
      label: '재고 현황',
      sortable: true,
      width: '140px',
      render: (value, item) => {
        const stockLevel = getStockLevel(value, item.minimum_stock);
        return (
          <StockIndicator stockLevel={stockLevel}>
            <div className="stock-dot" />
            <div className="stock-text">
              {value.toLocaleString()}
              {item.minimum_stock && (
                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                  /{item.minimum_stock}
                </span>
              )}
            </div>
          </StockIndicator>
        );
      },
    },
    {
      key: 'unit_price',
      label: '단가',
      sortable: true,
      width: '120px',
      align: 'right',
      render: (value, item) => value ? `${item.currency} ${value.toLocaleString()}` : '-',
    },
    {
      key: 'supplier_name',
      label: '공급업체',
      sortable: true,
      width: '150px',
      render: (value) => value || '-',
    },
    {
      key: 'location',
      label: '위치',
      width: '100px',
      render: (value, item) => {
        const location = value || item.warehouse;
        return location || '-';
      },
    },
    {
      key: 'is_active',
      label: '상태',
      width: '100px',
      render: (value) => (
        <StatusBadge isActive={value}>
          {value ? '활성' : '비활성'}
        </StatusBadge>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      width: '120px',
      render: (_, item) => (
        <ActionButtonGroup>
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

  // 이벤트 핸들러
  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setCurrentPage(1);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('정말로 이 품목을 삭제하시겠습니까?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    refetch();
    queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
  };

  // 데이터 추출
  const items = inventoryData?.data?.items || [];
  const totalPages = inventoryData?.data?.pages || 0;
  const stats = statsData?.data || {};

  console.log('Inventory data:', { inventoryData, items, stats }); // 디버깅용

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
          <h3>{items.filter(item => item.current_stock > item.minimum_stock).length}</h3>
          <p>충분한 재고</p>
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
            <Button onClick={() => setIsAddModalOpen(true)}>
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
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        title={editingItem ? '품목 수정' : '새 품목 추가'}
        size="lg"
      >
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <p>품목 폼 컴포넌트를 여기에 구현하세요.</p>
          <Button onClick={handleModalClose}>닫기</Button>
        </div>
      </Modal>
    </Container>
  );
};

export default InventoryPage;