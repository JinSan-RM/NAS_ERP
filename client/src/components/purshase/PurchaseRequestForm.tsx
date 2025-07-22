// client/src/components/purchase/PurchaseRequestForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Calendar, DollarSign, Package, AlertCircle } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import Card from '../common/Card';
import { purchaseApi } from '../../services/api';

interface PurchaseRequestFormData {
  itemName: string;
  specifications: string;
  quantity: number;
  estimatedPrice: number;
  preferredSupplier: string;
  category: string;
  urgency: string;
  justification: string;
  department: string;
  project?: string;
  budgetCode?: string;
  expectedDeliveryDate?: string;
  purchaseMethod: string;
  attachments?: File[];
}

interface PurchaseRequestFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData?: Partial<PurchaseRequestFormData>;
  isEdit?: boolean;
}

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled(Card)`
  margin-bottom: 24px;
  
  .section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: ${props => props.theme.colors.text};
    display: flex;
    align-items: center;
    gap: 8px;
    
    .section-icon {
      color: ${props => props.theme.colors.primary};
    }
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormRow = styled.div`
  grid-column: 1 / -1;
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  min-height: 100px;
  padding: 12px;
  border: 2px solid ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-radius: 8px;
  font-size: 14px;
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

const FileUploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  background: ${props => props.isDragOver ? props.theme.colors.primary + '05' : props.theme.colors.background};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}05;
  }
  
  .upload-text {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 14px;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 12px;
  }
`;

const FileList = styled.div`
  margin-top: 12px;
  
  .file-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    background: ${props => props.theme.colors.background};
    border-radius: 6px;
    margin-bottom: 8px;
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .file-name {
        font-size: 14px;
        color: ${props => props.theme.colors.text};
      }
      
      .file-size {
        font-size: 12px;
        color: ${props => props.theme.colors.textSecondary};
      }
    }
    
    .remove-btn {
      background: none;
      border: none;
      color: ${props => props.theme.colors.error};
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      
      &:hover {
        background: ${props => props.theme.colors.error}20;
      }
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.error};
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const categoryOptions = [
  { value: 'office_supplies', label: '사무용품' },
  { value: 'electronics', label: '전자기기' },
  { value: 'furniture', label: '가구' },
  { value: 'software', label: '소프트웨어' },
  { value: 'equipment', label: '장비' },
  { value: 'consumables', label: '소모품' },
  { value: 'services', label: '서비스' },
  { value: 'other', label: '기타' },
];

const urgencyOptions = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
  { value: 'urgent', label: '긴급' },
];

const purchaseMethodOptions = [
  { value: 'direct', label: '직접구매' },
  { value: 'quotation', label: '견적요청' },
  { value: 'contract', label: '계약' },
  { value: 'framework', label: '단가계약' },
  { value: 'marketplace', label: '마켓플레이스' },
];

const departmentOptions = [
  { value: '총무부', label: '총무부' },
  { value: '개발팀', label: '개발팀' },
  { value: '사무관리팀', label: '사무관리팀' },
  { value: '영업팀', label: '영업팀' },
  { value: '마케팅팀', label: '마케팅팀' },
  { value: '인사팀', label: '인사팀' },
];

const PurchaseRequestForm: React.FC<PurchaseRequestFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEdit = false
}) => {
  const queryClient = useQueryClient();
  const [dragOver, setDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<PurchaseRequestFormData>({
    itemName: initialData?.itemName || '',
    specifications: initialData?.specifications || '',
    quantity: initialData?.quantity || 1,
    estimatedPrice: initialData?.estimatedPrice || 0,
    preferredSupplier: initialData?.preferredSupplier || '',
    category: initialData?.category || '',
    urgency: initialData?.urgency || 'medium',
    justification: initialData?.justification || '',
    department: initialData?.department || '',
    project: initialData?.project || '',
    budgetCode: initialData?.budgetCode || '',
    expectedDeliveryDate: initialData?.expectedDeliveryDate || '',
    purchaseMethod: initialData?.purchaseMethod || 'direct',
    attachments: [],
  });

  const createMutation = useMutation({
    mutationFn: purchaseApi.createRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchase-requests'] });
      queryClient.invalidateQueries({ queryKey: ['purchase-requests-stats'] });
      toast.success('구매 요청이 등록되었습니다.');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '등록 중 오류가 발생했습니다.');
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.itemName.trim()) {
      newErrors.itemName = '품목명을 입력해주세요.';
    }

    if (!formData.category) {
      newErrors.category = '카테고리를 선택해주세요.';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = '수량은 1 이상이어야 합니다.';
    }

    if (formData.estimatedPrice < 0) {
      newErrors.estimatedPrice = '예상금액은 0 이상이어야 합니다.';
    }

    if (!formData.department) {
      newErrors.department = '부서를 선택해주세요.';
    }

    if (!formData.justification.trim()) {
      newErrors.justification = '구매 사유를 입력해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('입력 정보를 확인해주세요.');
      return;
    }

    const submitData = {
      ...formData,
      quantity: Number(formData.quantity),
      estimatedPrice: Number(formData.estimatedPrice),
    };

    createMutation.mutate(submitData);
  };

  const handleChange = (field: keyof PurchaseRequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 에러 제거
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = fileArray.filter(file => {
      if (file.size > maxSize) {
        toast.error(`${file.name}: 파일 크기는 10MB를 초과할 수 없습니다.`);
        return false;
      }
      
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: 지원하지 않는 파일 형식입니다.`);
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({
      ...prev,
      attachments: [...(prev.attachments || []), ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        {/* 기본 정보 */}
        <FormSection>
          <div className="section-title">
            <Package className="section-icon" size={20} />
            기본 정보
          </div>
          
          <FormGrid>
            <FormRow>
              <Input
                label="품목명"
                value={formData.itemName}
                onChange={(e) => handleChange('itemName', e.target.value)}
                placeholder="구매할 품목명을 입력하세요"
                required
              />
              {errors.itemName && (
                <ErrorMessage>
                  <AlertCircle size={12} />
                  {errors.itemName}
                </ErrorMessage>
              )}
            </FormRow>
            
            <Select
              label="카테고리"
              value={formData.category}
              options={categoryOptions}
              onChange={(value) => handleChange('category', value)}
              placeholder="카테고리를 선택하세요"
              required
            />
            
            <Input
              label="수량"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', Number(e.target.value))}
              placeholder="구매 수량"
              required
            />
            
            <Select
              label="긴급도"
              value={formData.urgency}
              options={urgencyOptions}
              onChange={(value) => handleChange('urgency', value)}
            />
          </FormGrid>
          
          <FormRow style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              사양 및 요구사항
            </label>
            <TextArea
              value={formData.specifications}
              onChange={(e) => handleChange('specifications', e.target.value)}
              placeholder="제품 사양, 모델명, 특별 요구사항 등을 상세히 입력하세요..."
            />
          </FormRow>
        </FormSection>

        {/* 예산 및 공급업체 */}
        <FormSection>
          <div className="section-title">
            <DollarSign className="section-icon" size={20} />
            예산 및 공급업체
          </div>
          
          <FormGrid>
            <Input
              label="예상 단가 (원)"
              type="number"
              value={formData.estimatedPrice}
              onChange={(e) => handleChange('estimatedPrice', Number(e.target.value))}
              placeholder="예상 단가를 입력하세요"
            />
            
            <Input
              label="선호 공급업체"
              value={formData.preferredSupplier}
              onChange={(e) => handleChange('preferredSupplier', e.target.value)}
              placeholder="선호하는 공급업체가 있다면 입력하세요"
            />
            
            <Select
              label="구매 방법"
              value={formData.purchaseMethod}
              options={purchaseMethodOptions}
              onChange={(value) => handleChange('purchaseMethod', value)}
            />
            
            <Input
              label="예산 코드"
              value={formData.budgetCode}
              onChange={(e) => handleChange('budgetCode', e.target.value)}
              placeholder="예산 코드 (선택사항)"
            />
          </FormGrid>
        </FormSection>

        {/* 부서 및 프로젝트 */}
        <FormSection>
          <div className="section-title">
            <Calendar className="section-icon" size={20} />
            부서 및 프로젝트 정보
          </div>
          
          <FormGrid>
            <Select
              label="부서"
              value={formData.department}
              options={departmentOptions}
              onChange={(value) => handleChange('department', value)}
              placeholder="소속 부서를 선택하세요"
              required
            />
            
            <Input
              label="프로젝트명"
              value={formData.project}
              onChange={(e) => handleChange('project', e.target.value)}
              placeholder="관련 프로젝트명 (선택사항)"
            />
            
            <Input
              label="희망 납기일"
              type="date"
              value={formData.expectedDeliveryDate}
              onChange={(e) => handleChange('expectedDeliveryDate', e.target.value)}
            />
          </FormGrid>
          
          <FormRow style={{ marginTop: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              구매 사유 <span style={{ color: 'red' }}>*</span>
            </label>
            <TextArea
              value={formData.justification}
              onChange={(e) => handleChange('justification', e.target.value)}
              placeholder="구매가 필요한 사유를 상세히 입력해주세요..."
              hasError={!!errors.justification}
              required
            />
            {errors.justification && (
              <ErrorMessage>
                <AlertCircle size={12} />
                {errors.justification}
              </ErrorMessage>
            )}
          </FormRow>
        </FormSection>

        {/* 첨부파일 */}
        <FormSection>
          <div className="section-title">
            첨부파일 (선택사항)
          </div>
          
          <FileUploadArea
            isDragOver={dragOver}
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png';
              input.onchange = (e) => handleFileSelect((e.target as HTMLInputElement).files);
              input.click();
            }}
          >
            <div className="upload-text">
              파일을 여기에 끌어다 놓거나 클릭하여 선택하세요
            </div>
            <div className="upload-hint">
              PDF, Word, 이미지 파일 (최대 10MB)
            </div>
          </FileUploadArea>
          
          {formData.attachments && formData.attachments.length > 0 && (
            <FileList>
              {formData.attachments.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-info">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">({formatFileSize(file.size)})</span>
                  </div>
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => removeFile(index)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </FileList>
          )}
        </FormSection>

        {/* 버튼 그룹 */}
        <ButtonGroup>
          <Button type="button" variant="outline" onClick={onCancel}>
            취소
          </Button>
          <Button 
            type="submit" 
            loading={createMutation.isPending}
            disabled={createMutation.isPending}
          >
            {isEdit ? '수정' : '등록'}
          </Button>
        </ButtonGroup>
      </form>
    </FormContainer>
  );
};

export default PurchaseRequestForm;