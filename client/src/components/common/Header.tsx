// client/src/components/common/Header.tsx
import React from 'react';
import styled from 'styled-components';
import { Menu, Bell, User, Search, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const SearchContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 280px;
  padding: 8px 12px 8px 36px;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background};
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
    width: 320px;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 10px;
  color: ${props => props.theme.colors.textSecondary};
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: ${props => props.theme.borderRadius.md};
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.background};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 6px;
  height: 6px;
  background: ${props => props.theme.colors.error};
  border-radius: 50%;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;

  &:hover {
    background: ${props => props.theme.colors.background};
    border-color: ${props => props.theme.colors.border};
  }
  
  @media (max-width: 768px) {
    .user-name {
      display: none;
    }
  }
`;

const UserAvatar = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.8rem;
`;

const UserName = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const Divider = styled.div`
  width: 1px;
  height: 20px;
  background: ${props => props.theme.colors.border};
  margin: 0 4px;
`;

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, sidebarCollapsed }) => {
  return (
    <HeaderContainer>
      <HeaderLeft>
        <MenuButton onClick={onToggleSidebar}>
          <Menu size={18} />
        </MenuButton>
        
        <SearchContainer>
          <SearchIcon size={14} />
          <SearchInput 
            type="text" 
            placeholder="검색어를 입력하세요..." 
          />
        </SearchContainer>
      </HeaderLeft>

      <HeaderRight>
        <IconButton title="알림">
          <Bell size={18} />
          <NotificationBadge />
        </IconButton>
        
        <Divider />
        
        <UserSection>
          <UserAvatar>관</UserAvatar>
          <UserName className="user-name">관리자</UserName>
        </UserSection>
        
        <IconButton title="설정">
          <Settings size={18} />
        </IconButton>
        
        <IconButton title="로그아웃">
          <LogOut size={18} />
        </IconButton>
      </HeaderRight>
    </HeaderContainer>
  );
};

export default Header;