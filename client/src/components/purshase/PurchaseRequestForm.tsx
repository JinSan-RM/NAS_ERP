// client/src/components/purchase/PurchaseRequestForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';  // react-query → @tanstack/react-query
import { toast } from 'react-toastify';
import Select from '../common/Select';
import Card from '../common/Card';
import Button from '../common/Button';
import { purchaseApi } from '../../services/api';
import { PurchaseRequest, ItemCategory, UrgencyLevel, PurchaseMethod, PurchaseRequestFormData } from '../../types';
import { CATEGORY_LABELS, URGENCY_LABELS } from '../../types';

interface PurchaseRequestFormProps {
  request?: PurchaseRequest | null;
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

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.hasError ? props.theme.colors.error : props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
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

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({ request, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<PurchaseRequestFormData>({
    itemName: request?.itemName || '',
    specifications: request?.specifications || '',
    quantity: request?.quantity || 1,
    estimatedPrice: request?.estimatedPrice || 0,
    preferredSupplier: request?.preferredSupplier || '',
    category: request?.category || 'office_supplies',
    urgency: request?.urgency || 'medium',
    justification: request?.justification || '',
    department: request?.department || '',
    project: request?.project || '',
    budgetCode: request?.budgetCode || '',
    expectedDeliveryDate: request?.expectedDeliveryDate ? new Date(request.expectedDeliveryDate).toISOString().split('T')[0] : '',
    purchaseMethod: request?.purchaseMethod || 'direct',
  });

  const createMutation = useMutation(purchaseApi.createRequest, {
    onSuccess: () => {
      queryClient.invalidateQueries('purchase-requests');
      toast.success('구매 요청이 등록되었습니다.');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '등록 중 오류가 발생했습니다.');
    },
  });

  const updateMutation = useMutation(
    (data: Partial<PurchaseRequestFormData>) => purchaseApi.updateRequest(request!.id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('purchase-requests');
        toast.success('구매 요청이 수정되었습니다.');
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
      estimatedPrice: Number(formData.estimatedPrice),
      quantity: Number(formData.quantity),
    };

    if (request) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate(submitData);
    }
  };

  const handleChange = (field: keyof PurchaseRequestFormData, value: any) => {
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
          label="수량"
          type="number"
          value={formData.quantity}
          onChange={(e) => handleChange('quantity', Number(e.target.value))}
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
          label="예상 단가"
          type="number"
          value={formData.estimatedPrice}
          onChange={(e) => handleChange('estimatedPrice', Number(e.target.value))}
        />
        
        <Input
          label="선호 공급업체"
          value={formData.preferredSupplier}
          onChange={(e) => handleChange('preferredSupplier', e.target.value)}
        />
        
        <Select
          label="카테고리"
          value={formData.category}
          options={categoryOptions}
          onChange={(value) => handleChange('category', value as ItemCategory)}
        />
        
        <Select
          label="긴급도"
          value={formData.urgency}
          options={urgencyOptions}
          onChange={(value) => handleChange('urgency', value as UrgencyLevel)}
        />
        
        <Input
          label="부서"
          value={formData.department}
          onChange={(e) => handleChange('department', e.target.value)}
          required
        />
        
        <Input
          label="프로젝트"
          value={formData.project || ''}
          onChange={(e) => handleChange('project', e.target.value)}
        />
        
        <Input
          label="예산 코드"
          value={formData.budgetCode || ''}
          onChange={(e) => handleChange('budgetCode', e.target.value)}
        />
        
        <Input
          label="희망 납기일"
          type="date"
          value={formData.expectedDeliveryDate || ''}
          onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
        />
        
        <Select
          label="구매방법"
          value={formData.purchaseMethod}
          options={purchaseMethodOptions}
          onChange={(value) => handleChange('purchaseMethod', value as PurchaseMethod)}
        />
        
        <FormRow>
          <div>
            <label>구매 사유</label>
            <TextArea
              value={formData.justification}
              onChange={(e) => handleChange('justification', e.target.value)}
              placeholder="구매가 필요한 사유를 상세히 입력해주세요..."
              required
            />
          </div>
        </FormRow>
      </FormGrid>

      <ButtonGroup>
        <Button type="button" variant="outline" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit" loading={isLoading}>
          {request ? '수정' : '등록'}
        </Button>
      </ButtonGroup>
    </FormContainer>
  );
};

export default PurchaseRequestForm;


