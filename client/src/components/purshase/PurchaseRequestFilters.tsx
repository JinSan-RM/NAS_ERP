// client/src/components/purchase/PurchaseRequestFilters.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Filter } from 'lucide-react';

interface SearchFilters {
  search?: string;
  status?: string;
  dateFrom?: string;
  dateTo?: string;
}

interface PurchaseRequestFiltersProps {
  onFilter: (filters: SearchFilters) => void;
}

// 🎨 깔끔한 한줄 필터 스타일 (높이 통일, 줄바꿈 방지)
const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
  /* flex-wrap 제거 - 한 줄 강제 유지 */
  
  @media (max-width: 768px) {
    gap: 8px;
    overflow-x: auto; /* 모바일에서는 가로 스크롤 */
  }
`;

// 공통 스타일 (높이 통일)
const commonInputStyle = `
  height: 32px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  background: white;
  box-sizing: border-box;
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterInput = styled.input`
  ${commonInputStyle}
  
  &::placeholder {
    color: #6b7280;
  }
`;

const FilterSelect = styled.select`
  ${commonInputStyle}
  min-width: 120px;
  cursor: pointer;
`;

const DateSeparator = styled.span`
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  display: flex;
  align-items: center;
`;

const ResetButton = styled.button`
  ${commonInputStyle}
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    color: #374151;
  }
  
  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const PurchaseRequestFilters: React.FC<PurchaseRequestFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value || undefined };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <FilterContainer>
      {/* 검색창 */}
      <FilterInput
        type="text"
        placeholder="품목명 또는 요청자로 검색..."
        value={filters.search || ''}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        style={{ width: '200px', flexShrink: 0 }}
      />
      
      {/* 상태 선택 */}
      <FilterSelect
        value={filters.status || ''}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        style={{ flexShrink: 0 }}
      >
        <option value="">전체 상태</option>
        <option value="SUBMITTED">요청됨</option>
        <option value="COMPLETED">완료됨</option>
        <option value="CANCELLED">취소됨</option>
      </FilterSelect>

      {/* 날짜 범위 */}
      <FilterInput
        type="date"
        placeholder="시작일"
        value={filters.dateFrom || ''}
        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
        style={{ flexShrink: 0 }}
      />
      
      <DateSeparator>~</DateSeparator>
      
      <FilterInput
        type="date"
        placeholder="종료일"
        value={filters.dateTo || ''}
        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
        style={{ flexShrink: 0 }}
      />
      
      {/* 초기화 버튼 */}
      <ResetButton onClick={handleReset} type="button" style={{ flexShrink: 0 }}>
        <Filter size={16} />
        초기화
      </ResetButton>
    </FilterContainer>
  );
};

export default PurchaseRequestFilters;