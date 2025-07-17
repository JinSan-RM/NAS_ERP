// client/src/components/purchase/PurchaseRequestPage.tsx
import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Search, 
  Download, 
  Filter, 
  RefreshCw, 
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  Clock,
  AlertCircle,
  FileText
} from 'lucide-react';

// Components
import PageHeader from '../common/PageHeader';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import PurchaseRequestForm from './PurchaseRequestForm';
import PurchaseRequestFilters from './PurchaseRequestFilters';
import ApprovalModal from './ApprovalModal';
import RequestDetailModal from './RequestDetailModal';

// Hooks & Services
import { usePurchaseRequests } from '../../hooks/usePurchaseRequests';
import { purchaseApi } from '../../services/api';

// Types
import { 
  PurchaseRequest, 
  SearchFilters, 
  TableColumn, 
  RequestStatus,
  UrgencyLevel 
} from '../../types';
import { STATUS_LABELS, URGENCY_LABELS, STATUS_COLORS, URGENCY_COLORS } from '../../types';

const Container = styled.div`
  padding: 20px;
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
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 15px;
    color: ${props => props.color || props.theme.colors.primary};
  }
  
  .stat-value {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 5px;
    color: ${props => props.color || props.theme.colors.primary};
  }
  
  .stat-label {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
  }
  
  .stat-change {
    font-size: 0.8rem;
    margin-top: 8px;
    padding: 4px 8px;
    border-radius: 12px;
    
    &.positive {
      background: ${props => props.theme.colors.success}20;
      color: ${props => props.theme.colors.success};
    }
    
    &.negative {
      background: ${props => props.theme.colors.error}20;
      color: ${props => props.theme.colors.error};
    }
  }
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

const StatusBadge = styled.span<{ status: RequestStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => STATUS_COLORS[props.status]}20;
  color: ${props => STATUS_COLORS[props.status]};
`;

const UrgencyBadge = styled.span<{ urgency: UrgencyLevel }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${props => URGENCY_COLORS[props.urgency]}20;
  color: ${props => URGENCY_COLORS[props.urgency]};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 5px;
`;

const PriceText = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const RequestInfo = styled.div`
  .request-title {
    font-weight: bold;
    margin-bottom: 4px;
  }
  
  .request-meta {
    font-size: 0.85rem;
    color: ${props => props.theme.colors.textSecondary};
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const PurchaseRequestPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<PurchaseRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<PurchaseRequest | null>(null);
  const [approvingRequest, setApprovingRequest] = useState<PurchaseRequest | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);

  // Custom hooks
  const {
    requests,
    loading,
    error,
    totalPages,
    stats,
    refetch
  } = usePurchaseRequests(currentPage, 20, filters);

  // Mutations
  const deleteRequestMutation = useMutation(purchaseApi.deleteRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase-requests');
      toast.success('구매 요청이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    },
  });

  const approveRequestMutation = useMutation(purchaseApi.approveRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase-requests');
      setApprovingRequest(null);
      toast.success('구매 요청이 처리되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '승인 처리 중 오류가 발생했습니다.');
    },
  });

  const exportMutation = useMutation(purchaseApi.exportRequests, {
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `purchase_requests_${new Date().toISOString().split('T')[0]}.xlsx`;
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
  const columns: TableColumn<PurchaseRequest>[] = useMemo(() => [
    {
      key: 'requestNumber',
      label: '요청번호',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
          {value}
        </span>
      )
    },
    {
      key: 'itemName',
      label: '품목 정보',
      sortable: true,
      render: (value, item) => (
        <RequestInfo>
          <div className="request-title">{value}</div>
          <div className="request-meta">
            <span>수량: {item.quantity.toLocaleString()}개</span>
            {item.specifications && <span>사양: {item.specifications}</span>}
          </div>
        </RequestInfo>
      ),
    },
    {
      key: 'totalBudget',
      label: '예상금액',
      sortable: true,
      width: '120px',
      align: 'right',
      render: (value) => (
        <PriceText>₩{value.toLocaleString()}</PriceText>
      ),
    },
    {
      key: 'requesterName',
      label: '요청자',
      sortable: true,
      width: '100px',
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: '500' }}>{value}</div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.department}</div>
        </div>
      ),
    },
    {
      key: 'urgency',
      label: '긴급도',
      width: '80px',
      render: (value) => (
        <UrgencyBadge urgency={value}>
          {value === 'emergency' && <AlertCircle size={12} />}
          {URGENCY_LABELS[value]}
        </UrgencyBadge>
      ),
    },
    {
      key: 'status',
      label: '상태',
      width: '120px',
      render: (value) => (
        <StatusBadge status={value}>
          {value === 'pending_approval' && <Clock size={12} />}
          {value === 'approved' && <Check size={12} />}
          {value === 'rejected' && <X size={12} />}
          {STATUS_LABELS[value]}
        </StatusBadge>
      ),
    },
    {
      key: 'requestDate',
      label: '요청일',
      sortable: true,
      width: '100px',
      render: (value) => new Date(value).toLocaleDateString('ko-KR'),
    },
    {
      key: 'actions',
      label: '관리',
      width: '150px',
      render: (_, item) => (
        <ActionButtonGroup>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleView(item)}
            title="상세보기"
          >
            <Eye size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleEdit(item)}
            disabled={!canEdit(item)}
            title="수정"
          >
            <Edit size={14} />
          </Button>
          {canApprove(item) && (
            <Button
              size="sm"
              variant="success"
              onClick={() => handleApprove(item)}
              title="승인처리"
            >
              <Check size={14} />
            </Button>
          )}
          <Button
            size="sm"
            variant="danger"
            onClick={() => handleDelete(item.id)}
            disabled={!canDelete(item)}
            title="삭제"
          >
            <Trash2 size={14} />
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

  const handleView = (request: PurchaseRequest) => {
    setViewingRequest(request);
  };

  const handleEdit = (request: PurchaseRequest) => {
    setEditingRequest(request);
    setIsAddModalOpen(true);
  };

  const handleDelete = async (requestId: number) => {
    if (window.confirm('정말로 이 구매 요청을 삭제하시겠습니까?')) {
      deleteRequestMutation.mutate(requestId);
    }
  };

  const handleApprove = (request: PurchaseRequest) => {
    setApprovingRequest(request);
  };

  const handleExport = () => {
    exportMutation.mutate(filters);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
    setEditingRequest(null);
  };

  const handleFormSuccess = () => {
    handleModalClose();
    refetch();
  };

  const handleApprovalSubmit = (action: 'approve' | 'reject', comments?: string) => {
    if (approvingRequest) {
      approveRequestMutation.mutate({
        requestId: approvingRequest.id,
        action,
        comments
      });
    }
  };

  // Permission checks
  const canEdit = (request: PurchaseRequest) => {
    return ['draft', 'submitted', 'rejected'].includes(request.status);
  };

  const canDelete = (request: PurchaseRequest) => {
    return ['draft', 'submitted', 'rejected'].includes(request.status);
  };

  const canApprove = (request: PurchaseRequest) => {
    return request.status === 'pending_approval';
    // 실제로는 현재 사용자가 승인자인지 체크
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
        title="구매 요청 관리"
        subtitle="구매 요청을 등록하고 승인 프로세스를 관리할 수 있습니다."
      />

      {/* 통계 카드 */}
      <StatsContainer>
        <StatCard color="#3B82F6">
          <div className="stat-header">
            <FileText size={24} />
            <span>전체 요청</span>
          </div>
          <div className="stat-value">{stats?.total || 0}</div>
          <div className="stat-label">총 구매 요청</div>
          <div className="stat-change positive">
            이번 달 +{stats?.thisMonth || 0}
          </div>
        </StatCard>

        <StatCard color="#F59E0B">
          <div className="stat-header">
            <Clock size={24} />
            <span>승인 대기</span>
          </div>
          <div className="stat-value">{stats?.pending || 0}</div>
          <div className="stat-label">처리 대기중</div>
        </StatCard>

        <StatCard color="#10B981">
          <div className="stat-header">
            <Check size={24} />
            <span>승인 완료</span>
          </div>
          <div className="stat-value">{stats?.approved || 0}</div>
          <div className="stat-label">승인된 요청</div>
        </StatCard>

        <StatCard color="#EF4444">
          <div className="stat-header">
            <X size={24} />
            <span>거절됨</span>
          </div>
          <div className="stat-value">{stats?.rejected || 0}</div>
          <div className="stat-label">거절된 요청</div>
        </StatCard>
      </StatsContainer>

      <Card>
        {/* 필터 및 액션 버튼 */}
        <FilterContainer>
          <PurchaseRequestFilters onFilter={handleSearch} />
          
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
              구매 요청
            </Button>
          </ActionButtons>
        </FilterContainer>

        {/* 테이블 */}
        <Table
          columns={columns}
          data={requests || []}
          loading={loading}
          emptyMessage="등록된 구매 요청이 없습니다."
          selectable
          selectedItems={selectedRequests}
          onSelectItems={setSelectedRequests}
        />

        {/* 페이지네이션 */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </Card>

      {/* 구매 요청 추가/수정 모달 */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        title={editingRequest ? '구매 요청 수정' : '새 구매 요청'}
        size="lg"
      >
        <PurchaseRequestForm
          request={editingRequest}
          onSuccess={handleFormSuccess}
          onCancel={handleModalClose}
        />
      </Modal>

      {/* 구매 요청 상세보기 모달 */}
      {viewingRequest && (
        <RequestDetailModal
          request={viewingRequest}
          isOpen={!!viewingRequest}
          onClose={() => setViewingRequest(null)}
          onEdit={() => {
            setEditingRequest(viewingRequest);
            setViewingRequest(null);
            setIsAddModalOpen(true);
          }}
          onApprove={() => {
            setApprovingRequest(viewingRequest);
            setViewingRequest(null);
          }}
        />
      )}

      {/* 승인/거절 모달 */}
      {approvingRequest && (
        <ApprovalModal
          request={approvingRequest}
          isOpen={!!approvingRequest}
          onClose={() => setApprovingRequest(null)}
          onSubmit={handleApprovalSubmit}
          loading={approveRequestMutation.isLoading}
        />
      )}
    </Container>
  );
};

export default PurchaseRequestPage;