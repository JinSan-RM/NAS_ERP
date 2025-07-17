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

// client/src/components/common/Card.tsx
import React from 'react';
import styled from 'styled-components';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  hover?: boolean;
}

const CardContainer = styled.div<{ padding?: string; hover?: boolean }>`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
  padding: ${props => props.padding || props.theme.spacing.lg};
  transition: all 0.2s ease;
  
  ${props => props.hover && `
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.md};
    }
  `}
`;

const Card: React.FC<CardProps> = ({ children, className, padding, hover = false }) => {
  return (
    <CardContainer className={className} padding={padding} hover={hover}>
      {children}
    </CardContainer>
  );
};

export default Card;

// client/src/components/common/Button.tsx
import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const ButtonContainer = styled.button<{ 
  variant: string; 
  size: string; 
  disabled: boolean; 
  loading: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.spacing.sm};
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  /* 크기별 스타일 */
  ${props => {
    switch (props.size) {
      case 'sm':
        return `
          padding: 6px 12px;
          font-size: 0.875rem;
          min-height: 32px;
        `;
      case 'lg':
        return `
          padding: 12px 24px;
          font-size: 1.125rem;
          min-height: 48px;
        `;
      default:
        return `
          padding: 8px 16px;
          font-size: 1rem;
          min-height: 40px;
        `;
    }
  }}
  
  /* 변형별 스타일 */
  ${props => {
    const { colors } = props.theme;
    switch (props.variant) {
      case 'secondary':
        return `
          background: ${colors.gray};
          color: white;
          &:hover:not(:disabled) {
            background: ${colors.gray}dd;
            transform: translateY(-1px);
          }
        `;
      case 'success':
        return `
          background: ${colors.success};
          color: white;
          &:hover:not(:disabled) {
            background: ${colors.success}dd;
            transform: translateY(-1px);
          }
        `;
      case 'warning':
        return `
          background: ${colors.warning};
          color: white;
          &:hover:not(:disabled) {
            background: ${colors.warning}dd;
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: ${colors.error};
          color: white;
          &:hover:not(:disabled) {
            background: ${colors.error}dd;
            transform: translateY(-1px);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
          &:hover:not(:disabled) {
            background: ${colors.primary}10;
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
          color: white;
          &:hover:not(:disabled) {
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.md};
          }
        `;
    }
  }}
  
  /* 비활성화 상태 */
  ${props => props.disabled && `
    opacity: 0.6;
    cursor: not-allowed;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  `}
  
  /* 로딩 상태 */
  ${props => props.loading && `
    cursor: wait;
    &:hover {
      transform: none;
    }
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className,
}) => {
  return (
    <ButtonContainer
      variant={variant}
      size={size}
      disabled={disabled || loading}
      loading={loading}
      onClick={onClick}
      type={type}
      className={className}
    >
      {loading && <LoadingSpinner />}
      {children}
    </ButtonContainer>
  );
};

export default Button;