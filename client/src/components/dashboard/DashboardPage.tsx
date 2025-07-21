// client/src/components/dashboard/DashboardPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  DollarSign,
  AlertTriangle 
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import { dashboardApi } from '../../services/api';

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(Card)<{ color: string }>`
  background: linear-gradient(135deg, ${props => props.color}15 0%, ${props => props.color}05 100%);
  border-left: 4px solid ${props => props.color};
  
  .stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .stat-icon {
    padding: 12px;
    border-radius: 50%;
    background: ${props => props.color}20;
    color: ${props => props.color};
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: bold;
    color: ${props => props.color};
    margin-bottom: 5px;
  }
  
  .stat-label {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
  
  .stat-change {
    font-size: 0.8rem;
    margin-top: 8px;
    
    &.positive {
      color: ${props => props.theme.colors.success};
    }
    
    &.negative {
      color: ${props => props.theme.colors.error};
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const RecentActivity = styled(Card)`
  .activity-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      font-size: 1.2rem;
    }
  }
  
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .activity-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    transition: background 0.2s;
    
    &:hover {
      background: ${props => props.theme.colors.background};
    }
  }
  
  .activity-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .activity-content {
    flex: 1;
    
    .activity-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .activity-time {
      font-size: 0.8rem;
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const QuickActions = styled(Card)`
  h3 {
    margin-bottom: 20px;
    font-size: 1.2rem;
  }
  
  .actions-grid {
    display: grid;
    gap: 12px;
  }
  
  .action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    border: 1px solid ${props => props.theme.colors.border};
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    text-decoration: none;
    color: inherit;
    
    &:hover {
      border-color: ${props => props.theme.colors.primary};
      background: ${props => props.theme.colors.primary}05;
      transform: translateY(-1px);
    }
  }
  
  .action-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.colors.primary}15;
    color: ${props => props.theme.colors.primary};
  }
  
  .action-content {
    .action-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .action-desc {
      font-size: 0.85rem;
      color: ${props => props.theme.colors.textSecondary};
    }
  }
`;

const DashboardPage: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 5 * 60 * 1000, // 5분마다 새로고침
    retry: 3,
    staleTime: 1000 * 60 * 5, // 5분
  });

  console.log('Dashboard data:', { stats, isLoading, error }); // 디버깅용

  if (isLoading) {
    return <LoadingSpinner text="대시보드 데이터를 불러오는 중..." />;
  }

  if (error) {
    console.error('Dashboard error:', error);
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <AlertTriangle size={48} style={{ color: '#EF4444', marginBottom: '16px' }} />
            <h3>데이터를 불러올 수 없습니다</h3>
            <p style={{ marginBottom: '20px' }}>대시보드 데이터를 불러오는 중 오류가 발생했습니다.</p>
            <Button onClick={() => window.location.reload()}>
              새로고침
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // 백엔드에서 받은 데이터 또는 기본값 사용
  const dashboardStats = stats?.data || {};

  return (
    <Container>
      <PageTitle>대시보드</PageTitle>
      <PageSubtitle>시스템 현황을 한눈에 확인하세요.</PageSubtitle>

      <StatsGrid>
        <StatCard color="#3B82F6">
          <div className="stat-header">
            <div>
              <div className="stat-value">{dashboardStats?.totalItems || 0}</div>
              <div className="stat-label">전체 품목</div>
            </div>
            <div className="stat-icon">
              <Package size={24} />
            </div>
          </div>
          <div className="stat-change positive">
            이번 달 +{dashboardStats?.newItemsThisMonth || 0}
          </div>
        </StatCard>

        <StatCard color="#F59E0B">
          <div className="stat-header">
            <div>
              <div className="stat-value">{dashboardStats?.lowStockItems || 0}</div>
              <div className="stat-label">재고 부족</div>
            </div>
            <div className="stat-icon">
              <AlertTriangle size={24} />
            </div>
          </div>
        </StatCard>

        <StatCard color="#10B981">
          <div className="stat-header">
            <div>
              <div className="stat-value">{dashboardStats?.recentPurchases || 0}</div>
              <div className="stat-label">최근 구매</div>
            </div>
            <div className="stat-icon">
              <ShoppingCart size={24} />
            </div>
          </div>
        </StatCard>

        <StatCard color="#8B5CF6">
          <div className="stat-header">
            <div>
              <div className="stat-value">₩{(dashboardStats?.totalValue || 0).toLocaleString()}</div>
              <div className="stat-label">총 재고 가치</div>
            </div>
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
          </div>
        </StatCard>
      </StatsGrid>

      <ContentGrid>
        <RecentActivity>
          <div className="activity-header">
            <h3>최근 활동</h3>
            <span style={{ fontSize: '0.9rem', color: '#666' }}>최근 24시간</span>
          </div>
          
          <div className="activity-list">
            {dashboardStats?.recentActivities?.length > 0 ? (
              dashboardStats.recentActivities.slice(0, 5).map((activity: any, index: number) => (
                <div key={activity.id || index} className="activity-item">
                  <div 
                    className="activity-icon"
                    style={{ background: '#10B98120', color: '#10B981' }}
                  >
                    <Package size={20} />
                  </div>
                  <div className="activity-content">
                    <div className="activity-title">
                      {activity.description || '활동 없음'}
                    </div>
                    <div className="activity-time">
                      {activity.createdAt ? new Date(activity.createdAt).toLocaleString('ko-KR') : '시간 정보 없음'}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                최근 활동이 없습니다.
              </div>
            )}
          </div>
        </RecentActivity>

        <QuickActions>
          <h3>빠른 작업</h3>
          <div className="actions-grid">
            <a href="/inventory" className="action-item">
              <div className="action-icon">
                <Package size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">재고 관리</div>
                <div className="action-desc">품목 현황 확인 및 관리</div>
              </div>
            </a>

            <a href="/upload" className="action-item">
              <div className="action-icon">
                <ShoppingCart size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">파일 업로드</div>
                <div className="action-desc">Excel로 일괄 등록</div>
              </div>
            </a>

            <a href="/statistics" className="action-item">
              <div className="action-icon">
                <CheckCircle size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">통계 분석</div>
                <div className="action-desc">현황 분석 및 리포트</div>
              </div>
            </a>
          </div>
        </QuickActions>
      </ContentGrid>
    </Container>
  );
};

export default DashboardPage;