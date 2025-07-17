// client/src/components/inventory/InventoryPage.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@tanstack/react-query';

import { toast } from 'react-toastify';
import { Plus, Search, Download, Filter, RefreshCw } from 'lucide-react';

// Components
import PageHeader from '../common/Header';
import Select from '../common/Select';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import InventoryForm from './InventoryForm';
import InventoryFilters from './InventoryFilters';

// Hooks & Services
import { useInventory } from '../../hooks/useInventory';
import { inventoryApi } from '../../services/api';

// Types
import { InventoryItem, SearchFilters, TableColumn } from '../../types';

const Container = styled.div`
  padding: 20px;
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

const StatCard = styled(Card)`
  text-align: center;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary} 0%, ${props => props.theme.colors.secondary} 100%);
  color: white;
  
  h3 {
    font-size: 2rem;
    margin-bottom: 5px;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
  }
`;

const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Custom hooks
  const {
    items,
    loading,
    error,
    totalPages,
    stats,
    refetch
  } = useInventory(currentPage, 20, filters);

  // Mutations
  const deleteItemMutation = useMutation(inventoryApi.deleteItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      toast.success('품목이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    },
  });

  const exportMutation = useMutation(inventoryApi.exportData, {
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

  // Table columns
  const columns: TableColumn<InventoryItem>[] = useMemo(() => [
    {
      key: 'no',
      label: '번호',
      sortable: true,
      width: '80px',
    },
    {
      key: 'itemName',
      label: '품목명',
      sortable: true,
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{value}</div>
          {item.specifications && (
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              {item.specifications}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'quantity',
      label: '수량',
      sortable: true,
      width: '100px',
      render: (value) => value.toLocaleString(),
    },
    {
      key: 'unitPrice',
      label: '단가',
      sortable: true,
      width: '120px',
      render: (value) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'totalPrice',
      label: '총액',
      sortable: true,
      width: '140px',
      render: (value) => `₩${value.toLocaleString()}`,
    },
    {
      key: 'supplier',
      label: '공급업체',
      sortable: true,
      width: '150px',
    },
    {
      key: 'status',
      label: '상태',
      width: '100px',
      render: (value) => (
        <StatusBadge status={value}>
          {getStatusLabel(value)}
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
          >
            수정
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(item.no)}
          >
            삭제
          </Button>
        </ActionButtonGroup>
      ),
    },
  ], []);

  // Event handlers
  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setCurrentPage(1);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (itemNo: number) => {
    if (window.confirm('정말로 이 품목을 삭제하시겠습니까?')) {
      deleteItemMutation.mutate(itemNo);
    }
  };

  const handleExport = () => {
    exportMutation.mutate('inventory');
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    refetch();
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: '주문중',
      received: '수령완료',
      ordered: '발주완료',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
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
      <PageHeader
        title="품목 관리"
        subtitle="전체 품목 현황을 관리하고 모니터링할 수 있습니다."
      />

      {/* 통계 카드 */}
      <StatsContainer>
        <StatCard>
          <h3>{stats?.totalItems || 0}</h3>
          <p>전체 품목</p>
        </StatCard>
        <StatCard>
          <h3>{stats?.receivedItems || 0}</h3>
          <p>수령 완료</p>
        </StatCard>
        <StatCard>
          <h3>{stats?.pendingItems || 0}</h3>
          <p>주문 중</p>
        </StatCard>
        <StatCard>
          <h3>₩{(stats?.totalValue || 0).toLocaleString()}</h3>
          <p>총 금액</p>
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
              disabled={loading}
            >
              <RefreshCw size={16} />
              새로고침
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exportMutation.isLoading}
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
          data={items || []}
          loading={loading}
          emptyMessage="등록된 품목이 없습니다."
        />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* 품목 추가/수정 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        title={editingItem ? '품목 수정' : '새 품목 추가'}
        size="lg"
      >
        <InventoryForm
          item={editingItem}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </Container>
  );
};

// Styled components
const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'received':
        return `
          background: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'pending':
        return `
          background: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      default:
        return `
          background: ${theme.colors.gray}20;
          color: ${theme.colors.gray};
        `;
    }
  }}
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

export default InventoryPage;