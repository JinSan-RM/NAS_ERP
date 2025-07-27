// client/src/components/common/ExcelUploadGuide.tsx
import React from 'react';
import styled from 'styled-components';
import { 
  FileSpreadsheet, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle,
  Info,
  ArrowRight,
  FileText
} from 'lucide-react';
import Card from './Card';

interface ExcelUploadGuideProps {
  type: 'purchase' | 'inventory';
}

const GuideContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const GuideCard = styled(Card)`
  padding: 24px;
  
  .guide-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    .guide-icon {
      padding: 8px;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      border-radius: 10px;
    }
    
    .guide-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    }
  }
`;

const StepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StepItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  
  .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #3b82f6;
    color: white;
    border-radius: 50%;
    font-weight: 600;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .step-content {
    flex: 1;
    
    .step-title {
      font-weight: 600;
      margin-bottom: 8px;
      color: #1f2937;
    }
    
    .step-description {
      color: #6b7280;
      line-height: 1.5;
      margin-bottom: 12px;
    }
    
    .step-details {
      background: white;
      padding: 12px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
      
      .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
        font-size: 14px;
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .bullet {
          width: 4px;
          height: 4px;
          background: #3b82f6;
          border-radius: 50%;
        }
      }
    }
  }
`;

const WarningBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  
  .warning-icon {
    color: #f59e0b;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .warning-content {
    .warning-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 4px;
    }
    
    .warning-text {
      color: #92400e;
      font-size: 14px;
      line-height: 1.5;
    }
  }
`;

const TipBox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #dbeafe;
  border: 1px solid #3b82f6;
  border-radius: 8px;
  
  .tip-icon {
    color: #3b82f6;
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  .tip-content {
    .tip-title {
      font-weight: 600;
      color: #1e40af;
      margin-bottom: 4px;
    }
    
    .tip-text {
      color: #1e40af;
      font-size: 14px;
      line-height: 1.5;
    }
  }
`;

const RequiredColumns = styled.div`
  .columns-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-top: 12px;
    
    .column-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      
      .required-mark {
        color: #ef4444;
        font-weight: bold;
      }
      
      .column-name {
        font-weight: 500;
        color: #374151;
      }
    }
  }
`;

const ExcelUploadGuide: React.FC<ExcelUploadGuideProps> = ({ type }) => {
  const isPurchase = type === 'purchase';
  
  const purchaseColumns = [
    { name: '품목명', required: true },
    { name: '수량', required: true },
    { name: '요청자명', required: true },
    { name: '부서', required: true },
    { name: '구매사유', required: true },
    { name: '사양', required: false },
    { name: '예상단가', required: false },
    { name: '공급업체', required: false },
    { name: '카테고리', required: false },
    { name: '긴급도', required: false },
    { name: '프로젝트', required: false },
    { name: '예산코드', required: false }
  ];
  
  const inventoryColumns = [
    { name: '품목코드', required: true },
    { name: '품목명', required: true },
    { name: '단위', required: true },
    { name: '최소재고', required: true },
    { name: '카테고리', required: false },
    { name: '브랜드', required: false },
    { name: '사양', required: false },
    { name: '단가', required: false },
    { name: '위치', required: false },
    { name: '창고', required: false },
    { name: '공급업체', required: false },
    { name: '설명', required: false }
  ];
  
  const columns = isPurchase ? purchaseColumns : inventoryColumns;
  
  return (
    <GuideContainer>
      <GuideCard>
        <div className="guide-header">
          <FileSpreadsheet className="guide-icon" size={24} />
          <div className="guide-title">
            {isPurchase ? '구매 요청' : '품목'} Excel 업로드 가이드
          </div>
        </div>
        
        <StepContainer>
          <StepItem>
            <div className="step-number">1</div>
            <div className="step-content">
              <div className="step-title">템플릿 다운로드</div>
              <div className="step-description">
                먼저 Excel 템플릿을 다운로드하여 올바른 형식을 확인하세요.
              </div>
              <div className="step-details">
                <div className="detail-item">
                  <Download size={16} />
                  <span>'{isPurchase ? '구매 요청' : '품목'} 템플릿 다운로드' 버튼 클릭</span>
                </div>
                <div className="detail-item">
                  <div className="bullet" />
                  <span>템플릿에는 샘플 데이터와 입력 가이드가 포함되어 있습니다</span>
                </div>
                <div className="detail-item">
                  <div className="bullet" />
                  <span>각 시트별로 상세한 설명과 옵션을 확인할 수 있습니다</span>
                </div>
              </div>
            </div>
          </StepItem>
          
          <StepItem>
            <div className="step-number">2</div>
            <div className="step-content">
              <div className="step-title">데이터 입력</div>
              <div className="step-description">
                템플릿의 양식에 맞춰 {isPurchase ? '구매 요청' : '품목'} 정보를 입력하세요.
              </div>
              <RequiredColumns>
                <div className="columns-grid">
                  {columns.map((column, index) => (
                    <div key={index} className="column-item">
                      {column.required && <span className="required-mark">*</span>}
                      <span className="column-name">{column.name}</span>
                    </div>
                  ))}
                </div>
              </RequiredColumns>
            </div>
          </StepItem>
          
          <StepItem>
            <div className="step-number">3</div>
            <div className="step-content">
              <div className="step-title">파일 저장 및 업로드</div>
              <div className="step-description">
                입력이 완료되면 파일을 저장하고 업로드하세요.
              </div>
              <div className="step-details">
                <div className="detail-item">
                  <FileText size={16} />
                  <span>Excel 파일을 .xlsx 또는 .xls 형식으로 저장</span>
                </div>
                <div className="detail-item">
                  <Upload size={16} />
                  <span>'Excel 업로드' 버튼을 클릭하여 파일 선택</span>
                </div>
                <div className="detail-item">
                  <CheckCircle size={16} />
                  <span>업로드 완료 후 결과 확인</span>
                </div>
              </div>
            </div>
          </StepItem>
        </StepContainer>
      </GuideCard>
      
      <WarningBox>
        <AlertTriangle className="warning-icon" size={20} />
        <div className="warning-content">
          <div className="warning-title">주의사항</div>
          <div className="warning-text">
            • 필수 컬럼({columns.filter(c => c.required).map(c => c.name).join(', ')})은 반드시 입력해야 합니다<br/>
            • {isPurchase ? '요청자명과 부서는 정확히 입력해주세요' : '품목코드는 고유해야 하며, 중복 시 기존 품목이 업데이트됩니다'}<br/>
            • 파일 크기는 10MB를 초과할 수 없습니다<br/>
            • 최대 1,000개 항목까지 한 번에 업로드 가능합니다
          </div>
        </div>
      </WarningBox>
      
      <TipBox>
        <Info className="tip-icon" size={20} />
        <div className="tip-content">
          <div className="tip-title">유용한 팁</div>
          <div className="tip-text">
            • 템플릿의 '사용안내' 시트에서 자세한 가이드를 확인하세요<br/>
            • {isPurchase ? '카테고리, 긴급도, 부서 옵션' : '카테고리 예시와 데이터 형식'}은 별도 시트에서 참조 가능합니다<br/>
            • 업로드 실패 시 오류 메시지를 확인하고 해당 행의 데이터를 수정하세요<br/>
            • 대량 데이터는 여러 번에 나누어 업로드하는 것을 권장합니다
          </div>
        </div>
      </TipBox>
    </GuideContainer>
  );
};

export default ExcelUploadGuide;