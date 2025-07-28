// client/src/components/inventory/InventoryPage.tsx - 수정된 버전
import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { Plus, Download, Filter, RefreshCw, Edit, Trash2, Package, X, ZoomIn, ZoomOut } from 'lucide-react';

// Components
import Table from '../common/Table';
import Button from '../common/Button';
import Card from '../common/Card';
import Pagination from '../common/Pagination';
import LoadingSpinner from '../common/LoadingSpinner';
import Modal from '../common/Modal';
import InventoryFilters from './InventoryFilters';
import InventoryForm from './InventoryForm';
import ReceiptModal from './ReceiptModal';

import { inventoryApi } from '../../services/api';
import InventoryExcelUpload from './InventoryExcelUpload';

// Services
import api from '../../services/api';

// Types
import { TableColumn, SearchFilters } from '../../types';

interface InventoryItem {
  id: number;
  item_code: string;
  item_name: string;
  category?: string;
  brand?: string;
  current_quantity: number;
  total_received: number;
  reserved_quantity: number;
  minimum_stock: number;
  maximum_stock?: number;
  unit_price?: number;
  currency: string;
  supplier_name?: string;
  supplier_contact?: string;
  location?: string;
  warehouse?: string;
  is_active: boolean;
  description?: string;
  receipt_history?: ReceiptHistory[];
  condition_quantities?: { [key: string]: number };
  last_received_date?: string;
  last_received_by?: string;
  stock_status: 'normal' | 'low_stock' | 'out_of_stock' | 'overstocked';
  created_at: string;
  updated_at?: string;
  image_urls?: string[];
  main_image_url?: string;
}

interface ReceiptHistory {
  receipt_number: string;
  item_name: string;
  expected_quantity: number;
  received_quantity: number;
  receiver_name: string;
  department: string;
  received_date: string;
  condition?: string;
  notes?: string;
  image_urls?: string[];
}

const Container = styled.div`
  padding: 20px;
  
  /* 🔥 테이블 세로 가운데 정렬 강제 적용 */
  table {
    td, th {
      vertical-align: middle !important;
      padding: 12px;
    }
    
    tbody tr {
      height: 80px; /* 행 높이를 고정하여 일관성 유지 */
    }
    
    /* 호버 효과 개선 */
    tbody tr:hover {
      background-color: #f8fafc;
    }
  }
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

const FilterContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-left: auto;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled(Card)<{ color?: string }>`
  text-align: center;
  background: ${props => props.color ? `linear-gradient(135deg, ${props.color}20 0%, ${props.color}10 100%)` : 'white'};
  border-left: 4px solid ${props => props.color || props.theme.colors.primary};
  
  h3 {
    font-size: 2rem;
    margin-bottom: 5px;
    color: ${props => props.color || props.theme.colors.primary};
  }
  
  p {
    font-size: 0.9rem;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

// 🔥 수정: 수령 상태 표시를 위한 새로운 컴포넌트
const ReceiptStatusBadge = styled.span<{ hasReceipts: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  background: ${props => props.hasReceipts ? '#10B98120' : '#F59E0B20'};
  color: ${props => props.hasReceipts ? '#10B981' : '#F59E0B'};
`;

const ActionButtonGroup = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 40px;
`;

const StockIndicator = styled.div<{ stockLevel: 'high' | 'medium' | 'low' | 'out' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .stock-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.stockLevel) {
        case 'high': return '#10B981';
        case 'medium': return '#F59E0B';
        case 'low': return '#EF4444';
        case 'out': return '#6B7280';
        default: return '#6B7280';
      }
    }};
  }
  
  .stock-text {
    font-weight: 500;
  }
`;

const QuantityInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  justify-content: center;
  
  .main-quantity {
    font-weight: bold;
    font-size: 0.95rem;
  }
  
  .sub-info {
    font-size: 0.8rem;
    color: #666;
  }
`;

// 🔥 새로운: 이미지 미리보기 컴포넌트
const ImagePreviewGrid = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  max-width: 300px;
  align-items: center;
  justify-content: center;
  
  .thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 4px;
    border: 1px solid #e5e7eb;
    transition: all 0.2s ease;
    
    &:hover {
      transform: scale(1.05);
      border-color: #3b82f6;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.2);
    }
  }
  
  .more-images {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: #f3f4f6;
    border-radius: 4px;
    font-size: 0.75rem;
    color: #6b7280;
    border: 1px solid #e5e7eb;
  }
  
  .no-image {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: #f9fafb;
    border-radius: 4px;
    font-size: 0.7rem;
    color: #9ca3af;
    border: 1px dashed #d1d5db;
  }
`;

// 기존 스타일 컴포넌트들 아래에 추가
const ImageViewerModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
`;

const ImageViewerContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 8px;
  overflow: hidden;
`;

const ImageViewerHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 15px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  
  h3 {
    margin: 0;
    flex: 1;
    font-size: 1.1rem;
    color: #333;
  }
`;

const ImageViewerControls = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ImageViewerContent = styled.div`
  position: relative;
  overflow: auto;
  max-height: calc(90vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
`;

const ViewerImage = styled.img<{ zoom: number }>`
  max-width: 100%;
  max-height: 100%;
  transform: scale(${props => props.zoom});
  transition: transform 0.2s ease;
  cursor: ${props => props.zoom > 1 ? 'grab' : 'default'};
  
  &:active {
    cursor: ${props => props.zoom > 1 ? 'grabbing' : 'default'};
  }
`;

const ZoomButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f3f4f6;
    border-color: #9ca3af;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  margin-left: 10px;
  
  &:hover {
    background: #f3f4f6;
    border-color: #ef4444;
    color: #ef4444;
  }
`;

const InventoryPage: React.FC = () => {
  const queryClient = useQueryClient();
  
  // State
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isReceiptWithImagesModalOpen, setIsReceiptWithImagesModalOpen] = useState(false);
  const [selectedItemForReceipt, setSelectedItemForReceipt] = useState<InventoryItem | null>(null);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>('');
  const [imageZoom, setImageZoom] = useState(1);
  const [isExcelUploadModalOpen, setIsExcelUploadModalOpen] = useState(false);

  // 재고 목록 조회
  const { 
    data: inventoryData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['unified-inventory', currentPage, filters],
    queryFn: () => api.inventory.getItems(currentPage, 20, filters),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    retry: 3,
  });

  // 재고 통계 조회
  const { data: statsData } = useQuery({
    queryKey: ['unified-inventory-stats'],
    queryFn: () => api.inventory.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  // 🔥 수정: 수령 완료 처리 (이미지 포함) - FormData 방식으로 변경
  const addReceiptWithImagesMutation = useMutation({
    mutationFn: async ({ itemId, receiptData, images }: { 
      itemId: number; 
      receiptData: any; 
      images: File[] 
    }) => {
      const formData = new FormData();
      
      // 수령 데이터를 FormData에 추가
      formData.append('received_quantity', receiptData.received_quantity.toString());
      formData.append('receiver_name', receiptData.receiver_name);
      if (receiptData.receiver_email) formData.append('receiver_email', receiptData.receiver_email);
      formData.append('department', receiptData.department);
      formData.append('received_date', receiptData.received_date);
      if (receiptData.location) formData.append('location', receiptData.location);
      formData.append('condition', receiptData.condition || 'good');
      if (receiptData.notes) formData.append('notes', receiptData.notes);
      
      // 이미지 파일들 추가
      images.forEach((image, index) => {
        formData.append('images', image);
      });
      
      // API 호출
      const response = await fetch(`http://localhost:8000/api/v1/inventory/${itemId}/complete-receipt-with-images`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || '수령 처리 중 오류가 발생했습니다.');
      }
      
      return response.json();
    },
    onSuccess: (responseData, variables) => {
      console.log('수령 완료 성공:', responseData);
      
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      
      // 안전한 itemId 참조
      if (variables?.itemId) {
        queryClient.invalidateQueries({ queryKey: ['inventory-item', variables.itemId] });
      }
      
      refetch();
      toast.success('🎉 수령이 완료되고 이미지가 업로드되었습니다!');
      setIsReceiptWithImagesModalOpen(false);
      setSelectedItemForReceipt(null);
    },
    onError: (error: any) => {
      console.error('수령 처리 오류:', error);
      toast.error(error.message || '수령 처리 중 오류가 발생했습니다.');
    },
  });

  // 나머지 mutations (기존과 동일)
  const createItemMutation = useMutation({
    mutationFn: api.inventory.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('품목이 등록되었습니다.');
      handleFormModalClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '품목 등록 중 오류가 발생했습니다.');
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => 
      api.inventory.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('품목이 수정되었습니다.');
      handleFormModalClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '품목 수정 중 오류가 발생했습니다.');
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: api.inventory.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('품목이 삭제되었습니다.');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '삭제 중 오류가 발생했습니다.');
    },
  });

  const addReceiptMutation = useMutation({
    mutationFn: ({ itemId, receiptData }: { itemId: number; receiptData: any }) =>
      api.inventory.addReceipt(itemId, receiptData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unified-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['unified-inventory-stats'] });
      toast.success('수령 내역이 추가되었습니다.');
      setIsReceiptModalOpen(false);
      setSelectedItem(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || '수령 추가 중 오류가 발생했습니다.');
    },
  });

  const exportMutation = useMutation({
    mutationFn: () => api.inventory.exportData(),
    onSuccess: (blob: Blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Excel 파일이 다운로드되었습니다.');
    },
    onError: () => {
      toast.error('내보내기 중 오류가 발생했습니다.');
    },
  });

  // 🔥 수정: 수령 상태 판단 함수
  const hasReceipts = (item: InventoryItem): boolean => {
    // 1. receipt_history 배열 확인
    const hasReceiptHistory = item.receipt_history && item.receipt_history.length > 0;
    
    // 2. last_received_date 확인
    const hasLastReceived = Boolean(item.last_received_date);
    
    // 3. last_received_by 확인
    const hasReceivedBy = Boolean(item.last_received_by);
    
    // 4. 총 수령량 확인
    const hasTotalReceived = item.total_received && item.total_received > 0;
    
    // 어느 하나라도 있으면 수령 완료로 판단
    const result = hasReceiptHistory || hasLastReceived || hasReceivedBy || hasTotalReceived;
    
    console.log(`품목 ${item.id} 수령 상태 확인:`, {
      hasReceiptHistory,
      hasLastReceived,
      hasReceivedBy,
      hasTotalReceived,
      result,
      receipt_history_length: item.receipt_history?.length || 0
    });
    
    return result;
  };

  // 재고 수준 계산
  const getStockLevel = (current: number, minimum: number): 'high' | 'medium' | 'low' | 'out' => {
    const currentNum = Number(current) || 0;
    const minimumNum = Number(minimum) || 0;
    
    if (currentNum === 0) return 'out';
    if (minimumNum === 0) return 'high';
    if (currentNum <= minimumNum) return 'low';
    if (currentNum <= minimumNum * 2) return 'medium';
    return 'high';
  };

  // 재고 상태 표시
  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'low_stock': return '#F59E0B';
      case 'out_of_stock': return '#EF4444';
      case 'overstocked': return '#3B82F6';
      default: return '#6B7280';
    }
  };
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // 이미 전체 URL인 경우
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // 상대 경로인 경우 전체 URL로 변환
    return `http://localhost:8000${imageUrl}`;
  };
  const handleImageClick = (imageUrl: string, itemName: string, imageIndex: number) => {
    setSelectedImageUrl(getFullImageUrl(imageUrl));
    setSelectedImageName(`${itemName}_이미지_${imageIndex + 1}`);
    setImageZoom(1);
  };

  // 이미지 다운로드 핸들러
  const handleImageDownload = async () => {
    if (!selectedImageUrl || !selectedImageName) return;
    
    try {
      const response = await fetch(selectedImageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `${selectedImageName}.${getFileExtension(selectedImageUrl)}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('이미지가 다운로드되었습니다.');
    } catch (error) {
      console.error('다운로드 실패:', error);
      toast.error('이미지 다운로드에 실패했습니다.');
    }
  };

  // 파일 확장자 추출
  const getFileExtension = (url: string): string => {
    const match = url.match(/\.[^.]+$/);
    return match ? match[0].slice(1) : 'jpg';
  };

  // 줌 컨트롤
  const handleZoomIn = () => {
    setImageZoom(prev => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setImageZoom(prev => Math.max(prev - 0.25, 0.5));
  };

  // 모달 닫기
  const handleCloseImageViewer = () => {
    setSelectedImageUrl(null);
    setSelectedImageName('');
    setImageZoom(1);
  };

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseImageViewer();
      }
    };

    if (selectedImageUrl) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedImageUrl]);

  // 🔥 수정: 테이블 컬럼 정의 - 상태 표시 로직 변경
  const columns: TableColumn<InventoryItem>[] = useMemo(() => [
    {
      key: 'item_code',
      label: '품목코드',
      sortable: true,
      width: '160px',
      style: { verticalAlign: 'middle' },
      render: (value) => (
        <span style={{ fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: '500' }}>
          {value}
        </span>
      ),
    },
    {
      key: 'item_name',
      label: '품목명',
      sortable: true,
      style: { verticalAlign: 'middle' },
      render: (value, item) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{value}</div>
          {item.brand && (
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              {item.brand}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'current_quantity',
      label: '재고 현황',
      sortable: true,
      width: '140px',
      style: { verticalAlign: 'middle' },
      render: (value, item) => (
        <QuantityInfo>
          <div className="main-quantity" style={{ color: getStockStatusColor(item.stock_status) }}>
            현재: {value.toLocaleString()}
          </div>
          {/* <div className="sub-info">
            총수령: {item.total_received?.toLocaleString() || 0}
          </div> */}
          {/* <div className="sub-info">
            최소: {item.minimum_stock?.toLocaleString() || 0}
          </div> */}
        </QuantityInfo>
      ),
    },
    {
      key: 'unit_price',
      label: '단가',
      sortable: true,
      width: '160px',
      align: 'right',
      style: { verticalAlign: 'middle' },
      render: (value, item) => {
        if (!value || value === 0) return '-';
        const currency = item.currency || '원';
        return `${currency} ${value.toLocaleString()}`;
      },
    },
    {
      key: 'last_received_date',
      label: '최근수령일',
      width: '130px',
      style: { verticalAlign: 'middle' },
      render: (value) => value ? new Date(value).toLocaleDateString('ko-KR') : '-',
    },
    {
      key: 'image_urls',
      label: '이미지',
      width: '150px',
      style: { verticalAlign: 'middle' },
      render: (value, item) => {
        const allImageUrls = [];
        
        if (item.main_image_url) {
          allImageUrls.push(item.main_image_url);
        }
        
        if (item.image_urls && item.image_urls.length > 0) {
          item.image_urls.forEach(url => {
            if (!allImageUrls.includes(url)) {
              allImageUrls.push(url);
            }
          });
        }
        
        const displayImages = allImageUrls.slice(0, 3);
        
        if (allImageUrls.length === 0) {
          return (
            <ImagePreviewGrid>
              <div className="no-image">이미지 없음</div>
            </ImagePreviewGrid>
          );
        }
        
        return (
          <ImagePreviewGrid>
            {displayImages.map((url, index) => (
              <img
                key={index}
                src={getFullImageUrl(url)}
                alt={`${item.item_name} ${index + 1}`}
                className="thumbnail"
                style={{ cursor: 'pointer' }} // 🔥 추가: 클릭 가능 표시
                onClick={() => handleImageClick(url, item.item_name, index)} // 🔥 추가: 클릭 이벤트
                onError={(e) => {
                  console.error('이미지 로딩 실패:', url);
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ))}
            {allImageUrls.length > 3 && (
              <div className="more-images">+{allImageUrls.length - 3}</div>
            )}
          </ImagePreviewGrid>
        );
      },
    },
    {
      key: 'receipt_status',
      label: '수령 상태',
      width: '120px',
      style: { verticalAlign: 'middle' },
      render: (_, item) => (
        <ReceiptStatusBadge hasReceipts={hasReceipts(item)}>
          {hasReceipts(item) ? '수령 완료' : '수령 대기'}
        </ReceiptStatusBadge>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      width: '180px',
      style: { verticalAlign: 'middle' },
      render: (_, item) => {
        const itemHasReceipts = hasReceipts(item);
        
        return (
          <ActionButtonGroup>
            {/* 🔥 수정: !!를 사용하여 Boolean 변환 또는 && 대신 ? : 사용 */}
            {!itemHasReceipts ? (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleReceiptWithImages(item)}
                title="수령완료 (이미지 포함)"
                style={{
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: 'white',
                  fontWeight: '600'
                }}
              >
                <Package size={14} />
                수령
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                disabled
                title="수령 완료됨"
                style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  border: '1px solid #16a34a'
                }}
              >
                <Package size={14} />
                완료됨  
              </Button>
            )}
            
            {/* 기존 수령 추가 버튼 (항상 표시) */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleAddReceipt(item)}
              title="추가 수령"
            >
              <Package size={14} />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(item)}
              title="수정"
            >
              <Edit size={14} />
            </Button>
            
            <Button
              size="sm"
              variant="danger"
              onClick={() => handleDelete(item.id)}
              title="삭제"
            >
              <Trash2 size={14} />
            </Button>
          </ActionButtonGroup>
        );
      },
    }
  ], []);

  // 이벤트 핸들러들
  const handleReceiptWithImages = (item: InventoryItem) => {
    setSelectedItemForReceipt(item);
    setIsReceiptWithImagesModalOpen(true);
  };

  const handleReceiptWithImagesSubmit = (receiptData: any, images: File[]) => {
    if (selectedItemForReceipt) {
      addReceiptWithImagesMutation.mutate({
        itemId: selectedItemForReceipt.id,
        receiptData,
        images
      });
    }
  };

  const handleSearch = (searchFilters: SearchFilters) => {
    setFilters(searchFilters);
    setCurrentPage(1);
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setIsFormModalOpen(true);
  };

  const handleDelete = async (itemId: number) => {
    if (window.confirm('정말로 이 품목을 삭제하시겠습니까?')) {
      deleteItemMutation.mutate(itemId);
    }
  };

  const handleExport = () => {
    exportMutation.mutate();
  };

  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setEditingItem(null);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingItem) {
      updateItemMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createItemMutation.mutate(formData);
    }
  };

  const handleAddReceipt = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsReceiptModalOpen(true);
  };

  const handleReceiptSubmit = (receiptData: any) => {
    if (selectedItem) {
      addReceiptMutation.mutate({ 
        itemId: selectedItem.id, 
        receiptData 
      });
    }
  };

  
  
  // 데이터 추출
  const items = inventoryData?.data?.items || [];
  const totalPages = inventoryData?.data?.pages || 0;
  const stats = statsData?.data || {};

  if (isLoading) {
    return <LoadingSpinner text="재고 데이터를 불러오는 중..." />;
  }

  if (error) {
    console.error('Inventory error:', error);
    return (
      <Container>
        <Card>
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
            <Button onClick={() => refetch()}>다시 시도</Button>
          </div>
        </Card>
      </Container>
    );
  }

  return (
    <Container>
      <PageTitle>품목 관리</PageTitle>
      <PageSubtitle>전체 품목 현황을 관리하고 모니터링할 수 있습니다.</PageSubtitle>

      {/* 통계 카드 */}
      <StatsContainer>
        <StatCard color="#3B82F6">
          <h3>{stats?.total_items || 0}</h3>
          <p>전체 품목</p>
        </StatCard>
        <StatCard color="#10B981">
          <h3>{items.filter(item => hasReceipts(item)).length}</h3>
          <p>수령 완료</p>
        </StatCard>
        <StatCard color="#F59E0B">
          <h3>{stats?.low_stock_items || 0}</h3>
          <p>재고 부족</p>
        </StatCard>
        <StatCard color="#EF4444">
          <h3>{stats?.out_of_stock_items || 0}</h3>
          <p>재고 없음</p>
        </StatCard>
      </StatsContainer>

      <Card>
        {/* 필터 및 액션 버튼 */}
        <FilterContainer>
          <InventoryFilters onFilter={handleSearch} />
          
          <ActionButtons>
            <Button
              variant="outline"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw size={16} />
              새로고침
            </Button>
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={exportMutation.isPending}
              loading={exportMutation.isPending}
            >
              <Download size={16} />
              Excel 다운로드
            </Button>
            <Button onClick={() => setIsFormModalOpen(true)}>
              <Plus size={16} />
              품목 추가
            </Button>
            {/* 🔥 새로 추가: Excel 업로드 버튼 */}
            {/* <Button
              variant="outline"
              onClick={() => setIsExcelUploadModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderColor: '#10b981'
              }}
            >
              <span>Excel 업로드</span>
            </Button> */}
            {/* <Button onClick={() => setIsFormModalOpen(true)}>
              <Plus size={16} />
              품목 추가
            </Button> */}
          </ActionButtons>
        </FilterContainer>

        {/* 테이블 */}
        <Table
          columns={columns}
          data={items}
          loading={isLoading}
          emptyMessage="등록된 품목이 없습니다."
        />

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </Card>

      {/* 품목 추가/수정 모달 */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleFormModalClose}
        title={editingItem ? '품목 수정' : '새 품목 추가'}
        size="lg"
      >
        <InventoryForm
          item={editingItem}
          onSubmit={handleFormSubmit}
          onCancel={handleFormModalClose}
          loading={createItemMutation.isPending || updateItemMutation.isPending}
        />
      </Modal>

      {/* 🔥 수령완료 모달 (이미지 포함) */}
      {isReceiptWithImagesModalOpen && selectedItemForReceipt && (
        <Modal
          isOpen={isReceiptWithImagesModalOpen}
          onClose={() => {
            setIsReceiptWithImagesModalOpen(false);
            setSelectedItemForReceipt(null);
          }}
          title={`수령완료 - ${selectedItemForReceipt.item_name}`}
          size="lg"
        >
          <ReceiptModal
            item={selectedItemForReceipt}
            onSubmit={handleReceiptWithImagesSubmit}
            onCancel={() => {
              setIsReceiptWithImagesModalOpen(false);
              setSelectedItemForReceipt(null);
            }}
            loading={addReceiptWithImagesMutation.isPending}
            requireImages={true}
          />
        </Modal>
      )}

      {/* 수령 추가 모달 */}
      {isReceiptModalOpen && selectedItem && (
        <Modal
          isOpen={isReceiptModalOpen}
          onClose={() => setIsReceiptModalOpen(false)}
          title={`수령 추가 - ${selectedItem.item_name}`}
          size="lg"
        >
          <ReceiptModal
            item={selectedItem}
            onSubmit={handleReceiptSubmit}
            onCancel={() => setIsReceiptModalOpen(false)}
            loading={addReceiptMutation.isPending}
            requireImages={false}
          />
        </Modal>
      )}
      {/* 🔥 이미지 뷰어 모달 */}
      {selectedImageUrl && (
        <ImageViewerModal onClick={handleCloseImageViewer}>
          <ImageViewerContainer onClick={(e) => e.stopPropagation()}>
            <ImageViewerHeader>
              <h3>{selectedImageName}</h3>
              <ImageViewerControls>
                <ZoomButton
                  onClick={handleZoomOut}
                  disabled={imageZoom <= 0.5}
                  title="축소"
                >
                  <ZoomOut size={16} />
                </ZoomButton>
                
                <span style={{ 
                  fontSize: '0.9rem', 
                  color: '#666',
                  minWidth: '60px',
                  textAlign: 'center'
                }}>
                  {Math.round(imageZoom * 100)}%
                </span>
                
                <ZoomButton
                  onClick={handleZoomIn}
                  disabled={imageZoom >= 3}
                  title="확대"
                >
                  <ZoomIn size={16} />
                </ZoomButton>
                
                <DownloadButton
                  onClick={handleImageDownload}
                  title="이미지 다운로드"
                >
                  <Download size={16} />
                  다운로드
                </DownloadButton>
                
                <CloseButton
                  onClick={handleCloseImageViewer}
                  title="닫기"
                >
                  <X size={16} />
                </CloseButton>
              </ImageViewerControls>
            </ImageViewerHeader>
            
            <ImageViewerContent>
              <ViewerImage
                src={selectedImageUrl}
                alt={selectedImageName}
                zoom={imageZoom}
              />
            </ImageViewerContent>
          </ImageViewerContainer>
        </ImageViewerModal>
      )}
      <InventoryExcelUpload
        isOpen={isExcelUploadModalOpen}
        onClose={() => setIsExcelUploadModalOpen(false)}
        onSuccess={() => {
          setIsExcelUploadModalOpen(false);
          refetch();
        }}
      />
    </Container>
  );
};

export default InventoryPage;