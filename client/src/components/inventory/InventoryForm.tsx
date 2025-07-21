// client/src/components/inventory/InventoryForm.tsx (완전 수정 버전)
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

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`;

const Title = styled.h3`
  margin-bottom: 20px;
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
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

  const categoryOptions = [
    { value: '', label: '카테고리 선택' },
    { value: '사무용품', label: '사무용품' },
    { value: '전자기기', label: '전자기기' },
    { value: '소모품', label: '소모품' },
    { value: '기타', label: '기타' }
  ];

  const unitOptions = [
    { value: '', label: '단위 선택' },
    { value: '개', label: '개' },
    { value: '박스', label: '박스' },
    { value: 'kg', label: 'kg' },
    { value: 'L', label: 'L' },
    { value: '세트', label: '세트' }
  ];

  return (
    <FormContainer>
      <Title>{item ? '재고 항목 수정' : '재고 항목 추가'}</Title>
      
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Input
            label="품목명"
            type="text"
            value={formData.itemName}
            onChange={(e) => handleChange('itemName', e.target.value)}
            placeholder="품목명을 입력하세요"
            required
          />
        </FormGroup>

        <FormGroup>
          <Select
            label="카테고리"
            value={formData.category}
            options={categoryOptions}
            onChange={(value) => handleChange('category', value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Input
            label="수량"
            type="number"
            value={formData.quantity}
            onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
            placeholder="수량을 입력하세요"
            required
          />
        </FormGroup>

        <FormGroup>
          <Select
            label="단위"
            value={formData.unit}
            options={unitOptions}
            onChange={(value) => handleChange('unit', value)}
            required
          />
        </FormGroup>

        <FormGroup>
          <Input
            label="보관 위치"
            type="text"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="보관 위치를 입력하세요"
            required
          />
        </FormGroup>

        <FormGroup>
          <Input
            label="설명"
            type="text"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="추가 설명 (선택사항)"
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