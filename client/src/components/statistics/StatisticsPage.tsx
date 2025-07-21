// client/src/components/statistics/StatisticsPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, PieChart } from 'lucide-react';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { statisticsApi } from '../../services/api';

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

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 40px 20px;
  
  .feature-icon {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 20px;
  }
  
  .feature-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 12px;
    color: ${props => props.theme.colors.text};
  }
  
  .feature-description {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
  }
  
  .coming-soon {
    display: inline-block;
    margin-top: 16px;
    padding: 6px 12px;
    background: ${props => props.theme.colors.warning}20;
    color: ${props => props.theme.colors.warning};
    border-radius: ${props => props.theme.borderRadius.sm};
    font-size: 0.85rem;
    font-weight: 500;
  }
`;

const StatisticsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['statistics'],
    queryFn: statisticsApi.getStats,
    retry: 1,
  });

  if (isLoading) {
    return <LoadingSpinner text="통계 데이터를 불러오는 중..." />;
  }

  return (
    <Container>
      <PageTitle>통계 분석</PageTitle>
      <PageSubtitle>시스템 사용 현황과 트렌드를 분석합니다.</PageSubtitle>

      <FeatureGrid>
        <FeatureCard>
          <BarChart3 size={48} className="feature-icon" />
          <div className="feature-title">재고 현황 분석</div>
          <div className="feature-description">
            품목별 재고 수준, 회전율, 재고 부족 예측 등 
            상세한 재고 분석 리포트를 제공합니다.
          </div>
          <span className="coming-soon">준비 중</span>
        </FeatureCard>

        <FeatureCard>
          <TrendingUp size={48} className="feature-icon" />
          <div className="feature-title">구매 트렌드</div>
          <div className="feature-description">
            월별/분기별 구매 패턴, 예산 사용률, 
            공급업체별 구매 현황을 시각화합니다.
          </div>
          <span className="coming-soon">준비 중</span>
        </FeatureCard>

        <FeatureCard>
          <PieChart size={48} className="feature-icon" />
          <div className="feature-title">카테고리별 분석</div>
          <div className="feature-description">
            품목 카테고리별 비중, 예산 배분, 
            사용 빈도 등을 차트로 분석합니다.
          </div>
          <span className="coming-soon">준비 중</span>
        </FeatureCard>
      </FeatureGrid>
    </Container>
  );
};

export default StatisticsPage;