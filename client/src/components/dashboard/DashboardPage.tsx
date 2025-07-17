// client/src/components/dashboard/DashboardPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useQuery } from 'react-query';
import { 
  Package, 
  ShoppingCart, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Users, 
  DollarSign,
  AlertTriangle 
} from 'lucide-react';
import PageHeader from '../common/PageHeader';
import Card from '../common/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { dashboardApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
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
  const { data: stats, isLoading, error } = useQuery(
    'dashboard-stats',
    dashboardApi.getStats,
    {
      refetchInterval: 5 * 60 * 1000, // 5분마다 새로고침
    }
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>대시보드 데이터를 불러오는 중 오류가 발생했습니다.</p>
          </div>
        </Card>
      </Container>
    );
  }

  const dashboardStats = stats?.data;

  return (
    <Container>
      <PageHeader
        title="대시보드"
        subtitle="시스템 현황을 한눈에 확인하세요."
      />

      <StatsGrid>
        <StatCard color="#3B82F6">
          <div className="stat-header">
            <div>
              <div className="stat-value">{dashboardStats?.purchaseRequests?.total || 0}</div>
              <div className="stat-label">전체 구매 요청</div>
            </div>
            <div className="stat-icon">
              <ShoppingCart size={24} />
            </div>
          </div>
          <div className="stat-change positive">
            이번 달 +{dashboardStats?.purchaseRequests?.thisMonth || 0}
          </div>
        </StatCard>

        <StatCard color="#F59E0B">
          <div className="stat-header">
            <div>
              <div className="stat-value">{dashboardStats?.purchaseRequests?.pending || 0}</div>
              <div className="stat-label">승인 대기</div>
            </div>
            <div className="stat-icon">
              <Clock size={24} />
            </div>
          </div>
        </StatCard>

        <StatCard color="#10B981">
          <div className="stat-header">
            <div>
              <div className="stat-value">{dashboardStats?.inventory?.receivedItems || 0}</div>
              <div className="stat-label">수령 완료</div>
            </div>
            <div className="stat-icon">
              <CheckCircle size={24} />
            </div>
          </div>
        </StatCard>

        <StatCard color="#8B5CF6">
          <div className="stat-header">
            <div>
              <div className="stat-value">₩{(dashboardStats?.budget?.usedBudget || 0).toLocaleString()}</div>
              <div className="stat-label">사용 예산</div>
            </div>
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
          </div>
          <div className="stat-change">
            활용률 {dashboardStats?.budget?.utilizationRate || 0}%
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
            {dashboardStats?.recentReceipts?.slice(0, 5).map((receipt: any, index: number) => (
              <div key={receipt.id} className="activity-item">
                <div 
                  className="activity-icon"
                  style={{ background: '#10B98120', color: '#10B981' }}
                >
                  <Package size={20} />
                </div>
                <div className="activity-content">
                  <div className="activity-title">
                    {receipt.itemName} 수령 완료
                  </div>
                  <div className="activity-time">
                    {receipt.receiverName} • {new Date(receipt.receivedDate).toLocaleString('ko-KR')}
                  </div>
                </div>
              </div>
            )) || (
              <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                최근 활동이 없습니다.
              </div>
            )}
          </div>
        </RecentActivity>

        <QuickActions>
          <h3>빠른 작업</h3>
          <div className="actions-grid">
            <a href="/purchase-requests" className="action-item">
              <div className="action-icon">
                <ShoppingCart size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">구매 요청</div>
                <div className="action-desc">새로운 구매 요청 등록</div>
              </div>
            </a>

            <a href="/inventory" className="action-item">
              <div className="action-icon">
                <Package size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">품목 관리</div>
                <div className="action-desc">재고 현황 확인</div>
              </div>
            </a>

            <a href="/receipts" className="action-item">
              <div className="action-icon">
                <CheckCircle size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">수령 처리</div>
                <div className="action-desc">물품 수령 등록</div>
              </div>
            </a>

            <a href="/kakao" className="action-item">
              <div className="action-icon">
                <AlertTriangle size={20} />
              </div>
              <div className="action-content">
                <div className="action-title">카톡 처리</div>
                <div className="action-desc">메시지 파싱</div>
              </div>
            </a>
          </div>
        </QuickActions>
      </ContentGrid>
    </Container>
  );
};

export default DashboardPage;