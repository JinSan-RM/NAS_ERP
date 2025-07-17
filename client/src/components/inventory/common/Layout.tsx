import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import Header from '../../common/Header';

const LayoutContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.theme.colors?.background || '#f8fafc'};
`;

const MainContent = styled.main<{ sidebarOpen: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-left: ${props => props.sidebarOpen ? '250px' : '70px'};
  transition: margin-left 0.3s ease;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
`;

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <LayoutContainer>
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
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