// client/src/components/upload/UploadPage.tsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Upload, FileText, Download } from 'lucide-react';
import PageHeader from '../common/Header';
import { uploadApi } from '../../services/api';

const Container = styled.div`
  padding: 20px;
`;

const UploadArea = styled.div<{ isDragOver: boolean }>`
  border: 2px dashed ${props => props.isDragOver ? props.theme.colors.primary : props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 60px 20px;
  text-align: center;
  background: ${props => props.isDragOver ? props.theme.colors.primary + '05' : props.theme.colors.surface};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primary}05;
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
  
  .result-text {
    font-size: 1.1rem;
    margin-bottom: 20px;
    color: ${props => props.theme.colors.success};
  }
`;

const UploadPage: React.FC = () => {
  const [dragOver, setDragOver] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const uploadMutation = useMutation(uploadApi.uploadExcel, {
    onSuccess: (data) => {
      setUploadResult(data.data);
      toast.success(`Excel 파일이 업로드되었습니다. ${data.data?.itemCount || 0}개 항목이 처리되었습니다.`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '업로드 중 오류가 발생했습니다.');
    },
  });

  const handleFileSelect = (file: File) => {
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.error('Excel 파일만 업로드 가능합니다.');
      return;
    }
    
    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleClick = () => {
    const input = document.getElementById('file-input') as HTMLInputElement;
    input?.click();
  };

  return (
    <Container>
      <PageHeader
        title="파일 관리"
        subtitle="Excel 파일을 업로드하여 품목 데이터를 일괄 등록할 수 있습니다."
      />

      <Card>
        <UploadArea
          isDragOver={dragOver}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <Upload size={48} className="upload-icon" />
          <div className="upload-text">
            Excel 파일을 여기에 끌어다 놓거나 클릭하여 선택하세요
          </div>
          <div className="upload-hint">
            .xlsx, .xls 파일만 지원됩니다
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
        />

        {uploadMutation.isLoading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p>파일을 업로드하고 있습니다...</p>
          </div>
        )}

        {uploadResult && (
          <ResultSection>
            <div className="result-text">
              ✅ 업로드 완료! {uploadResult.itemCount}개의 품목이 등록되었습니다.
            </div>
            <Button variant="outline">
              <FileText size={16} />
              처리 결과 확인
            </Button>
          </ResultSection>
        )}
      </Card>
    </Container>
  );
};

export default UploadPage;