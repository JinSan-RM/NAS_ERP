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
  Search,
  Filter
} from 'lucide-react';

// Components
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Modal from '../common/Modal';
import Button from '../common/Button';

// Services
import api, { SearchFilters } from '../../services/api';

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

const FilterGroup = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
  
  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const SearchInput = styled.div`
  position: relative;
  min-width: 280px;
  
  input {
    width: 100%;
    padding: 10px 12px 10px 40px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
  }
  
  @media (max-width: 768px) {
    min-width: 100%;
  }
`;

const SelectInput = styled.select`
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 120px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  @media (max-width: 768px) {
    width: 100%;
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

// 필터 컴포넌트
const PurchaseRequestFilters: React.FC<{
  onFilter: (filters: SearchFilters) => void;
  searchQuery: string;
  statusFilter: RequestStatus;
  urgencyFilter: UrgencyLevel;
  departmentFilter: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: RequestStatus) => void;
  onUrgencyChange: (value: UrgencyLevel) => void;
  onDepartmentChange: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
  isLoading: boolean;
  isExporting: boolean;
}> = ({
  onFilter,
  searchQuery,
  statusFilter,
  urgencyFilter,
  departmentFilter,
  onSearchChange,
  onStatusChange,
  onUrgencyChange,
  onDepartmentChange,
  onRefresh,
  onExport,
  isLoading,
  isExporting
}) => {
  return (
    <FilterContainer>
      <FilterGroup>
        <SearchInput>
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="품목명, 요청자, 부서로 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </SearchInput>
        
        <SelectInput
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as RequestStatus)}
        >
          <option value="all">전체 상태</option>
          <option value="pending">승인 대기</option>
          <option value="approved">승인됨</option>
          <option value="rejected">거절됨</option>
          <option value="in_review">검토중</option>
        </SelectInput>
        
        <SelectInput
          value={urgencyFilter}
          onChange={(e) => onUrgencyChange(e.target.value as UrgencyLevel)}
        >
          <option value="all">전체 긴급도</option>
          <option value="urgent">긴급</option>
          <option value="high">높음</option>
          <option value="normal">보통</option>
          <option value="low">낮음</option>
        </SelectInput>
        
        <SelectInput
          value={departmentFilter}
          onChange={(e) => onDepartmentChange(e.target.value)}
        >
          <option value="all">전체 부서</option>
          <option value="총무부">총무부</option>
          <option value="개발팀">개발팀</option>
          <option value="사무관리팀">사무관리팀</option>
          <option value="영업팀">영업팀</option>
          <option value="마케팅팀">마케팅팀</option>
        </SelectInput>
      </FilterGroup>
      
      <ActionButtons>
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isLoading}
          size="sm"
          title="새로고침"
        >
          <RefreshCw size={16} />
          <span>새로고침</span>
        </Button>
        <Button
          variant="secondary"
          onClick={onExport}
          disabled={isExporting}
          loading={isExporting}
          size="sm"
          title="Excel 다운로드"
        >
          <Download size={16} />
          <span>Excel 다운로드</span>
        </Button>
        <Button 
          onClick={() => toast.info('구매 요청 추가 기능이 곧 구현됩니다.')}
          size="sm"
          title="구매 요청 추가"
        >
          <Plus size={16} />
          <span>구매 요청</span>
        </Button>
      </ActionButtons>
    </FilterContainer>
  );
};

// 메인 컴포넌트
const PurchaseRequestPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<UrgencyLevel>('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  // 필터 조합
  const filters = useMemo(() => {
    const result: SearchFilters = {};
    
    if (searchQuery.trim()) result.search = searchQuery.trim();
    if (statusFilter !== 'all') result.status = statusFilter;
    if (urgencyFilter !== 'all') result.urgency = urgencyFilter;
    if (departmentFilter !== 'all') result.department = departmentFilter;
    
    return result;
  }, [searchQuery, statusFilter, urgencyFilter, departmentFilter]);

  // 구매 요청 목록 조회
  const { 
    data: requestsData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['purchase-requests', currentPage, filters],
    queryFn: () => api.purchase.getRequests({ page: currentPage, limit: 20, ...filters }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  // 통계 데이터 조회
  const { data: statsData } = useQuery({
    queryKey: ['purchase-requests-stats'],
    queryFn: () => api.purchase.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  // Export Mutation - createObjectURL 제거
  const exportMutation = useMutation({
    mutationFn: () => api.purchase.exportRequests(filters),
    onSuccess: () => {
      toast.success('Excel 파일이 다운로드되었습니다.');
    },
    onError: (error) => {
      console.error('Export error:', error);
      toast.error('Excel 다운로드에 실패했습니다.');
    },
  });

  // 테이블 컬럼 정의
  const columns: TableColumn<PurchaseRequest>[] = useMemo(() => [
    {
      key: 'id',
      label: '번호',
      sortable: true,
      width: '80px',
      render: (value) => `#${value}`,
    },
    {
      key: 'itemName',
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
      key: 'requestedBy',
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
      render: (value) => <UrgencyBadge $urgency={value}>{value}</UrgencyBadge>,
    },
    {
      key: 'status',
      label: '상태',
      width: '120px',
      render: (value) => <StatusBadge $status={value}>{value}</StatusBadge>,
    },
    {
      key: 'requestDate',
      label: '요청일',
      sortable: true,
      width: '120px',
      render: (value) => value ? new Date(value).toLocaleDateString('ko-KR') : '-',
    },
    {
      key: 'estimatedPrice',
      label: '예상금액',
      width: '120px',
      render: (value) => value ? `${value.toLocaleString()}원` : '-',
    },
    {
      key: 'actions',
      label: '작업',
      width: '120px',
      render: (_, item) => (
        <ActionButtonGroup>
          <IconButton 
            className="view"
            onClick={() => toast.info(`상세보기: ${item.itemName}`)}
            title="상세보기"
          >
            <Eye size={14} />
          </IconButton>
          <IconButton 
            className="edit"
            onClick={() => toast.info(`수정: ${item.itemName}`)}
            title="수정"
          >
            <Edit size={14} />
          </IconButton>
          <IconButton 
            className="delete"
            onClick={() => toast.info(`삭제: ${item.itemName}`)}
            title="삭제"
          >
            <Trash2 size={14} />
          </IconButton>
        </ActionButtonGroup>
      ),
    },
  ], []);

  // 이벤트 핸들러
  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries(['purchase-requests']);
    queryClient.invalidateQueries(['purchase-requests-stats']);
    refetch();
  };

  // 필터 변경시 첫 페이지로 이동
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // 데이터 추출
  const requests = requestsData?.data?.items || [];
  const totalPages = requestsData?.data?.pages || 0;
  const totalItems = requestsData?.data?.total || 0;
  const stats = statsData?.data || {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    thisMonth: 0,
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
          <div className="stat-value">{stats.pending.toLocaleString()}</div>
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
          <PurchaseRequestFilters
            onFilter={() => {}} // 실시간 필터링이므로 불필요
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            urgencyFilter={urgencyFilter}
            departmentFilter={departmentFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onUrgencyChange={setUrgencyFilter}
            onDepartmentChange={setDepartmentFilter}
            onRefresh={handleRefresh}
            onExport={handleExport}
            isLoading={isLoading}
            isExporting={exportMutation.isPending}
          />
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
              <Button onClick={() => toast.info('구매 요청 추가 기능이 곧 구현됩니다.')}>
                <Plus size={16} />
                첫 구매 요청 등록
              </Button>
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
                  totalItems={totalItems}
                />
              )}
            </>
          )}
        </TableContainer>
      </ContentCard>
    </Container>
  );
};

export default PurchaseRequestPage;