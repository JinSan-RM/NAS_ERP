// client/src/components/receipt/ReceiptPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { Plus, Download, AlertCircle } from 'lucide-react';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Button from '../common/Button';
import { receiptApi } from '../../services/api';
import { Receipt, TableColumn } from '../../types';

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
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 60px 20px;
  
  .error-icon {
    color: ${props => props.theme.colors.error};
    margin-bottom: 16px;
  }
  
  .error-title {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${props => props.theme.colors.text};
  }
  
  .error-message {
    color: ${props => props.theme.colors.textSecondary};
    margin-bottom: 20px;
  }
`;

const ReceiptPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['receipts', currentPage],
    queryFn: () => receiptApi.getReceipts(currentPage, 20),
    keepPreviousData: true,
    retry: 2,
  });

  const columns: TableColumn<Receipt>[] = [
    {
      key: 'receiptNumber',
      label: '수령번호',
      sortable: true,
      width: '120px',
    },
    {
      key: 'itemName',
      label: '품목명',
      sortable: true,
    },
    {
      key: 'receivedQuantity',
      label: '수령수량',
      width: '100px',
      render: (value, item) => `${value}/${item.expectedQuantity}`,
    },
    {
      key: 'receiverName',
      label: '수령자',
      width: '100px',
    },
    {
      key: 'department',
      label: '부서',
      width: '100px',
    },
    {
      key: 'receivedDate',
      label: '수령일',
      width: '120px',
      render: (value) => new Date(value).toLocaleDateString('ko-KR'),
    },
  ];

  if (isLoading) {
    return <LoadingSpinner text="수령 데이터를 불러오는 중..." />;
  }

  if (error) {
    console.error('Receipt error:', error);
    return (
      <Container>
        <PageTitle>수령 관리</PageTitle>
        <Card>
          <ErrorContainer>
            <AlertCircle size={48} className="error-icon" />
            <div className="error-title">데이터를 불러올 수 없습니다</div>
            <div className="error-message">
              백엔드 서버가 실행되지 않았거나 수령 관리 API가 구현되지 않았습니다.
            </div>
            <Button onClick={() => refetch()}>
              다시 시도
            </Button>
          </ErrorContainer>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>수령 관리</PageTitle>
      <PageSubtitle>물품 수령 현황을 확인하고 관리할 수 있습니다.</PageSubtitle>

      <Card>
        <FilterContainer>
          <ActionButtons>
            <Button variant="secondary">
              <Download size={16} />
              Excel 다운로드
            </Button>
            <Button>
              <Plus size={16} />
              수령 등록
            </Button>
          </ActionButtons>
        </FilterContainer>

        <Table
          columns={columns}
          data={data?.data?.items || []}
          loading={isLoading}
          emptyMessage="수령 내역이 없습니다."
        />

        <Pagination
          currentPage={currentPage}
          totalPages={data?.data?.totalPages || 0}
          onPageChange={setCurrentPage}
        />
      </Card>
    </Container>
  );
};

export default ReceiptPage;