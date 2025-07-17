// client/src/components/common/Layout.tsx
import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAppStore } from '../../store/appStore';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const SidebarContainer = styled.div<{ collapsed: boolean }>`
  width: ${props => props.collapsed ? '80px' : '280px'};
  transition: width 0.3s ease;
  background: ${props => props.theme.colors.surface};
  border-right: 1px solid ${props => props.theme.colors.border};
  position: fixed;
  height: 100vh;
  z-index: 1000;
  overflow-y: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    width: ${props => props.collapsed ? '0' : '280px'};
    transform: translateX(${props => props.collapsed ? '-100%' : '0'});
  }
`;

const MainContainer = styled.div<{ sidebarCollapsed: boolean }>`
  flex: 1;
  margin-left: ${props => props.sidebarCollapsed ? '80px' : '280px'};
  transition: margin-left 0.3s ease;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    margin-left: 0;
  }
`;

const HeaderContainer = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ContentContainer = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  max-width: 100%;
  overflow-x: auto;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    padding: ${props => props.theme.spacing.md};
  }
`;

const Overlay = styled.div<{ show: boolean }>`
  display: ${props => props.show ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  
  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    display: none;
  }
`;

const Layout: React.FC = () => {
  const location = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore();
  const [isMobile, setIsMobile] = useState(false);

  // 화면 크기 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 모바일에서 경로 변경 시 사이드바 닫기
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [location.pathname, isMobile, setSidebarCollapsed]);

  const handleToggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <LayoutContainer>
      <SidebarContainer collapsed={sidebarCollapsed}>
        <Sidebar 
          collapsed={sidebarCollapsed} 
          onToggle={handleToggleSidebar}
        />
      </SidebarContainer>
      
      <MainContainer sidebarCollapsed={sidebarCollapsed}>
        <HeaderContainer>
          <Header 
            onToggleSidebar={handleToggleSidebar}
            sidebarCollapsed={sidebarCollapsed}
          />
        </HeaderContainer>
        
        <ContentContainer>
          <Outlet />
        </ContentContainer>
      </MainContainer>
      
      <Overlay 
        show={isMobile && !sidebarCollapsed} 
        onClick={handleOverlayClick}
      />
    </LayoutContainer>
  );
};

export default Layout;