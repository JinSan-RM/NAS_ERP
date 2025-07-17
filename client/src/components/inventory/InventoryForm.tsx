// client/src/components/inventory/InventoryForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const FormContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
  color: #374151;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid;
  
  ${props => props.variant === 'primary' ? `
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
    
    &:hover {
      background-color: #2563eb;
    }
  ` : `
    background-color: white;
    color: #374151;
    border-color: #d1d5db;
    
    &:hover {
      background-color: #f9fafb;
    }
  `}
`;

interface InventoryItem {
  id?: string;
  itemName: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  description?: string;
}

interface InventoryFormProps {
  item?: InventoryItem;
  onSubmit: (item: InventoryItem) => void;
  onCancel: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ 
  item, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState<InventoryItem>({
    itemName: item?.itemName || '',
    category: item?.category || '',
    quantity: item?.quantity || 0,
    unit: item?.unit || '',
    location: item?.location || '',
    description: item?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, id: item?.id });
  };

  const handleChange = (field: keyof InventoryItem, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <FormContainer>
      <h3>{item ? '재고 항목 수정' : '재고 항목 추가'}</h3>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>품목명</Label>
          <Input
            type="text"
            value={formData.itemName}
            onChange={(e) => handleChange('itemName', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>카테고리</Label>
          <Input
            type="text"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>수량</Label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
            required
            min="0"
          />
        </FormGroup>

        <FormGroup>
          <Label>단위</Label>
          <Input
            type="text"
            value={formData.unit}
            onChange={(e) => handleChange('unit', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>보관 위치</Label>
          <Input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label>설명</Label>
          <Input
            type="text"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="선택사항"
          />
        </FormGroup>

        <ButtonGroup>
          <Button type="submit" variant="primary">
            {item ? '수정' : '추가'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            취소
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default InventoryForm;