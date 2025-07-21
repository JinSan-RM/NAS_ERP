// client/src/components/upload/UploadPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Upload, FileText, Download, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import { uploadApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${props => props.theme.colors.text};
`;

const PageSubtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: 30px;
  font-size: 1rem;
`;

const UploadArea = styled.div<{ isDragOver: boolean; disabled?: boolean }>`
  border: 2px dashed ${props => 
    props.disabled 
      ? props.theme.colors.border 
      : props.isDragOver 
        ? props.theme.colors.primary 
        : props.theme.colors.border
  };
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 60px 20px;
  text-align: center;
  background: ${props => 
    props.disabled
      ? props.theme.colors.background
      : props.isDragOver 
        ? props.theme.colors.primary + '05' 
        : props.theme.colors.surface
  };
  transition: all 0.3s ease;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover {
    border-color: ${props => props.disabled ? props.theme.colors.border : props.theme.colors.primary};
    background: ${props => props.disabled ? props.theme.colors.background : props.theme.colors.primary + '05'};
  }
  
  .upload-icon {
    margin-bottom: 20px;
    opacity: 0.5;
  }
  
  .upload-text {
    font-size: 1.1rem;
    margin-bottom: 10px;
    color: ${props => props.theme.colors.text};
  }
  
  .upload-hint {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 0.9rem;
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const ResultSection = styled.div`
  margin-top: 30px;
`;

const InfoSection = styled(Card)`
  margin-bottom: 30px;
  
  .info-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    
    h3 {
      margin: 0;
      color: ${props => props.theme.colors.text};
    }
  }
  
  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .info-item {
    .label {
      font-size: 0.9rem;
      color: ${props => props.theme.colors.textSecondary};
      margin-bottom: 5px;
    }
    
    .value {
      font-weight: 500;
      color: ${props => props.theme.colors.text};
    }
  }
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${props => props.theme.colors.background};
  border-radius: 4px;
  overflow: hidden;
  margin: 20px 0;
  
  .progress-fill {
    height: 100%;
    background: ${props => props.theme.colors.primary};
    width: ${props => props.progress}%;
    transition: width 0.3s ease;
  }
`;

const ResultCard = styled(Card)<{ success?: boolean }>`
  border-left: 4px solid ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
  
  .result-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 15px;
    
    .result-icon {
      color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
    }
    
    .result-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: ${props => props.success ? props.theme.colors.success : props.theme.colors.error};
    }
  }
  
  .result-details {
    margin-bottom: 20px;
    
    .detail-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      
      .label {
        color: ${props => props.theme.colors.textSecondary};
      }
      
      .value {
        font-weight: 500;
      }
    }
  }
`;

interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

const UploadPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [dragOver, setDragOver] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);

  // 업로드 정보 조회
  const { data: uploadInfo } = useQuery({
    queryKey: ['upload-info'],
    queryFn: uploadApi.getUploadInfo,
  });

  // 템플릿 정보 조회
  const { data: templateInfo } = useQuery({
    queryKey: ['upload-template'],
    queryFn: uploadApi.getTemplate,
  });

  const uploadMutation = useMutation({
    mutationFn: uploadApi.uploadExcel,
    onSuccess: (data) => {
      setUploadResult(data);
      setUploadProgress(null);
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory-stats'] });
      toast.success(`Excel 파일이 업로드되었습니다. ${data.data?.itemCount || 0}개 항목이 처리되었습니다.`);
    },
    onError: (error: any) => {
      setUploadProgress(null);
      const errorMessage = error.response?.data?.message || '업로드 중 오류가 발생했습니다.';
      setUploadResult({ success: false, error: errorMessage });
      toast.error(errorMessage);
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    // 파일 확장자 검증
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Excel 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 검증 (50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('파일 크기는 50MB를 초과할 수 없습니다.');
      return;
    }
    
    // 업로드 시작
    setUploadResult(null);
    setUploadProgress({ loaded: 0, total: file.size, percentage: 0 });
    
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (uploadMutation.isPending) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!uploadMutation.isPending) {
      setDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    if (uploadMutation.isPending) return;
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  };

  const downloadTemplate = () => {
    // 템플릿 다운로드 로직 (실제 백엔드에서 파일 제공시)
    toast.info('템플릿 다운로드 기능이 곧 추가될 예정입니다.');
  };

  const uploadInfoData = uploadInfo?.data || {};
  const templateData = templateInfo?.data || {};

  return (
    <Container>
      <PageTitle>파일 관리</PageTitle>
      <PageSubtitle>Excel 파일을 업로드하여 품목 데이터를 일괄 등록할 수 있습니다.</PageSubtitle>

      {/* 업로드 정보 */}
      <InfoSection>
        <div className="info-header">
          <FileText size={24} />
          <h3>업로드 정보</h3>
        </div>
        <div className="info-grid">
          <div className="info-item">
            <div className="label">지원 형식</div>
            <div className="value">{uploadInfoData.supported_formats?.join(', ') || '.xlsx, .xls'}</div>
          </div>
          <div className="info-item">
            <div className="label">최대 파일 크기</div>
            <div className="value">{uploadInfoData.max_file_size || '50MB'}</div>
          </div>
          <div className="info-item">
            <div className="label">최대 파일 수</div>
            <div className="value">{uploadInfoData.max_files || '1개'}</div>
          </div>
          <div className="info-item">
            <div className="label">필수 컬럼</div>
            <div className="value">
              {templateData.required_columns?.slice(0, 3).join(', ') || '품목코드, 품목명, 카테고리'}
              {templateData.required_columns?.length > 3 && '...'}
            </div>
          </div>
        </div>
        
        <div style={{ marginTop: '20px' }}>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download size={16} />
            Excel 템플릿 다운로드
          </Button>
        </div>
      </InfoSection>

      <Card>
        <UploadArea
          isDragOver={dragOver}
          disabled={uploadMutation.isPending}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <Upload size={48} className="upload-icon" />
          <div className="upload-text">
            {uploadMutation.isPending 
              ? '파일을 업로드하는 중...' 
              : 'Excel 파일을 여기에 끌어다 놓거나 클릭하여 선택하세요'
            }
          </div>
          <div className="upload-hint">
            .xlsx, .xls 파일만 지원됩니다 (최대 50MB)
          </div>
        </UploadArea>
        
        <HiddenInput
          id="file-input"
          type="file"
          accept=".xlsx,.xls"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
          disabled={uploadMutation.isPending}
        />

        {/* 업로드 진행률 */}
        {uploadProgress && (
          <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span>업로드 진행중...</span>
              <span>{uploadProgress.percentage.toFixed(1)}%</span>
            </div>
            <ProgressBar progress={uploadProgress.percentage}>
              <div className="progress-fill" />
            </ProgressBar>
          </div>
        )}

        {/* 업로드 결과 */}
        {uploadResult && (
          <ResultSection>
            <ResultCard success={uploadResult.success !== false}>
              <div className="result-header">
                <div className="result-icon">
                  {uploadResult.success !== false ? (
                    <CheckCircle size={24} />
                  ) : (
                    <AlertCircle size={24} />
                  )}
                </div>
                <div className="result-title">
                  {uploadResult.success !== false ? '업로드 완료!' : '업로드 실패'}
                </div>
              </div>

              {uploadResult.success !== false ? (
                <div className="result-details">
                  <div className="detail-item">
                    <span className="label">처리된 항목:</span>
                    <span className="value">{uploadResult.data?.itemCount || 0}개</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">파일명:</span>
                    <span className="value">{uploadResult.filename || '알 수 없음'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">업로드 시간:</span>
                    <span className="value">{new Date().toLocaleString('ko-KR')}</span>
                  </div>
                </div>
              ) : (
                <div className="result-details">
                  <p style={{ color: '#EF4444', marginBottom: '10px' }}>
                    {uploadResult.error}
                  </p>
                </div>
              )}

              {uploadResult.success !== false && (
                <Button variant="outline" onClick={() => window.location.href = '/inventory'}>
                  <FileText size={16} />
                  재고 목록 확인
                </Button>
              )}
            </ResultCard>
          </ResultSection>
        )}
      </Card>
    </Container>
  );
};

export default UploadPage;