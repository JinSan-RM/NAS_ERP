// client/src/components/statistics/StatisticsPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@tanstack/react-query';
import PageHeader from '../common/Header';
import LoadingSpinner from '../common/LoadingSpinner';
import { statisticsApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const StatisticsPage: React.FC = () => {
  const { data, isLoading } = useQuery('statistics', statisticsApi.getStats);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      <PageHeader
        title="통계 분석"
        subtitle="시스템 사용 현황과 트렌드를 분석합니다."
      />

      <Card>
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <h3>통계 기능 준비 중</h3>
          <p>차트와 분석 기능이 곧 추가될 예정입니다.</p>
        </div>
      </Card>
    </Container>
  );
};

export default StatisticsPage;