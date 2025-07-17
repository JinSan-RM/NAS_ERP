// client/src/components/inventory/InventoryFilters.tsx
import React from 'react';
import styled from 'styled-components';
import { Search, Filter } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchGroup = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 40px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #6b7280;
`;

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #f9fafb;
  }
`;

interface InventoryFiltersProps {
  searchTerm?: string;
  category?: string;
  location?: string;
  onSearchChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
  onLocationChange?: (value: string) => void;
  onFilter?: () => void;
}

const InventoryFilters: React.FC<InventoryFiltersProps> = ({
  searchTerm = '',
  category = '',
  location = '',
  onSearchChange = () => {},
  onCategoryChange = () => {},
  onLocationChange = () => {},
  onFilter = () => {},
}) => {
  return (
    <FilterContainer>
      <SearchGroup>
        <SearchIcon />
        <SearchInput
          type="text"
          placeholder="품목명으로 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </SearchGroup>

      <Select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">전체 카테고리</option>
        <option value="사무용품">사무용품</option>
        <option value="전자기기">전자기기</option>
        <option value="소모품">소모품</option>
        <option value="기타">기타</option>
      </Select>

      <Select
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
      >
        <option value="">전체 위치</option>
        <option value="창고A">창고A</option>
        <option value="창고B">창고B</option>
        <option value="사무실">사무실</option>
        <option value="기타">기타</option>
      </Select>

      <FilterButton onClick={onFilter}>
        <Filter size={16} />
        필터 적용
      </FilterButton>
    </FilterContainer>
  );
};

export default InventoryFilters;