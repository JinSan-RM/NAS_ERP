// client/src/components/inventory/ReceiptModal.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

const ModalContent = styled.div`
  padding: 20px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const ItemInfo = styled.div`
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #3b82f6;
  
  h4 {
    margin: 0 0 8px 0;
    color: #1f2937;
    font-weight: 600;
  }
  
  .item-details {
    font-size: 0.9rem;
    color: #6b7280;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 8px;
  }
`;

interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category?: string;
  brand?: string;
  current_quantity: number;
  unit: string;
  location?: string;
}

interface ReceiptData {
  receipt_number: string;
  item_name: string;
  expected_quantity: number;
  received_quantity: number;
  receiver_name: string;
  receiver_email?: string;
  department: string;
  received_date: string;
  location?: string;
  condition: string;
  notes?: string;
}

interface ReceiptModalProps {
  item: InventoryItem | null;
  onSubmit: (receiptData: ReceiptData) => void;
  onCancel: () => void;
  loading?: boolean;
}

const ReceiptModal: React.FC<ReceiptModalProps> = ({
  item,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<Partial<ReceiptData>>({
    receipt_number: '', // 자동 생성되므로 비워둠
    item_name: item?.item_name || '',
    expected_quantity: 1,
    received_quantity: 1,
    receiver_name: '',
    receiver_email: '',
    department: '',
    received_date: new Date().toISOString().split('T')[0],
    location: item?.location || '',
    condition: 'good',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!item) return;

    // 수령 번호는 백엔드에서 자동 생성
    const receiptData: ReceiptData = {
      receipt_number: `RC${Date.now()}`, // 임시, 백엔드에서 덮어씀
      item_name: item.item_name,
      expected_quantity: formData.expected_quantity || 1,
      received_quantity: formData.received_quantity || 1,
      receiver_name: formData.receiver_name || '',
      receiver_email: formData.receiver_email || undefined,
      department: formData.department || '',
      received_date: formData.received_date || new Date().toISOString(),
      location: formData.location || undefined,
      condition: formData.condition || 'good',
      notes: formData.notes || undefined,
    };

    onSubmit(receiptData);
  };

  const handleChange = (field: keyof ReceiptData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const conditionOptions = [
    { value: 'excellent', label: '우수' },
    { value: 'good', label: '양호' },
    { value: 'damaged', label: '손상' },
    { value: 'defective', label: '불량' },
  ];

  const departmentOptions = [
    { value: '', label: '부서 선택' },
    { value: '개발팀', label: '개발팀' },
    { value: '영업팀', label: '영업팀' },
    { value: '마케팅팀', label: '마케팅팀' },
    { value: '총무팀', label: '총무팀' },
    { value: '인사팀', label: '인사팀' },
    { value: '재무팀', label: '재무팀' },
    { value: '기획팀', label: '기획팀' },
    { value: '품질관리팀', label: '품질관리팀' },
    { value: '생산팀', label: '생산팀' },
    { value: '구매팀', label: '구매팀' },
  ];

  if (!item) {
    return (
      <ModalContent>
        <p>품목 정보를 불러올 수 없습니다.</p>
        <ButtonGroup>
          <Button onClick={onCancel}>닫기</Button>
        </ButtonGroup>
      </ModalContent>
    );
  }

  return (
    <ModalContent>
      {/* 품목 정보 표시 */}
      <ItemInfo>
        <h4>수령 품목 정보</h4>
        <div className="item-details">
          <div>품목코드: {item.item_code}</div>
          <div>품목명: {item.item_name}</div>
          <div>카테고리: {item.category || '-'}</div>
          <div>브랜드: {item.brand || '-'}</div>
          <div>현재재고: {item.current_quantity} {item.unit}</div>
          <div>위치: {item.location || '-'}</div>
        </div>
      </ItemInfo>

      <form onSubmit={handleSubmit}>
        {/* 수량 정보 */}
        <FormGrid>
          <FormGroup>
            <Input
              label="예상 수량 *"
              type="number"
              value={formData.expected_quantity || 1}
              onChange={(e) => handleChange('expected_quantity', parseInt(e.target.value) || 1)}
              required
              min="1"
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="실제 수령 수량 *"
              type="number"
              value={formData.received_quantity || 1}
              onChange={(e) => handleChange('received_quantity', parseInt(e.target.value) || 1)}
              required
              min="0"
            />
          </FormGroup>
        </FormGrid>

        {/* 수령자 정보 */}
        <FormGrid>
          <FormGroup>
            <Input
              label="수령자명 *"
              type="text"
              value={formData.receiver_name || ''}
              onChange={(e) => handleChange('receiver_name', e.target.value)}
              placeholder="수령자명을 입력하세요"
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="수령자 이메일"
              type="email"
              value={formData.receiver_email || ''}
              onChange={(e) => handleChange('receiver_email', e.target.value)}
              placeholder="수령자 이메일을 입력하세요"
            />
          </FormGroup>
        </FormGrid>

        <FormGrid>
          <FormGroup>
            <Select
              label="부서 *"
              value={formData.department || ''}
              options={departmentOptions}
              onChange={(value) => handleChange('department', value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="수령일 *"
              type="date"
              value={formData.received_date || ''}
              onChange={(e) => handleChange('received_date', e.target.value)}
              required
            />
          </FormGroup>
        </FormGrid>

        {/* 품목 상태 및 위치 */}
        <FormGrid>
          <FormGroup>
            <Select
              label="품목 상태 *"
              value={formData.condition || 'good'}
              options={conditionOptions}
              onChange={(value) => handleChange('condition', value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <Input
              label="수령 위치"
              type="text"
              value={formData.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="수령 위치를 입력하세요"
            />
          </FormGroup>
        </FormGrid>

        {/* 비고 */}
        <FormGroup>
          <Input
            label="비고"
            type="textarea"
            value={formData.notes || ''}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="추가 메모사항을 입력하세요"
            rows={3}
          />
        </FormGroup>

        <ButtonGroup>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            취소
          </Button>
          <Button 
            type="submit" 
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            수령 추가
          </Button>
        </ButtonGroup>
      </form>
    </ModalContent>
  );
};

export default ReceiptModal;