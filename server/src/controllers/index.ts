// server/src/controllers/index.ts
import { Request, Response } from 'express';
import { ItemCategory } from '../types';

// CSV 업로드 처리 함수 예시
export const processCsvUpload = async (req: Request, res: Response) => {
  try {
    // 실제 CSV 데이터는 req.body나 파일에서 가져와야 함
    const csvData: any[] = req.body.data || []; // 예시 데이터
    
    const processedItems = csvData.map((row: any) => {
      const item = {
        itemName: row['품목명'] || row['itemName'] || '',
        specifications: row['사양'] || row['specifications'] || '',
        quantity: parseInt(row['수량'] || row['quantity'] || '1'),
        unitPrice: parseFloat(row['단가'] || row['unitPrice'] || '0'),
        supplier: row['공급업체'] || row['supplier'] || '',
        category: (row['카테고리'] || row['category'] || 'office_supplies') as ItemCategory,
        urgency: row['긴급도'] || row['urgency'] || 'medium',
        department: row['부서'] || row['department'] || 'IT',
        purchaseMethod: row['구매방법'] || row['purchaseMethod'] || 'direct',
        requesterId: 'bulk-import',
        received: false,
        status: 'pending' as const
      };
      
      // totalPrice 계산
      const itemWithTotal = {
        ...item,
        totalPrice: item.quantity * item.unitPrice
      };
      
      return itemWithTotal;
    });

    res.json({
      success: true,
      message: `${processedItems.length}개 항목이 처리되었습니다.`,
      data: processedItems
    });

  } catch (error) {
    console.error('CSV 처리 오류:', error);
    res.status(500).json({
      success: false,
      error: 'CSV 처리 중 오류가 발생했습니다.'
    });
  }
};