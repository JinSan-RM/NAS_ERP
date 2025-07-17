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

export default RequestDetailModal;
      <Select
        placeholder="카테고리 선택"
        value={filters.category || ''}
        options={categoryOptions}
        onChange={(value) => handleFilterChange('category', value as string)}
      />
