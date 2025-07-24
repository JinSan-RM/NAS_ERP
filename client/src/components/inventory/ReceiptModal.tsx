// client/src/components/inventory/ReceiptWithImagesModal.tsx - 새로 생성할 컴포넌트
import React, { useState } from 'react';
import styled from 'styled-components';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Modal from '../common/Modal';

const ModalContent = styled.div`
  padding: 20px;
  max-height: 80vh;
  overflow-y: auto;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
`;

const ImageUploadSection = styled.div`
  margin: 20px 0;
  
  .upload-title {
    font-weight: 600;
    margin-bottom: 12px;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const ImageUploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? '#3b82f6' : '#d1d5db'};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: ${props => props.isDragOver ? '#eff6ff' : '#f9fafb'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: #3b82f6;
    background: #eff6ff;
  }
  
  .upload-icon {
    margin-bottom: 12px;
    color: #6b7280;
  }
  
  .upload-text {
    color: #374151;
    margin-bottom: 8px;
  }
  
  .upload-hint {
    color: #6b7280;
    font-size: 12px;
  }
`;

const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-top: 16px;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 1;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: rgba(239, 68, 68, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: rgba(239, 68, 68, 1);
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

const HiddenInput = styled.input`
  display: none;
`;

interface ReceiptWithImagesModalProps {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (receiptData: any, images: File[]) => void;
  loading?: boolean;
}

const ReceiptWithImagesModal: React.FC<ReceiptWithImagesModalProps> = ({
  item,
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    received_quantity: item?.current_quantity || 1,
    receiver_name: '',
    receiver_email: '',
    department: '',
    received_date: new Date().toISOString().split('T')[0],
    location: item?.location || '',
    condition: 'good',
    notes: item?.notes || '',  // 빈 문자열로 기본
    receipt_number: '',  // 새로 추가: 초기값 빈 문자열
    expected_quantity: item?.current_quantity || 1,

  });

  const [images, setImages] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const receiptData = {
      receipt_number: formData.receipt_number || `REC-${new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 15)}`,
      received_quantity: Number(formData.received_quantity) || 1,
      receiver_name: formData.receiver_name.trim() || '', 
      receiver_email: formData.receiver_email?.trim() || '',
      department: formData.department || '',
      received_date: formData.received_date || new Date().toISOString().split('T')[0],
      location: formData.location?.trim() || '',
      condition: formData.condition || 'good',
      notes: formData.notes?.trim() || '',
      item_name: item.item_name,  // 새로 추가: item에서 가져옴 (필수 필드 충족)
      expected_quantity: Number(formData.expected_quantity) || 1,  // 새로 추가: 예상 수량
    };

    // 유효성 체크
    if (!receiptData.receiver_name || receiptData.received_quantity < 1 || !receiptData.department || !receiptData.received_date || !receiptData.item_name || receiptData.expected_quantity < 1) {
      alert('필수 필드를 확인하세요: 수령자명, 수량, 부서, 수령일, 품목명, 예상 수량');
      return;
    }

    onSubmit(receiptData, images);
  };

  const handleImageUpload = (files: File[]) => {
    const newImages = [...images, ...files];
    setImages(newImages);
    
    // 미리보기 생성
    const newPreviews = [...imagePreviews];
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPreviews.push(e.target?.result as string);
        setImagePreviews([...newPreviews]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    );
    
    if (files.length > 0) {
      handleImageUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleImageUpload(files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const conditionOptions = [
    { value: 'excellent', label: '우수' },
    { value: 'good', label: '양호' },
    { value: 'damaged', label: '손상' },
    { value: 'defective', label: '불량' },
  ];

  const departmentOptions = [
    { value: 'H/W 개발팀', label: 'H/W 개발팀' },
    { value: 'S/W 개발팀', label: 'S/W 개발팀' },
    { value: '총무부', label: '총무부' },
    { value: '사무관리팀', label: '사무관리팀' },
    { value: '영업팀', label: '영업팀' },
    { value: '인사팀', label: '인사팀' },
  ];

  if (!item) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`수령 완료 처리 - ${item.item_name}`}
      size="xl"
    >
      <ModalContent>
        <form onSubmit={handleSubmit}>
          {/* 기본 수령 정보 - receipt_number 입력 필드 추가 */}
          <FormGrid>
            <Input
              label="수령 번호 (선택, 자동 생성)"
              type="text"
              value={formData.receipt_number}
              onChange={(e) => setFormData(prev => ({ ...prev, receipt_number: e.target.value }))}
              placeholder="직접 입력 시 사용"
            />
            <Input
              label="수량 *"
              type="number"
              value={formData.expected_quantity}
              onChange={(e) => setFormData(prev => ({ ...prev, expected_quantity: parseInt(e.target.value) || 1 }))}
              required
              min="1"
            />

            <Input
              label="수령자명 *"
              type="text"
              value={formData.receiver_name}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                receiver_name: e.target.value 
              }))}
              placeholder="수령자명을 입력하세요"
              required
            />

            <Input
              label="수령자 이메일"
              type="email"
              value={formData.receiver_email}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                receiver_email: e.target.value 
              }))}
              placeholder="수령자 이메일을 입력하세요"
            />

            <Select
              label="부서 *"
              value={formData.department}
              options={departmentOptions}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                department: value 
              }))}
              required
            />

            <Input
              label="수령일 *"
              type="date"
              value={formData.received_date}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                received_date: e.target.value 
              }))}
              required
            />

            <Select
              label="품목 상태 *"
              value={formData.condition}
              options={conditionOptions}
              onChange={(value) => setFormData(prev => ({ 
                ...prev, 
                condition: value 
              }))}
              required
            />
          </FormGrid>

          <Input
            label="수령 위치"
            type="text"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              location: e.target.value 
            }))}
            placeholder="수령 위치를 입력하세요"
          />

          {/* 이미지 업로드 섹션 */}
          <ImageUploadSection>
            <div className="upload-title">
              <ImageIcon size={20} />
              수령 이미지 업로드 ({images.length}/5)
            </div>
            
            <ImageUploadArea
              isDragOver={dragOver}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => document.getElementById('image-input')?.click()}
            >
              <Upload size={48} className="upload-icon" />
              <div className="upload-text">
                이미지를 여기에 끌어다 놓거나 클릭하여 선택하세요
              </div>
              <div className="upload-hint">
                PNG, JPG, JPEG 파일만 지원 (최대 5개, 각 10MB 이하)
              </div>
            </ImageUploadArea>

            <HiddenInput
              id="image-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
            />

            {/* 이미지 미리보기 */}
            {imagePreviews.length > 0 && (
              <ImagePreviewGrid>
                {imagePreviews.map((preview, index) => (
                  <ImagePreviewItem key={index}>
                    <img src={preview} alt={`수령 이미지 ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeImage(index)}
                    >
                      <X size={12} />
                    </button>
                  </ImagePreviewItem>
                ))}
              </ImagePreviewGrid>
            )}
          </ImageUploadSection>

          {/* 비고 */}
          <Input
            label="비고"
            type="textarea"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ 
              ...prev, 
              notes: e.target.value 
            }))}
            placeholder="추가 메모사항을 입력하세요"
            rows={3}
          />

          <ButtonGroup>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={onClose}
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
              <CheckCircle size={16} />
              수령 완료 처리
            </Button>
          </ButtonGroup>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default ReceiptWithImagesModal;