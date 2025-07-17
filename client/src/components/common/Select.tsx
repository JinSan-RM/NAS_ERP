// client/src/components/common/Select.tsx
import React from 'react';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

interface SelectProps {
  value?: string | number;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  name?: string;
  className?: string;
  onChange?: (value: string | number) => void;
}

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const SelectLabel = styled.label<{ required?: boolean }>`
  font-size: 0.9rem;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
`;

const SelectWrapper = styled.div`
  position: relative;
`;

const StyledSelect = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  padding-right: 40px;
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  appearance: none;
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
`;

const SelectIcon = styled(ChevronDown)`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.theme.colors.textSecondary};
  pointer-events: none;
`;

const ErrorMessage = styled.span`
  font-size: 0.8rem;
  color: ${props => props.theme.colors.error};
`;

const Select: React.FC<SelectProps> = ({
  value,
  options,
  placeholder,
  disabled = false,
  error,
  label,
  name,
  className,
  onChange
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (onChange) {
      const selectedValue = e.target.value;
      onChange(selectedValue);
    }
  };

  return (
    <SelectContainer className={className}>
      {label && <SelectLabel htmlFor={name}>{label}</SelectLabel>}
      <SelectWrapper>
        <StyledSelect
          id={name}
          name={name}
          value={value || ''}
          disabled={disabled}
          hasError={!!error}
          onChange={handleChange}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </StyledSelect>
        <SelectIcon size={16} />
      </SelectWrapper>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </SelectContainer>
  );
};

export default Select;

// client/src/components/inventory/InventoryForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import { inventoryApi } from '../../services/api';
import { InventoryItem, ItemCategory, UrgencyLevel, PurchaseMethod } from '../../types';
import { CATEGORY_LABELS, URGENCY_LABELS } from '../../types';

interface InventoryFormProps {
  item?: InventoryItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  grid-column: 1 / -1;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const urgencyOptions = Object.entries(URGENCY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const purchaseMethodOptions = [
  { value: 'direct', label: '직접구매' },
  { value: 'quotation', label: '견적요청' },
  { value: 'contract', label: '계약' },
  { value: 'framework', label: '단가계약' },
  { value: 'marketplace', label: '마켓플레이스' },
];

const InventoryForm: React.FC<InventoryFormProps> = ({ item, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    itemName: item?.itemName || '',
    specifications: item?.specifications || '',
    quantity: item?.quantity || 1,
    unitPrice: item?.unitPrice || 0,
    supplier: item?.supplier || '',
    category: item?.category || 'office_supplies' as ItemCategory,
    urgency: item?.urgency || 'medium' as UrgencyLevel,
    purchaseMethod: item?.purchaseMethod || 'direct' as PurchaseMethod,
    notes: item?.notes || '',
  });

  const createMutation = useMutation(inventoryApi.createItem, {
    onSuccess: () => {
      queryClient.invalidateQueries('inventory');
      toast.success('품목이 등록되었습니다.');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '등록 중 오류가 발생했습니다.');
    },
  });

  const updateMutation = useMutation(
    (data: any) => inventoryApi.updateItem(item!.no, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('inventory');
        toast.success('품목이 수정되었습니다.');
        onSuccess();
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || '수정 중 오류가 발생했습니다.');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      totalPrice: formData.quantity * formData.unitPrice,
    };

    if (item) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isLoading = createMutation.isLoading || updateMutation.isLoading;

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGrid>
        <Input
          label="품목명"
          value={formData.itemName}
          onChange={(e) => handleChange('itemName', e.target.value)}
          required
        />
        
        <Input
          label="공급업체"
          value={formData.supplier}
          onChange={(e) => handleChange('supplier', e.target.value)}
          required
        />
        
        <FormRow>
          <Input
            label="사양"
            value={formData.specifications}
            onChange={(e) => handleChange('specifications', e.target.value)}
          />
        </FormRow>
        
        <Input
          label="수량"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', Number(e.target.value))}
          required
        />
        
        <Input
          label="단가"
          type="number"
          value={formData.unitPrice}
          onChange={(e) => handleChange('unitPrice', Number(e.target.value))}
          required
        />
        
        <Select
          label="카테고리"
          value={formData.category}
          options={categoryOptions}
          onChange={(value) => handleChange('category', value)}
        />
        
        <Select
          label="긴급도"
          value={formData.urgency}
          options={urgencyOptions}
          onChange={(value) => handleChange('urgency', value)}
        />
        
        <Select
          label="구매방법"
          value={formData.purchaseMethod}
          options={purchaseMethodOptions}
          onChange={(value) => handleChange('purchaseMethod', value)}
        />
        
        <FormRow>
          <Input
            label="메모"
            value={formData.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </FormRow>
      </FormGrid>

      <ButtonGroup>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" loading={isLoading}>
          {item ? '수정' : '등록'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default InventoryForm;

// client/src/components/inventory/InventoryFilters.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Search, Filter } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { SearchFilters, ItemCategory, UrgencyLevel } from '../../types';
import { CATEGORY_LABELS, URGENCY_LABELS } from '../../types';

interface InventoryFiltersProps {
  onFilter: (filters: SearchFilters) => void;
}

const FilterContainer = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.md};
  align-items: end;
  flex-wrap: wrap;
`;

const categoryOptions = [
  { value: '', label: '전체 카테고리' },
  ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))
];

const urgencyOptions = [
  { value: '', label: '전체 긴급도' },
  ...Object.entries(URGENCY_LABELS).map(([value, label]) => ({ value, label }))
];

const statusOptions = [
  { value: '', label: '전체 상태' },
  { value: 'pending', label: '주문중' },
  { value: 'ordered', label: '발주완료' },
  { value: 'received', label: '수령완료' },
];

const InventoryFilters: React.FC<InventoryFiltersProps> = ({ onFilter }) => {
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
        placeholder="품목명으로 검색..."
        value={filters.search || ''}
        onChange={(e) => handleFilterChange('search', e.target.value)}
      />
      
      <Select
        placeholder="카테고리"
        value={filters.category || ''}
        options={categoryOptions}
        onChange={(value) => handleFilterChange('category', value as string)}
      />
      
      <Select
        placeholder="상태"
        value={filters.status || ''}
        options={statusOptions}
        onChange={(value) => handleFilterChange('status', value as string)}
      />
      
      <Select
        placeholder="긴급도"
        value={filters.urgency || ''}
        options={urgencyOptions}
        onChange={(value) => handleFilterChange('urgency', value as string)}
      />
      
      <Button variant="outline" onClick={handleReset}>
        <Filter size={16} />
        초기화
      </Button>
    </FilterContainer>
  );
};

export default InventoryFilters;