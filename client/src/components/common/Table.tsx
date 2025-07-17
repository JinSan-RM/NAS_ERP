// client/src/components/common/Table.tsx
import React from 'react';
import styled from 'styled-components';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { TableColumn } from '../../types';

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  selectable?: boolean;
  selectedItems?: any[];
  onSelectItems?: (items: any[]) => void;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
}

const TableContainer = styled.div`
  overflow-x: auto;
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.surface};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

const TableHeader = styled.thead`
  background: ${props => props.theme.colors.background};
  border-bottom: 2px solid ${props => props.theme.colors.border};
`;

const TableHeaderCell = styled.th<{ sortable?: boolean; width?: string; align?: string }>`
  padding: ${props => props.theme.spacing.md};
  text-align: ${props => props.align || 'left'};
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${props => props.theme.colors.background};
  
  ${props => props.width && `width: ${props.width};`}
  
  ${props => props.sortable && `
    cursor: pointer;
    user-select: none;
    
    &:hover {
      background: ${props.theme.colors.border};
    }
  `}
`;

const SortButton = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
`;

const SortIcon = styled.div<{ active?: boolean; direction?: string }>`
  display: flex;
  flex-direction: column;
  opacity: ${props => props.active ? 1 : 0.3};
  
  svg {
    width: 12px;
    height: 12px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr<{ selected?: boolean }>`
  transition: background-color 0.15s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
  }
  
  ${props => props.selected && `
    background: ${props.theme.colors.primary}10;
  `}
`;

const TableCell = styled.td<{ align?: string }>`
  padding: ${props => props.theme.spacing.md};
  text-align: ${props => props.align || 'left'};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  vertical-align: top;
  
  &:first-child {
    border-left: none;
  }
  
  &:last-child {
    border-right: none;
  }
`;

const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  
  .empty-icon {
    font-size: 3rem;
    margin-bottom: ${props => props.theme.spacing.md};
    opacity: 0.3;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.colors.textSecondary};
  
  .loading-spinner {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 3px solid ${props => props.theme.colors.border};
    border-top: 3px solid ${props => props.theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: ${props => props.theme.spacing.md};
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

function Table<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = '데이터가 없습니다.',
  selectable = false,
  selectedItems = [],
  onSelectItems,
  onSort,
  sortField,
  sortDirection
}: TableProps<T>) {
  const handleSelectAll = (checked: boolean) => {
    if (onSelectItems) {
      onSelectItems(checked ? data : []);
    }
  };

  const handleSelectItem = (item: T, checked: boolean) => {
    if (onSelectItems) {
      if (checked) {
        onSelectItems([...selectedItems, item]);
      } else {
        onSelectItems(selectedItems.filter(selected => selected !== item));
      }
    }
  };

  const handleSort = (field: string) => {
    if (!onSort) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortField === field && sortDirection === 'asc') {
      direction = 'desc';
    }
    
    onSort(field, direction);
  };

  const isAllSelected = data.length > 0 && selectedItems.length === data.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;

  return (
    <TableContainer>
      <StyledTable>
        <TableHeader>
          <tr>
            {selectable && (
              <TableHeaderCell width="40px">
                <Checkbox
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableHeaderCell>
            )}
            {columns.map((column) => (
              <TableHeaderCell
                key={String(column.key)}
                width={column.width}
                align={column.align}
                sortable={column.sortable}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                {column.sortable ? (
                  <SortButton>
                    {column.label}
                    <SortIcon 
                      active={sortField === column.key}
                      direction={sortDirection}
                    >
                      <ChevronUp />
                      <ChevronDown />
                    </SortIcon>
                  </SortButton>
                ) : (
                  column.label
                )}
              </TableHeaderCell>
            ))}
          </tr>
        </TableHeader>
        <TableBody>
          {loading ? (
            <tr>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                <LoadingState>
                  <div className="loading-spinner" />
                  <div>로딩 중...</div>
                </LoadingState>
              </TableCell>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <TableCell colSpan={columns.length + (selectable ? 1 : 0)}>
                <EmptyState>
                  <div className="empty-icon">📋</div>
                  <div>{emptyMessage}</div>
                </EmptyState>
              </TableCell>
            </tr>
          ) : (
            data.map((item, index) => {
              const isSelected = selectedItems.includes(item);
              
              return (
                <TableRow key={index} selected={isSelected}>
                  {selectable && (
                    <TableCell>
                      <Checkbox
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectItem(item, e.target.checked)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => {
                    const value = item[column.key];
                    const displayValue = column.render 
                      ? column.render(value, item) 
                      : value;
                    
                    return (
                      <TableCell key={String(column.key)} align={column.align}>
                        {displayValue}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
}

export default Table;

// client/src/components/common/Modal.tsx
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { X } from 'lucide-react';
import { ModalProps } from '../../types';

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${props => props.theme.spacing.lg};
  animation: fadeIn 0.2s ease-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div<{ size: string }>`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease-out;
  position: relative;
  
  ${props => {
    switch (props.size) {
      case 'sm':
        return 'width: 100%; max-width: 400px;';
      case 'lg':
        return 'width: 100%; max-width: 800px;';
      case 'xl':
        return 'width: 100%; max-width: 1200px;';
      default:
        return 'width: 100%; max-width: 600px;';
    }
  }}
  
  @keyframes slideIn {
    from {
      transform: scale(0.95) translateY(-10px);
      opacity: 0;
    }
    to {
      transform: scale(1) translateY(0);
      opacity: 1;
    }
  }
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    margin: ${props => props.theme.spacing.md};
    max-width: calc(100vw - ${props => props.theme.spacing.lg});
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const ModalTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
  }
`;

const ModalContent = styled.div`
  padding: ${props => props.theme.spacing.lg};
`;

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closable = true
}) => {
  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closable) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, closable]);

  // 오버레이 클릭으로 모달 닫기
  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closable) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClick={handleOverlayClick}>
      <ModalContainer size={size}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {closable && (
            <CloseButton onClick={onClose}>
              <X size={20} />
            </CloseButton>
          )}
        </ModalHeader>
        <ModalContent>
          {children}
        </ModalContent>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default Modal;

// client/src/components/common/Input.tsx
import React from 'react';
import styled from 'styled-components';

interface InputProps {
  type?: string;
  value?: string | number;
  defaultValue?: string | number;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  label?: string;
  name?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const InputLabel = styled.label<{ required?: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  
  ${props => props.required && `
    &::after {
      content: ' *';
      color: ${props.theme.colors.error};
    }
  `}
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary}20;
  }
  
  &:disabled {
    background: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.textSecondary};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.xs};
`;

const Input: React.FC<InputProps> = ({
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  error,
  label,
  name,
  className,
  onChange,
  onBlur,
  onFocus
}) => {
  return (
    <InputContainer className={className}>
      {label && (
        <InputLabel htmlFor={name} required={required}>
          {label}
        </InputLabel>
      )}
      <StyledInput
        id={name}
        name={name}
        type={type}
        value={value}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        hasError={!!error}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default Input;

// client/src/components/common/PageHeader.tsx
import React from 'react';
import styled from 'styled-components';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

const HeaderContainer = styled.div`
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const HeaderTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${props => props.theme.spacing.md};
  }
`;

const HeaderInfo = styled.div`
  flex: 1;
`;

const HeaderTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  margin: 0;
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const HeaderSubtitle = styled.p`
  font-size: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.xs};
  font-size: 0.9rem;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const BreadcrumbItem = styled.span<{ isLast?: boolean }>`
  color: ${props => props.isLast ? props.theme.colors.text : props.theme.colors.textSecondary};
  
  ${props => !props.isLast && `
    &::after {
      content: '/';
      margin-left: ${props.theme.spacing.xs};
      color: ${props.theme.colors.textSecondary};
    }
  `}
  
  ${props => !props.isLast && `
    cursor: pointer;
    
    &:hover {
      color: ${props.theme.colors.primary};
    }
  `}
`;

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  breadcrumbs
}) => {
  return (
    <HeaderContainer>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem 
              key={index} 
              isLast={index === breadcrumbs.length - 1}
            >
              {item.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumbs>
      )}
      
      <HeaderTop>
        <HeaderInfo>
          <HeaderTitle>{title}</HeaderTitle>
          {subtitle && <HeaderSubtitle>{subtitle}</HeaderSubtitle>}
        </HeaderInfo>
        
        {children && (
          <HeaderActions>
            {children}
          </HeaderActions>
        )}
      </HeaderTop>
    </HeaderContainer>
  );
};

export default PageHeader;