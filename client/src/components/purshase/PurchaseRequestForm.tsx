// client/src/components/purchase/PurchaseRequestForm.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
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

// client/src/components/purchase/ApprovalModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Check, X, AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { PurchaseRequest } from '../../types';

interface ApprovalModalProps {
  request: PurchaseRequest;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (action: 'approve' | 'reject', comments?: string) => void;
  loading?: boolean;
}

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const RequestInfo = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  
  .info-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: ${props => props.theme.spacing.sm};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .label {
    font-weight: 500;
    color: ${props => props.theme.colors.textSecondary};
  }
  
  .value {
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
`;

const CommentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  font-size: 1rem;
  font-family: inherit;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  resize: vertical;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 3px ${props => props.theme.colors.primary}20;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const WarningBox = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.warning}10;
  border: 1px solid ${props => props.theme.colors.warning}30;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.warning};
  
  svg {
    flex-shrink: 0;
  }
`;

const ApprovalModal: React.FC<ApprovalModalProps> = ({
  request,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [comments, setComments] = useState('');

  const handleSubmit = () => {
    if (action) {
      onSubmit(action, comments || undefined);
    }
  };

  const handleClose = () => {
    setAction(null);
    setComments('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="구매 요청 승인"
      size="lg"
    >
      <ModalContent>
        <RequestInfo>
          <div className="info-row">
            <span className="label">요청번호:</span>
            <span className="value">{request.requestNumber}</span>
          </div>
          <div className="info-row">
            <span className="label">품목명:</span>
            <span className="value">{request.itemName}</span>
          </div>
          <div className="info-row">
            <span className="label">수량:</span>
            <span className="value">{request.quantity.toLocaleString()}개</span>
          </div>
          <div className="info-row">
            <span className="label">예상금액:</span>
            <span className="value">₩{request.totalBudget.toLocaleString()}</span>
          </div>
          <div className="info-row">
            <span className="label">요청자:</span>
            <span className="value">{request.requesterName} ({request.department})</span>
          </div>
          <div className="info-row">
            <span className="label">요청일:</span>
            <span className="value">{new Date(request.requestDate).toLocaleDateString('ko-KR')}</span>
          </div>
        </RequestInfo>

        {request.justification && (
          <div>
            <h4>구매 사유</h4>
            <p style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
              {request.justification}
            </p>
          </div>
        )}

        <CommentSection>
          <label htmlFor="comments">승인/거절 의견</label>
          <TextArea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="승인 또는 거절 사유를 입력해주세요... (선택사항)"
          />
        </CommentSection>

        {action === 'reject' && (
          <WarningBox>
            <AlertTriangle size={20} />
            <span>거절 시 요청자에게 알림이 전송되며, 요청이 거절 상태로 변경됩니다.</span>
          </WarningBox>
        )}

        <ActionButtons>
          <Button variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button
            variant="danger"
            onClick={() => setAction('reject')}
            disabled={loading}
          >
            <X size={16} />
            거절
          </Button>
          <Button
            variant="success"
            onClick={() => setAction('approve')}
            disabled={loading}
          >
            <Check size={16} />
            승인
          </Button>
          {action && (
            <Button
              onClick={handleSubmit}
              loading={loading}
              variant={action === 'approve' ? 'success' : 'danger'}
            >
              {action === 'approve' ? '승인 확정' : '거절 확정'}
            </Button>
          )}
        </ActionButtons>
      </ModalContent>
    </Modal>
  );
};

export default ApprovalModal;

// client/src/components/purchase/RequestDetailModal.tsx
import React from 'react';
import styled from 'styled-components';
import { Edit, Check, Eye, Calendar, User, Package, DollarSign } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { PurchaseRequest } from '../../types';
import { STATUS_LABELS, URGENCY_LABELS, CATEGORY_LABELS } from '../../types';

interface RequestDetailModalProps {
  request: PurchaseRequest;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onApprove?: () => void;
}

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
`;

const Section = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background};
  border-radius: ${props => props.theme.borderRadius.md};
  
  h3 {
    margin-bottom: ${props => props.theme.spacing.md};
    color: ${props => props.theme.colors.text};
    font-size: 1.1rem;
    font-weight: 600;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  .icon {
    color: ${props => props.theme.colors.primary};
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 0.85rem;
      color: ${props => props.theme.colors.textSecondary};
      margin-bottom: 2px;
    }
    
    .value {
      font-weight: 500;
      color: ${props => props.theme.colors.text};
    }
  }
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'pending_approval': return '#F59E0B20';
      case 'approved': return '#10B98120';
      case 'rejected': return '#EF444420';
      default: return '#6B728020';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending_approval': return '#F59E0B';
      case 'approved': return '#10B981';
      case 'rejected': return '#EF4444';
      default: return '#6B7280';
    }
  }};
`;

const JustificationBox = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.md};
  line-height: 1.6;
`;

const ActionButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${props => props.theme.spacing.sm};
  padding-top: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  request,
  isOpen,
  onClose,
  onEdit,
  onApprove
}) => {
  const canEdit = ['draft', 'submitted', 'rejected'].includes(request.status);
  const canApprove = request.status === 'pending_approval';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="구매 요청 상세"
      size="lg"
    >
      <DetailContainer>
        <Section>
          <h3>기본 정보</h3>
          <InfoGrid>
            <InfoItem>
              <Package className="icon" size={20} />
              <div className="content">
                <div className="label">요청번호</div>
                <div className="value">{request.requestNumber}</div>
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="content">
                <div className="label">상태</div>
                <StatusBadge status={request.status}>
                  {STATUS_LABELS[request.status]}
                </StatusBadge>
              </div>
            </InfoItem>
            
            <InfoItem>
              <User className="icon" size={20} />
              <div className="content">
                <div className="label">요청자</div>
                <div className="value">{request.requesterName}</div>
              </div>
            </InfoItem>
            
            <InfoItem>
              <Calendar className="icon" size={20} />
              <div className="content">
                <div className="label">요청일</div>
                <div className="value">{new Date(request.requestDate).toLocaleDateString('ko-KR')}</div>
              </div>
            </InfoItem>
          </InfoGrid>
        </Section>

        <Section>
          <h3>품목 정보</h3>
          <InfoGrid>
            <InfoItem>
              <div className="content">
                <div className="label">품목명</div>
                <div className="value">{request.itemName}</div>
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="content">
                <div className="label">수량</div>
                <div className="value">{request.quantity.toLocaleString()}개</div>
              </div>
            </InfoItem>
            
            {request.specifications && (
              <InfoItem style={{ gridColumn: '1 / -1' }}>
                <div className="content">
                  <div className="label">사양</div>
                  <div className="value">{request.specifications}</div>
                </div>
              </InfoItem>
            )}
            
            <InfoItem>
              <DollarSign className="icon" size={20} />
              <div className="content">
                <div className="label">예상금액</div>
                <div className="value">₩{request.totalBudget.toLocaleString()}</div>
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="content">
                <div className="label">카테고리</div>
                <div className="value">{CATEGORY_LABELS[request.category]}</div>
              </div>
            </InfoItem>
            
            <InfoItem>
              <div className="content">
                <div className="label">긴급도</div>
                <div className="value">{URGENCY_LABELS[request.urgency]}</div>
              </div>
            </InfoItem>
            
            {request.preferredSupplier && (
              <InfoItem>
                <div className="content">
                  <div className="label">선호 공급업체</div>
                  <div className="value">{request.preferredSupplier}</div>
                </div>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>

        <Section>
          <h3>부서 및 프로젝트 정보</h3>
          <InfoGrid>
            <InfoItem>
              <div className="content">
                <div className="label">부서</div>
                <div className="value">{request.department}</div>
              </div>
            </InfoItem>
            
            {request.project && (
              <InfoItem>
                <div className="content">
                  <div className="label">프로젝트</div>
                  <div className="value">{request.project}</div>
                </div>
              </InfoItem>
            )}
            
            {request.budgetCode && (
              <InfoItem>
                <div className="content">
                  <div className="label">예산 코드</div>
                  <div className="value">{request.budgetCode}</div>
                </div>
              </InfoItem>
            )}
            
            {request.expectedDeliveryDate && (
              <InfoItem>
                <div className="content">
                  <div className="label">희망 납기일</div>
                  <div className="value">{new Date(request.expectedDeliveryDate).toLocaleDateString('ko-KR')}</div>
                </div>
              </InfoItem>
            )}
          </InfoGrid>
        </Section>

        {request.justification && (
          <Section>
            <h3>구매 사유</h3>
            <JustificationBox>
              {request.justification}
            </JustificationBox>
          </Section>
        )}

        <ActionButtons>
          <Button variant="outline" onClick={onClose}>
            닫기
          </Button>
          
          {canEdit && onEdit && (
            <Button variant="outline" onClick={onEdit}>
              <Edit size={16} />
              수정
            </Button>
          )}
          
          {canApprove && onApprove && (
            <Button variant="success" onClick={onApprove}>
              <Check size={16} />
              승인처리
            </Button>
          )}
        </ActionButtons>
      </DetailContainer>
    </Modal>
  );
};

export default RequestDetailModal;상태"
        value={filters.status || ''}
        options={statusOptions}
        onChange={(value) => handleFilterChange('status', value as string)}
      />
      
      <Select
        placeholder="