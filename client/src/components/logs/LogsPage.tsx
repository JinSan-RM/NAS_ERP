// client/src/components/logs/LogsPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { FileText, Search, Filter, Activity } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { logsApi } from '../../services/api';

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

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 60px 40px;
  
  .feature-icon {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 24px;
  }
  
  .feature-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 16px;
    color: ${props => props.theme.colors.text};
  }
  
  .feature-description {
    color: ${props => props.theme.colors.textSecondary};
    line-height: 1.6;
    margin-bottom: 24px;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
  
  .features-list {
    text-align: left;
    max-width: 400px;
    margin: 0 auto 24px;
    
    ul {
      list-style: none;
      padding: 0;
      
      li {
        padding: 8px 0;
        color: ${props => props.theme.colors.textSecondary};
        position: relative;
        padding-left: 20px;
        
        &::before {
          content: '•';
          color: ${props => props.theme.colors.primary};
          position: absolute;
          left: 0;
        }
      }
    }
  }
  
  .coming-soon {
    display: inline-block;
    padding: 8px 16px;
    background: ${props => props.theme.colors.info}20;
    color: ${props => props.theme.colors.info};
    border-radius: ${props => props.theme.borderRadius.md};
    font-weight: 500;
  }
`;

const LogsPage: React.FC = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['logs'],
    queryFn: () => logsApi.getLogs(),
    retry: 1,
  });

  if (isLoading) {
    return <LoadingSpinner text="로그 데이터를 확인하는 중..." />;
  }

  return (
    <Container>
      <PageTitle>시스템 로그</PageTitle>
      <PageSubtitle>시스템 활동 로그를 확인할 수 있습니다.</PageSubtitle>

      <FeatureCard>
        <Activity size={64} className="feature-icon" />
        <div className="feature-title">시스템 로그 기능</div>
        <div className="feature-description">
          시스템의 모든 활동을 추적하고 분석할 수 있는 
          강력한 로그 관리 기능이 곧 추가됩니다.
        </div>
        
        <div className="features-list">
          <ul>
            <li>사용자 활동 로그</li>
            <li>시스템 이벤트 추적</li>
            <li>오류 및 예외 상황 모니터링</li>
            <li>API 호출 기록</li>
            <li>데이터 변경 이력</li>
            <li>로그 검색 및 필터링</li>
          </ul>
        </div>
        
        <span className="coming-soon">개발 중...</span>
      </FeatureCard>
    </Container>
  );
};

export default LogsPage;