// client/src/components/inventory/common/Sidebar.tsx - 안전한 에러 처리 버전
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  ClipboardCheck,
  MessageSquare,
  Upload,
  BarChart3,
  History,
  Settings,
  Users,
  Building,
  CreditCard,
  Bell,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { purchaseApi } from '../../services/api';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

// 스타일 컴포넌트들 (기존과 동일)
const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: ${props => props.isOpen ? '240px' : '60px'};
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
`;

const SidebarHeader = styled.div<{ isOpen: boolean }>`
  padding: ${props => props.isOpen ? '16px' : '16px 8px'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${props => props.isOpen ? 'space-between' : 'center'};
  min-height: 60px;
  position: relative;
`;

const Logo = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isOpen ? '8px' : '0'};
  
  .logo-icon {
    min-width: 28px;
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  
  .logo-text {
    font-size: ${props => props.isOpen ? '1.1rem' : '0'};
    font-weight: 600;
    margin: 0;
    opacity: ${props => props.isOpen ? '1' : '0'};
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const ToggleButton = styled.button<{ isOpen: boolean }>`
  position: absolute;
  right: ${props => props.isOpen ? '8px' : '-15px'};
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.isOpen ? 'rgba(255, 255, 255, 0.1)' : '#2c3e50'};
  border: ${props => props.isOpen ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  color: white;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  z-index: 1001;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 12px 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 3px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const NavGroup = styled.div<{ isOpen: boolean }>`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NavGroupTitle = styled.div<{ isOpen: boolean }>`
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.5);
  padding: 0 ${props => props.isOpen ? '16px' : '12px'};
  margin-bottom: 8px;
  opacity: ${props => props.isOpen ? '1' : '0'};
  height: ${props => props.isOpen ? 'auto' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-bottom: 2px;
`;

const NavLinkStyled = styled(NavLink)<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: ${props => props.isOpen ? '10px 16px' : '10px 16px'};
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  border-left: 3px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border-left-color: #3498db;
  }
  
  &.active {
    background: rgba(255, 255, 255, 0.15);
    color: white;
    border-left-color: #3498db;
    
    &::before {
      content: '';
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: #3498db;
    }
  }
  
  .nav-icon {
    min-width: 18px;
    width: 18px;
    height: 18px;
    margin-right: ${props => props.isOpen ? '12px' : '0'};
    transition: margin 0.3s ease;
    flex-shrink: 0;
  }
  
  .nav-text {
    font-size: 0.9rem;
    font-weight: 500;
    opacity: ${props => props.isOpen ? '1' : '0'};
    transform: translateX(${props => props.isOpen ? '0' : '-10px'});
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
`;

// 🔥 동적 알림 배지 컴포넌트
const NavBadge = styled.span<{ isOpen: boolean; count: number }>`
  margin-left: auto;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(231, 76, 60, 0.3);
  
  /* 펄스 애니메이션 */
  animation: ${props => props.count > 0 ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
      opacity: ${props => props.isOpen ? '1' : '0'};
    }
    50% {
      transform: scale(1.1);
      opacity: ${props => props.isOpen ? '0.8' : '0'};
    }
  }
`;

// 🔥 축소 상태에서의 알림 점
const CompactNotification = styled.div<{ show: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: #e74c3c;
  border-radius: 50%;
  opacity: ${props => props.show ? '1' : '0'};
  transition: opacity 0.3s ease;
  animation: ${props => props.show ? 'pulse-dot 2s infinite' : 'none'};
  
  @keyframes pulse-dot {
    0%, 100% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.7;
    }
  }
`;

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  margin-left: 8px;
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 1000;
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 4px solid transparent;
    border-right-color: rgba(0, 0, 0, 0.8);
  }
`;

const NavItemWithTooltip = styled.div`
  position: relative;
  
  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
  }
`;

// 🔥 API 연결 상태 표시 컴포넌트
const ConnectionStatus = styled.div<{ connected: boolean }>`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.connected ? '#10b981' : '#ef4444'};
  opacity: 0.6;
  transition: all 0.3s ease;
`;

// 🔥 안전한 구매 요청 개수 조회 훅
const usePurchaseRequestCount = () => {
  const [apiConnected, setApiConnected] = useState(false);
  
  const { data: pendingRequestsData, isError } = useQuery({
    queryKey: ['purchase-requests-pending-count'],
    queryFn: async () => {
      try {
        console.log('🔍 구매 요청 개수 조회 시도...');
        
        const response = await purchaseApi.getRequests({
          page: 1,
          limit: 100, // 개수만 확인하므로 적게
        });
        
        console.log('✅ API 연결 성공:', response);
        setApiConnected(true);
        
        // 완료되지 않은 요청만 필터링
        const pendingRequests = response.data.items.filter(
          request => request.status !== 'COMPLETED' && request.status !== 'CANCELLED'
        );
        
        return pendingRequests.length;
      } catch (error) {
        console.warn('⚠️ API 연결 실패, 샘플 모드로 전환:', error.message);
        setApiConnected(false);
        
        // 🔥 샘플 데이터 반환 (데모용)
        return 3; // 샘플: 3개의 미완료 요청
      }
    },
    refetchInterval: apiConnected ? 30000 : 300000, // 연결 시 30초, 미연결 시 5분
    staleTime: 15000, // 15초 캐시
    retry: 1, // 1회만 재시도
    retryDelay: 3000, // 3초 후 재시도
  });

  return {
    pendingCount: pendingRequestsData || 0,
    apiConnected,
    hasError: isError
  };
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { pendingCount, apiConnected } = usePurchaseRequestCount();

  // 🔥 메뉴 아이템들 (동적 배지 포함)
  const mainMenuItems = [
    { path: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    { 
      path: '/purchase-requests', 
      label: '구매 요청', 
      icon: ShoppingCart, 
      dynamicBadge: pendingCount // 동적 배지
    },
    { path: '/inventory', label: '품목 관리', icon: Package },
    { path: '/receipts', label: '수령 관리', icon: ClipboardCheck },
    { path: '/kakao', label: '카톡 처리', icon: MessageSquare },
  ];

  const dataMenuItems = [
    { path: '/upload', label: '파일 관리', icon: Upload },
    { path: '/statistics', label: '통계 분석', icon: BarChart3 },
    { path: '/logs', label: '시스템 로그', icon: History },
  ];

  const managementMenuItems = [
    { path: '/suppliers', label: '공급업체', icon: Building },
    { path: '/budgets', label: '예산 관리', icon: CreditCard },
    { path: '/users', label: '사용자 관리', icon: Users },
    { path: '/notifications', label: '알림 설정', icon: Bell },
    { path: '/settings', label: '시스템 설정', icon: Settings },
  ];

  const renderNavItem = (item: any) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const badgeCount = item.dynamicBadge || item.badge || 0;
    const showBadge = badgeCount > 0;
    
    return (
      <NavItem key={item.path}>
        <NavItemWithTooltip>
          <NavLinkStyled 
            to={item.path} 
            isOpen={isOpen}
            className={isActive ? 'active' : ''}
          >
            <Icon className="nav-icon" size={18} />
            <span className="nav-text">{item.label}</span>
            
            {/* 🔥 동적 알림 배지 (사이드바 열린 상태) */}
            {showBadge && isOpen && (
              <NavBadge isOpen={isOpen} count={badgeCount}>
                {badgeCount > 99 ? '99+' : badgeCount}
              </NavBadge>
            )}
            
            {/* 🔥 축소 상태 알림 점 */}
            {showBadge && !isOpen && (
              <CompactNotification show={!isOpen} />
            )}
          </NavLinkStyled>
          
          {/* 🔥 툴팁 (축소 상태에서만) */}
          {!isOpen && (
            <Tooltip show={!isOpen} className="tooltip">
              {item.label}
              {showBadge && ` (${badgeCount})`}
              {item.path === '/purchase-requests' && !apiConnected && ' [샘플]'}
            </Tooltip>
          )}
        </NavItemWithTooltip>
      </NavItem>
    );
  };

  return (
    <SidebarContainer isOpen={isOpen}>
      <SidebarHeader isOpen={isOpen}>
        <Logo isOpen={isOpen}>
          <div className="logo-icon">
            <Package size={16} />
          </div>
          <h1 className="logo-text">ERP 시스템</h1>
        </Logo>
        <ToggleButton isOpen={isOpen} onClick={onToggle}>
          {isOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </ToggleButton>
        
        {/* 🔥 API 연결 상태 표시 */}
        <ConnectionStatus connected={apiConnected} title={apiConnected ? 'API 연결됨' : 'API 미연결 (샘플 모드)'} />
      </SidebarHeader>

      <Navigation>
        <NavGroup isOpen={isOpen}>
          <NavGroupTitle isOpen={isOpen}>주요 기능</NavGroupTitle>
          <NavList>
            {mainMenuItems.map(renderNavItem)}
          </NavList>
        </NavGroup>

        <NavGroup isOpen={isOpen}>
          <NavGroupTitle isOpen={isOpen}>데이터 관리</NavGroupTitle>
          <NavList>
            {dataMenuItems.map(renderNavItem)}
          </NavList>
        </NavGroup>

        <NavGroup isOpen={isOpen}>
          <NavGroupTitle isOpen={isOpen}>시스템 관리</NavGroupTitle>
          <NavList>
            {managementMenuItems.map(renderNavItem)}
          </NavList>
        </NavGroup>
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;