// client/src/components/logs/LogsPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import PageHeader from '../common/PageHeader';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { logsApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const LogsPage: React.FC = () => {
  const { data, isLoading } = useQuery('logs', () => logsApi.getLogs());

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <PageHeader
        title="시스템 로그"
        subtitle="시스템 활동 로그를 확인할 수 있습니다."
      />

      <Card>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>로그 기능 준비 중</h3>
          <p>시스템 로그 조회 기능이 곧 추가될 예정입니다.</p>
        </div>
      </Card>
    </Container>
  );
};

export default LogsPage;