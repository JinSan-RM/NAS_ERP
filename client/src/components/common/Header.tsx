// client/src/components/common/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Menu, Bell, User, Search, LogOut } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${props => props.theme.spacing.lg};
  height: 64px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 8px 12px 8px 40px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.colors.textSecondary};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.error};
  border-radius: 50%;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    .user-name {
      display: none;
    }
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={onToggleSidebar}>
          <Menu size={20} />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon size={16} />
          <SearchInput 
            type="text" 
            placeholder="검색..." 
          />
        </SearchContainer>
      </HeaderLeft>

      <HeaderRight>
        <IconButton>
          <Bell size={20} />
          <NotificationBadge />
        </IconButton>
        
        <UserInfo>
          <UserAvatar>
            관
          </UserAvatar>
          <span className="user-name">관리자</span>
        </UserInfo>
        
        <IconButton>
          <LogOut size={18} />
        </IconButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;

