// client/src/components/purchase/PurchaseRequestFilters.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Filter } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { SearchFilters, RequestStatus, UrgencyLevel } from '../../types';
import { STATUS_LABELS, URGENCY_LABELS } from '../../types';

interface PurchaseRequestFiltersProps {
  onFilter: (filters: SearchFilters) => void;
}

const FilterContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: end;
  flex-wrap: wrap;
`;

const statusOptions = [
  { value: '', label: '전체 상태' },
  ...Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))
];

const urgencyOptions = [
  { value: '', label: '전체 긴급도' },
  ...Object.entries(URGENCY_LABELS).map(([value, label]) => ({ value, label }))
];

const PurchaseRequestFilters: React.FC<PurchaseRequestFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<SearchFilters>({});

  const handleFilterChange = (field: string, value: string) => {
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
      <Input
        placeholder="품목명 또는 요청번호로 검색..."
        value={filters.search || ''}
        onChange={(e) => handleFilterChange('search', e.target.value)}
      />
      
      <Select
        placeholder="긴급도"
        value={filters.urgency || ''}
        options={urgencyOptions}
        onChange={(value) => handleFilterChange('urgency', value as string)}
      />
      
      <Input
        placeholder="부서"
        value={filters.department || ''}
        onChange={(e) => handleFilterChange('department', e.target.value)}
      />
      
      <Input
        label="시작일"
        type="date"
        value={filters.dateFrom || ''}
        onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
      />
      
      <Input
        label="종료일"
        type="date"
        value={filters.dateTo || ''}
        onChange={(e) => handleFilterChange('dateTo', e.target.value)}
      />
      
      <Button variant="outline" onClick={handleReset}>
        <Filter size={16} />
        초기화
      </Button>
    </FilterContainer>
  );
};

export default PurchaseRequestFilters;