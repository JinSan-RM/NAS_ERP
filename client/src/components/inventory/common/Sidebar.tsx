// client/src/components/common/Sidebar.tsx
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
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
  Menu,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: 100%;
  height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const SidebarHeader = styled.div<{ collapsed: boolean }>`
  padding: ${props => props.collapsed ? '20px 10px' : '20px'};
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: ${props => props.collapsed ? 'center' : 'space-between'};
  min-height: 80px;
`;

const Logo = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  
  h1 {
    font-size: ${props => props.collapsed ? '0' : '1.5rem'};
    font-weight: 600;
    margin: 0;
    opacity: ${props => props.collapsed ? '0' : '1'};
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .logo-icon {
    min-width: 32px;
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ToggleButton = styled.button<{ collapsed: boolean }>`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background 0.3s ease;
  display: ${props => props.collapsed ? 'none' : 'flex'};
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const CompanyInfo = styled.div<{ collapsed: boolean }>`
  text-align: center;
  padding: ${props => props.collapsed ? '10px 5px' : '15px 20px'};
  opacity: ${props => props.collapsed ? '0' : '0.8'};
  font-size: 0.9rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow: hidden;
  max-height: ${props => props.collapsed ? '0' : '60px'};
`;

const Navigation = styled.nav`
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }
`;

const NavGroup = styled.div<{ collapsed: boolean }>`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const NavGroupTitle = styled.div<{ collapsed: boolean }>`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.6);
  padding: 0 ${props => props.collapsed ? '20px' : '20px'};
  margin-bottom: 10px;
  opacity: ${props => props.collapsed ? '0' : '1'};
  height: ${props => props.collapsed ? '0' : 'auto'};
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

const NavLinkStyled = styled(NavLink)<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px ${props => props.collapsed ? '28px' : '20px'};
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
    min-width: 20px;
    width: 20px;
    height: 20px;
    margin-right: ${props => props.collapsed ? '0' : '15px'};
    transition: margin 0.3s ease;
  }
  
  .nav-text {
    font-size: 0.95rem;
    font-weight: 500;
    opacity: ${props => props.collapsed ? '0' : '1'};
    transform: translateX(${props => props.collapsed ? '-10px' : '0'});
    transition: all 0.3s ease;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .nav-badge {
    margin-left: auto;
    background: #e74c3c;
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
    opacity: ${props => props.collapsed ? '0' : '1'};
    transition: all 0.3s ease;
  }
`;

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  white-space: nowrap;
  margin-left: 10px;
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
    border: 5px solid transparent;
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

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const location = useLocation();

  const mainMenuItems = [
    { path: '/dashboard', label: '대시보드', icon: LayoutDashboard },
    { path: '/purchase-requests', label: '구매 요청', icon: ShoppingCart, badge: 3 },
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
    
    return (
      <NavItem key={item.path}>
        <NavItemWithTooltip>
          <NavLinkStyled 
            to={item.path} 
            collapsed={collapsed}
            className={isActive ? 'active' : ''}
          >
            <Icon className="nav-icon" size={20} />
            <span className="nav-text">{item.label}</span>
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLinkStyled>
          {collapsed && (
            <Tooltip show={collapsed} className="tooltip">
              {item.label}
            </Tooltip>
          )}
        </NavItemWithTooltip>
      </NavItem>
    );
  };

  return (
    <SidebarContainer collapsed={collapsed}>
      <SidebarHeader collapsed={collapsed}>
        <Logo collapsed={collapsed}>
          <div className="logo-icon">
            <Package size={20} />
          </div>
          <h1>ERP 시스템</h1>
        </Logo>
        <ToggleButton collapsed={collapsed} onClick={onToggle}>
          <ChevronLeft size={20} />
        </ToggleButton>
      </SidebarHeader>

      <CompanyInfo collapsed={collapsed}>
        업무 자동화 및 관리
      </CompanyInfo>

      <Navigation>
        <NavGroup collapsed={collapsed}>
          <NavGroupTitle collapsed={collapsed}>주요 기능</NavGroupTitle>
          <NavList>
            {mainMenuItems.map(renderNavItem)}
          </NavList>
        </NavGroup>

        <NavGroup collapsed={collapsed}>
          <NavGroupTitle collapsed={collapsed}>데이터 관리</NavGroupTitle>
          <NavList>
            {dataMenuItems.map(renderNavItem)}
          </NavList>
        </NavGroup>

        <NavGroup collapsed={collapsed}>
          <NavGroupTitle collapsed={collapsed}>시스템 관리</NavGroupTitle>
          <NavList>
            {managementMenuItems.map(renderNavItem)}
          </NavList>
        </NavGroup>
      </Navigation>
    </SidebarContainer>
  );
};

export default Sidebar;