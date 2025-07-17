import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from '../../common/Header';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.colors.background};
  overflow: hidden;
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: ${props => props.sidebarOpen ? '280px' : '80px'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.sidebarOpen ? '24px 0 0 0' : '0'};
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.05);
  position: relative;
  z-index: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.gray}20;
    border-radius: 4px;
    
    &:hover {
      background: ${props => props.theme.colors.gray}40;
    }
  }

  /* 컨텐츠가 로드될 때 페이드인 효과 */
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <LayoutContainer>
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)} 
      />
      
      <MainContent sidebarOpen={sidebarOpen}>
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <ContentArea>
          <Outlet />
        </ContentArea>
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;