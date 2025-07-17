// client/src/components/receipt/ReceiptPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { Plus, Search, Download } from 'lucide-react';
import PageHeader from '../common/PageHeader';
import Card from '../common/Card';
import Button from '../common/Button';
import Table from '../common/Table';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import { receiptApi } from '../../services/api';
import { Receipt, TableColumn } from '../../types';

const Container = styled.div`
  padding: 20px;
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

const ReceiptPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data, isLoading, error } = useQuery(
    ['receipts', currentPage],
    () => receiptApi.getReceipts(currentPage, 20),
    {
      keepPreviousData: true,
    }
  );

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
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <PageHeader
        title="수령 관리"
        subtitle="물품 수령 현황을 확인하고 관리할 수 있습니다."
      />

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