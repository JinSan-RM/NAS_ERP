import React, { useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@tanstack/react-query';  // react-query → @tanstack/react-query
import { toast } from 'react-toastify';
import { MessageSquare, Send, RefreshCw } from 'lucide-react';
import PageHeader from '../common/Header';
import { kakaoApi } from '../../services/api';
import Card from '../common/Card';
import Button from '../common/Button';

const Container = styled.div`
  padding: 20px;
`;

const MessageContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: ${props => props.theme.spacing.md};
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

const ResultCard = styled(Card)`
  .result-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    
    &:last-child {
      border-bottom: none;
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

const KakaoPage: React.FC = () => {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<any>(null);

  const parseMutation = useMutation({
    mutationFn: kakaoApi.parseMessage,  // 최신 문법으로 변경
    onSuccess: (data) => {
      setResult(data.data);
      toast.success('메시지가 성공적으로 파싱되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '파싱 중 오류가 발생했습니다.');
    },
  });

  const handleParse = () => {
    if (!message.trim()) {
      toast.error('메시지를 입력해주세요.');
      return;
    }
    parseMutation.mutate(message);
  };

  const handleClear = () => {
    setMessage('');
    setResult(null);
  };

  return (
    <Container>
      <PageHeader
        title="카카오톡 메시지 처리"
        subtitle="카카오톡 메시지를 파싱하여 수령 정보를 추출합니다."
      />

      <MessageContainer>
        <Card>
          <h3>메시지 입력</h3>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="카카오톡 메시지를 여기에 붙여넣기 하세요..."
          />
          
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <Button 
              onClick={handleParse}
              loading={parseMutation.isPending}  // isLoading → isPending
              disabled={!message.trim()}
            >
              <Send size={16} />
              파싱하기
            </Button>
            <Button variant="outline" onClick={handleClear}>
              <RefreshCw size={16} />
              초기화
            </Button>
          </div>
        </Card>

        <ResultCard>
          <h3>파싱 결과</h3>
          {result ? (
            <div>
              {result.itemNo && (
                <div className="result-item">
                  <span className="label">품목번호:</span>
                  <span className="value">{result.itemNo}</span>
                </div>
              )}
              {result.itemName && (
                <div className="result-item">
                  <span className="label">품목명:</span>
                  <span className="value">{result.itemName}</span>
                </div>
              )}
              {result.quantity && (
                <div className="result-item">
                  <span className="label">수량:</span>
                  <span className="value">{result.quantity}개</span>
                </div>
              )}
              {result.receiver && (
                <div className="result-item">
                  <span className="label">수령자:</span>
                  <span className="value">{result.receiver}</span>
                </div>
              )}
              {result.notes && (
                <div className="result-item">
                  <span className="label">메모:</span>
                  <span className="value">{result.notes}</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              <MessageSquare size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p>메시지를 파싱하면 결과가 여기에 표시됩니다.</p>
            </div>
          )}
        </ResultCard>
      </MessageContainer>
    </Container>
  );
};

export default KakaoPage;