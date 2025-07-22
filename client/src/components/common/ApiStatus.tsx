// client/src/components/common/ApiStatus.tsx - API 연결 상태 확인
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { apiUtils } from '../../services/api';

const StatusContainer = styled.div<{ status: 'connected' | 'disconnected' | 'testing' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  
  ${props => {
    switch (props.status) {
      case 'connected':
        return `
          background: #10b98120;
          color: #10b981;
          border: 1px solid #10b98130;
        `;
      case 'disconnected':
        return `
          background: #ef444420;
          color: #ef4444;
          border: 1px solid #ef444430;
        `;
      case 'testing':
        return `
          background: #f59e0b20;
          color: #f59e0b;
          border: 1px solid #f59e0b30;
        `;
      default:
        return `
          background: #6b728020;
          color: #6b7280;
          border: 1px solid #6b728030;
        `;
    }
  }}
`;

const ApiStatus: React.FC = () => {
  const [status, setStatus] = useState<'connected' | 'disconnected' | 'testing'>('testing');
  const [message, setMessage] = useState('API 연결 상태 확인 중...');

  useEffect(() => {
    checkApiConnection();
  }, []);

  const checkApiConnection = async () => {
    try {
      setStatus('testing');
      setMessage('API 연결 테스트 중...');
      
      const isConnected = await apiUtils.testConnection();
      
      if (isConnected) {
        setStatus('connected');
        setMessage('백엔드 API 연결됨');
      } else {
        setStatus('disconnected');
        setMessage('백엔드 API 연결 실패 - 샘플 모드');
      }
    } catch (error) {
      setStatus('disconnected');
      setMessage('백엔드 서버 미실행 - 샘플 모드');
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'connected':
        return <CheckCircle size={14} />;
      case 'disconnected':
        return <XCircle size={14} />;
      case 'testing':
        return <AlertCircle size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  return (
    <StatusContainer status={status} onClick={checkApiConnection} style={{ cursor: 'pointer' }}>
      {getIcon()}
      <span>{message}</span>
    </StatusContainer>
  );
};

export default ApiStatus;