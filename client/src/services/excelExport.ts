// client/src/services/excelExport.ts
import * as XLSX from 'xlsx';

// Excel 내보내기를 위한 유틸리티 함수들
export class ExcelExportService {
  
  // 구매 요청 데이터를 Excel로 내보내기
  static exportPurchaseRequests(data: any[], filename?: string): void {
    // 샘플 데이터가 없다면 기본 샘플 생성
    const sampleData = data.length > 0 ? data : [
      {
        id: 1,
        itemName: "사무용 의자",
        quantity: 5,
        requestedBy: "김철수",
        department: "총무부",
        urgency: "일반",
        status: "대기중",
        requestDate: "2025-01-15",
        reason: "기존 의자 노후화로 교체 필요",
        estimatedPrice: 250000,
        supplier: "오피스퍼니처",
        notes: "인체공학적 디자인 필요"
      },
      {
        id: 2,
        itemName: "노트북",
        quantity: 2,
        requestedBy: "이영희",
        department: "개발팀",
        urgency: "긴급",
        status: "승인됨",
        requestDate: "2025-01-14",
        reason: "신입사원 업무용",
        estimatedPrice: 2000000,
        supplier: "테크월드",
        notes: "고성능 모델 필요"
      },
      {
        id: 3,
        itemName: "프린터 토너",
        quantity: 10,
        requestedBy: "박민수",
        department: "사무관리팀",
        urgency: "보통",
        status: "검토중",
        requestDate: "2025-01-13",
        reason: "재고 부족",
        estimatedPrice: 150000,
        supplier: "오피스코리아",
        notes: "정품 토너만 구매"
      }
    ];

    // Excel에 표시할 컬럼 정의
    const excelData = sampleData.map(item => ({
      '요청번호': item.id,
      '품목명': item.itemName,
      '수량': item.quantity,
      '요청자': item.requestedBy,
      '부서': item.department,
      '긴급도': item.urgency,
      '상태': item.status,
      '요청일': item.requestDate,
      '요청사유': item.reason,
      '예상금액': item.estimatedPrice?.toLocaleString() + '원',
      '공급업체': item.supplier,
      '비고': item.notes
    }));

    // 워크북 생성
    const wb = XLSX.utils.book_new();
    
    // 워크시트 생성
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    const colWidths = [
      { wch: 10 }, // 요청번호
      { wch: 20 }, // 품목명
      { wch: 8 },  // 수량
      { wch: 12 }, // 요청자
      { wch: 15 }, // 부서
      { wch: 10 }, // 긴급도
      { wch: 10 }, // 상태
      { wch: 12 }, // 요청일
      { wch: 25 }, // 요청사유
      { wch: 15 }, // 예상금액
      { wch: 15 }, // 공급업체
      { wch: 20 }  // 비고
    ];
    ws['!cols'] = colWidths;

    // 헤더 스타일 설정 (선택사항)
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
      if (!ws[cellAddress]) continue;
      
      ws[cellAddress].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "E3F2FD" } },
        alignment: { horizontal: "center" }
      };
    }

    // 워크시트를 워크북에 추가
    XLSX.utils.book_append_sheet(wb, ws, "구매요청목록");
    
    // 메타데이터 시트 추가
    const metaData = [
      { 항목: '생성일시', 값: new Date().toLocaleString() },
      { 항목: '총 요청건수', 값: sampleData.length },
      { 항목: '내보내기 사용자', 값: '시스템 관리자' },
      { 항목: '파일 형식', 값: 'Excel (.xlsx)' }
    ];
    
    const metaWs = XLSX.utils.json_to_sheet(metaData);
    metaWs['!cols'] = [{ wch: 15 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, metaWs, "파일정보");

    // 파일 다운로드
    const defaultFilename = `구매요청_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename || defaultFilename);
  }

  // 재고 데이터를 Excel로 내보내기
  static exportInventory(data: any[], filename?: string): void {
    if (data.length === 0) {
      console.warn('내보낼 재고 데이터가 없습니다.');
      return;
    }

    const excelData = data.map(item => ({
      '품목코드': item.item_code,
      '품목명': item.item_name,
      '카테고리': item.category,
      '설명': item.description,
      '단위': item.unit,
      '현재재고': item.current_stock,
      '최소재고': item.min_stock,
      '최대재고': item.max_stock,
      '단가': item.unit_price?.toLocaleString() + '원',
      '공급업체': item.supplier,
      '위치': item.location,
      '활성상태': item.is_active ? '활성' : '비활성',
      '생성일': new Date(item.created_at).toLocaleDateString(),
      '수정일': new Date(item.updated_at).toLocaleDateString()
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // 컬럼 너비 설정
    ws['!cols'] = [
      { wch: 12 }, // 품목코드
      { wch: 20 }, // 품목명
      { wch: 12 }, // 카테고리
      { wch: 25 }, // 설명
      { wch: 8 },  // 단위
      { wch: 10 }, // 현재재고
      { wch: 10 }, // 최소재고
      { wch: 10 }, // 최대재고
      { wch: 12 }, // 단가
      { wch: 15 }, // 공급업체
      { wch: 12 }, // 위치
      { wch: 10 }, // 활성상태
      { wch: 12 }, // 생성일
      { wch: 12 }  // 수정일
    ];

    XLSX.utils.book_append_sheet(wb, ws, "재고목록");

    const defaultFilename = `재고목록_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename || defaultFilename);
  }

  // 수령 내역을 Excel로 내보내기
  static exportReceipts(data: any[], filename?: string): void {
    // 샘플 데이터
    const sampleData = data.length > 0 ? data : [
      {
        id: 1,
        itemName: "사무용 의자",
        requestedQuantity: 5,
        receivedQuantity: 5,
        receiverName: "김철수",
        receiptDate: "2025-01-15",
        notes: "정상 수령 완료"
      },
      {
        id: 2,
        itemName: "노트북",
        requestedQuantity: 2,
        receivedQuantity: 2,
        receiverName: "이영희",
        receiptDate: "2025-01-14",
        notes: "포장 상태 양호"
      }
    ];

    const excelData = sampleData.map(item => ({
      '수령번호': item.id,
      '품목명': item.itemName,
      '요청수량': item.requestedQuantity,
      '수령수량': item.receivedQuantity,
      '수령자': item.receiverName,
      '수령일': item.receiptDate,
      '비고': item.notes
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    ws['!cols'] = [
      { wch: 10 }, // 수령번호
      { wch: 20 }, // 품목명
      { wch: 10 }, // 요청수량
      { wch: 10 }, // 수령수량
      { wch: 12 }, // 수령자
      { wch: 12 }, // 수령일
      { wch: 20 }  // 비고
    ];

    XLSX.utils.book_append_sheet(wb, ws, "수령내역");

    const defaultFilename = `수령내역_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename || defaultFilename);
  }

  // 일반적인 데이터를 Excel로 내보내기
  static exportGeneric(data: any[], sheetName: string, filename?: string): void {
    if (data.length === 0) {
      console.warn('내보낼 데이터가 없습니다.');
      return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    // 자동 컬럼 너비 설정
    const colCount = Object.keys(data[0]).length;
    ws['!cols'] = Array(colCount).fill({ wch: 15 });

    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    const defaultFilename = `${sheetName}_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, filename || defaultFilename);
  }
}

// API 서비스 업데이트
export const updatePurchaseApiExport = {
  // 구매 요청 Excel 내보내기 (실제 구현)
  exportRequests: async (filters?: any): Promise<void> => {
    try {
      // 실제 데이터가 있다면 API에서 가져오기
      // const response = await api.purchase.getRequests({ page: 1, limit: 1000, ...filters });
      // ExcelExportService.exportPurchaseRequests(response.data.items);
      
      // 현재는 샘플 데이터로 내보내기
      ExcelExportService.exportPurchaseRequests([]);
      
    } catch (error) {
      console.error('Excel 내보내기 실패:', error);
      throw new Error('Excel 파일 생성에 실패했습니다.');
    }
  }
};