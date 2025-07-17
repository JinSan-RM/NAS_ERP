"use strict";
// CSV 데이터 처리 부분에서
const processedItems = csvData.map((row) => {
    const item = {
        itemName: row['품목명'] || row['itemName'] || '',
        specifications: row['사양'] || row['specifications'] || '',
        quantity: parseInt(row['수량'] || row['quantity'] || '1'),
        unitPrice: parseFloat(row['단가'] || row['unitPrice'] || '0'),
        supplier: row['공급업체'] || row['supplier'] || '',
        category: row['카테고리'] || row['category'] || 'office_supplies',
        urgency: row['긴급도'] || row['urgency'] || 'medium',
        department: row['부서'] || row['department'] || 'IT',
        purchaseMethod: row['구매방법'] || row['purchaseMethod'] || 'direct',
        requesterId: 'bulk-import',
        received: false,
        status: 'pending'
    };
    // totalPrice 계산
    const itemWithTotal = {
        ...item,
        totalPrice: item.quantity * item.unitPrice
    };
    return itemWithTotal;
});
