const express = require('express');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const moment = require('moment');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const timestamp = moment().format('YYYYMMDD_HHmmss');
    const ext = path.extname(file.originalname);
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.includes('sheet') || file.originalname.includes('.xlsx') || file.originalname.includes('.xls')) {
      cb(null, true);
    } else {
      cb(new Error('엑셀 파일만 업로드 가능합니다.'), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// 데이터 저장소 (실제 운영에서는 데이터베이스 사용 권장)
let inventoryData = [];
let receiptHistory = [];
let purchaseRequests = [];
let systemLogs = [];

// ID 생성기
let nextRequestId = 1;
let nextReceiptId = 1;

// 로그 기록 함수
function addLog(action, details, user = 'System') {
  systemLogs.push({
    id: systemLogs.length + 1,
    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
    user,
    action,
    details,
    ip: 'localhost'
  });
}

// 데이터 파일 경로
const DATA_FILES = {
  inventory: './data/inventory.json',
  receipts: './data/receipts.json',
  requests: './data/requests.json',
  logs: './data/logs.json'
};

// 데이터 저장 함수
function saveData() {
  try {
    if (!fs.existsSync('./data')) {
      fs.mkdirSync('./data', { recursive: true });
    }
    
    fs.writeFileSync(DATA_FILES.inventory, JSON.stringify(inventoryData, null, 2));
    fs.writeFileSync(DATA_FILES.receipts, JSON.stringify(receiptHistory, null, 2));
    fs.writeFileSync(DATA_FILES.requests, JSON.stringify(purchaseRequests, null, 2));
    fs.writeFileSync(DATA_FILES.logs, JSON.stringify(systemLogs, null, 2));
  } catch (error) {
    console.error('데이터 저장 오류:', error);
  }
}

// 데이터 로드 함수
function loadData() {
  try {
    if (fs.existsSync(DATA_FILES.inventory)) {
      inventoryData = JSON.parse(fs.readFileSync(DATA_FILES.inventory, 'utf8'));
    }
    if (fs.existsSync(DATA_FILES.receipts)) {
      receiptHistory = JSON.parse(fs.readFileSync(DATA_FILES.receipts, 'utf8'));
      nextReceiptId = Math.max(...receiptHistory.map(r => r.id), 0) + 1;
    }
    if (fs.existsSync(DATA_FILES.requests)) {
      purchaseRequests = JSON.parse(fs.readFileSync(DATA_FILES.requests, 'utf8'));
      nextRequestId = Math.max(...purchaseRequests.map(r => r.id), 0) + 1;
    }
    if (fs.existsSync(DATA_FILES.logs)) {
      systemLogs = JSON.parse(fs.readFileSync(DATA_FILES.logs, 'utf8'));
    }
    console.log('데이터 로드 완료');
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  }
}

// 엑셀 파일에서 데이터 로드
function loadInventoryFromExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    // 헤더 확인 및 데이터 파싱
    const headers = data[0];
    const items = data.slice(1).filter(row => row[0]).map((row) => ({
      no: row[0] || inventoryData.length + 1,
      itemName: row[1] || '',
      specifications: row[2] || '',
      quantity: parseInt(row[3]) || 0,
      unitPrice: parseInt(row[4]) || 0,
      totalPrice: parseInt(row[5]) || 0,
      supplier: row[6] || '',
      notes: row[7] || '',
      requestDate: row[8] ? moment(row[8]).format('YYYY-MM-DD') : '',
      purchaseDate: row[9] ? moment(row[9]).format('YYYY-MM-DD') : '',
      deliveryDate: row[10] ? moment(row[10]).format('YYYY-MM-DD') : '',
      received: row[11] ? true : false,
      returnRefund: row[12] || '',
      status: row[11] ? '수령완료' : '주문중',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    }));
    
    inventoryData = items;
    saveData();
    addLog('Excel Import', `${items.length}개 품목 로드 완료`);
    
    return items.length;
  } catch (error) {
    console.error('엑셀 파일 로드 중 오류:', error);
    throw error;
  }
}

// 서버 시작 시 데이터 로드
loadData();

// 메인 페이지
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== API 엔드포인트 =====

// 대시보드 통계
app.get('/api/dashboard', (req, res) => {
  const stats = {
    totalItems: inventoryData.length,
    receivedItems: inventoryData.filter(item => item.received).length,
    pendingItems: inventoryData.filter(item => !item.received).length,
    totalRequests: purchaseRequests.length,
    pendingRequests: purchaseRequests.filter(req => req.status === '대기중').length,
    approvedRequests: purchaseRequests.filter(req => req.status === '승인됨').length,
    totalValue: inventoryData.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
    recentReceipts: receiptHistory.slice(-5).reverse()
  };
  res.json(stats);
});

// 품목 관리
app.get('/api/items', (req, res) => {
  const { search, status, page = 1, limit = 20 } = req.query;
  let filtered = [...inventoryData];
  
  if (search) {
    filtered = filtered.filter(item => 
      item.itemName.toLowerCase().includes(search.toLowerCase()) ||
      item.specifications.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (status && status !== 'all') {
    if (status === 'received') {
      filtered = filtered.filter(item => item.received);
    } else if (status === 'pending') {
      filtered = filtered.filter(item => !item.received);
    }
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedItems = filtered.slice(startIndex, endIndex);
  
  res.json({
    items: paginatedItems,
    total: filtered.length,
    page: parseInt(page),
    totalPages: Math.ceil(filtered.length / limit)
  });
});

// 특정 품목 조회
app.get('/api/items/:no', (req, res) => {
  const itemNo = parseInt(req.params.no);
  const item = inventoryData.find(item => item.no === itemNo);
  
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: '품목을 찾을 수 없습니다.' });
  }
});

// 품목 추가/수정
app.post('/api/items', (req, res) => {
  const itemData = req.body;
  
  if (itemData.no) {
    // 기존 품목 수정
    const index = inventoryData.findIndex(item => item.no === parseInt(itemData.no));
    if (index !== -1) {
      inventoryData[index] = {
        ...inventoryData[index],
        ...itemData,
        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
      saveData();
      addLog('Item Updated', `품목 ${itemData.no} 수정`);
      res.json({ success: true, message: '품목이 수정되었습니다.' });
    } else {
      res.status(404).json({ error: '품목을 찾을 수 없습니다.' });
    }
  } else {
    // 새 품목 추가
    const newItem = {
      ...itemData,
      no: Math.max(...inventoryData.map(item => item.no), 0) + 1,
      received: false,
      status: '주문중',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    inventoryData.push(newItem);
    saveData();
    addLog('Item Added', `새 품목 추가: ${newItem.itemName}`);
    res.json({ success: true, message: '품목이 추가되었습니다.', item: newItem });
  }
});

// 품목 삭제
app.delete('/api/items/:no', (req, res) => {
  const itemNo = parseInt(req.params.no);
  const index = inventoryData.findIndex(item => item.no === itemNo);
  
  if (index !== -1) {
    const deletedItem = inventoryData.splice(index, 1)[0];
    saveData();
    addLog('Item Deleted', `품목 삭제: ${deletedItem.itemName}`);
    res.json({ success: true, message: '품목이 삭제되었습니다.' });
  } else {
    res.status(404).json({ error: '품목을 찾을 수 없습니다.' });
  }
});

// 구매 요청 관리
app.get('/api/purchase-requests', (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  let filtered = [...purchaseRequests];
  
  if (status && status !== 'all') {
    filtered = filtered.filter(req => req.status === status);
  }
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedRequests = filtered.slice(startIndex, endIndex);
  
  res.json({
    requests: paginatedRequests.reverse(),
    total: filtered.length,
    page: parseInt(page),
    totalPages: Math.ceil(filtered.length / limit)
  });
});

// 구매 요청 추가
app.post('/api/purchase-requests', (req, res) => {
  const requestData = req.body;
  
  const newRequest = {
    id: nextRequestId++,
    ...requestData,
    status: '대기중',
    requestDate: moment().format('YYYY-MM-DD'),
    createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
  };
  
  purchaseRequests.push(newRequest);
  saveData();
  addLog('Purchase Request', `구매요청: ${newRequest.itemName} (${newRequest.requester})`);
  
  res.json({ success: true, message: '구매 요청이 등록되었습니다.', request: newRequest });
});

// 구매 요청 상태 변경
app.put('/api/purchase-requests/:id', (req, res) => {
  const requestId = parseInt(req.params.id);
  const { status, approver, notes } = req.body;
  
  const request = purchaseRequests.find(req => req.id === requestId);
  if (!request) {
    return res.status(404).json({ error: '구매 요청을 찾을 수 없습니다.' });
  }
  
  request.status = status;
  request.approver = approver;
  request.approverNotes = notes;
  request.approvedDate = moment().format('YYYY-MM-DD');
  request.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  
  // 승인된 경우 품목에 추가
  if (status === '승인됨') {
    const newItem = {
      no: Math.max(...inventoryData.map(item => item.no), 0) + 1,
      itemName: request.itemName,
      specifications: request.specifications || '',
      quantity: request.quantity,
      unitPrice: request.estimatedPrice || 0,
      totalPrice: (request.estimatedPrice || 0) * request.quantity,
      supplier: request.preferredSupplier || '',
      notes: `구매요청 승인됨 (요청자: ${request.requester})`,
      requestDate: request.requestDate,
      received: false,
      status: '주문중',
      createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
    };
    
    inventoryData.push(newItem);
    addLog('Request Approved', `구매요청 승인 → 품목 추가: ${newItem.itemName}`);
  }
  
  saveData();
  addLog('Request Status Change', `구매요청 ${status}: ${request.itemName}`);
  
  res.json({ success: true, message: '구매 요청 상태가 변경되었습니다.' });
});

// 물품 수령 처리
app.post('/api/receipt', (req, res) => {
  const { itemNo, receivedQuantity, receiverName, notes } = req.body;
  
  const item = inventoryData.find(item => item.no === parseInt(itemNo));
  if (!item) {
    return res.status(404).json({ error: '품목을 찾을 수 없습니다.' });
  }
  
  const receiptRecord = {
    id: nextReceiptId++,
    itemNo: parseInt(itemNo),
    itemName: item.itemName,
    receivedQuantity: parseInt(receivedQuantity),
    receiverName,
    notes: notes || '',
    receivedDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    timestamp: Date.now()
  };
  
  receiptHistory.push(receiptRecord);
  
  // 품목의 수령 상태 업데이트
  item.received = true;
  item.receivedDate = receiptRecord.receivedDate;
  item.status = '수령완료';
  item.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
  
  saveData();
  addLog('Item Received', `물품 수령: ${item.itemName} (${receiverName})`);
  
  res.json({ 
    success: true, 
    message: '물품 수령이 처리되었습니다.',
    receipt: receiptRecord
  });
});

// 수령 내역 조회
app.get('/api/receipts', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedReceipts = receiptHistory
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(startIndex, endIndex);
  
  res.json({
    receipts: paginatedReceipts,
    total: receiptHistory.length,
    page: parseInt(page),
    totalPages: Math.ceil(receiptHistory.length / limit)
  });
});

// 엑셀 파일 업로드
app.post('/api/upload', upload.single('excelFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }
  
  try {
    const itemCount = loadInventoryFromExcel(req.file.path);
    res.json({ 
      success: true, 
      message: `파일이 성공적으로 업로드되고 ${itemCount}개 품목이 로드되었습니다.`,
      itemCount: itemCount
    });
  } catch (error) {
    console.error('파일 처리 오류:', error);
    res.status(500).json({ error: '파일 처리 중 오류가 발생했습니다.' });
  }
});

// 엑셀 다운로드
app.get('/api/export/:type', (req, res) => {
  const { type } = req.params;
  let data = [];
  let filename = '';
  
  try {
    switch (type) {
      case 'inventory':
        data = inventoryData;
        filename = `inventory_${moment().format('YYYYMMDD')}.xlsx`;
        break;
      case 'receipts':
        data = receiptHistory;
        filename = `receipts_${moment().format('YYYYMMDD')}.xlsx`;
        break;
      case 'requests':
        data = purchaseRequests;
        filename = `purchase_requests_${moment().format('YYYYMMDD')}.xlsx`;
        break;
      default:
        return res.status(400).json({ error: '잘못된 내보내기 타입입니다.' });
    }
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, type);
    
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`
    });
    
    res.send(buffer);
    addLog('Export', `${type} 데이터 내보내기`);
    
  } catch (error) {
    console.error('내보내기 오류:', error);
    res.status(500).json({ error: '내보내기 중 오류가 발생했습니다.' });
  }
});

// 시스템 로그 조회
app.get('/api/logs', (req, res) => {
  const { page = 1, limit = 50 } = req.query;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedLogs = systemLogs
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(startIndex, endIndex);
  
  res.json({
    logs: paginatedLogs,
    total: systemLogs.length,
    page: parseInt(page),
    totalPages: Math.ceil(systemLogs.length / limit)
  });
});

// 카카오톡 메시지 형식 파싱 API
app.post('/api/parse-message', (req, res) => {
  const { message } = req.body;
  
  try {
    const lines = message.split('\n');
    const parsed = {};
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('품목 번호') || trimmed.includes('품목번호')) {
        const match = trimmed.match(/품목\s*번호\s*[:：]\s*(\d+)/);
        if (match) parsed.itemNo = parseInt(match[1]);
      } else if (trimmed.includes('품목명')) {
        const match = trimmed.match(/품목명\s*[:：]\s*(.+)/);
        if (match) parsed.itemName = match[1].trim();
      } else if (trimmed.includes('개수') || trimmed.includes('수량')) {
        const match = trimmed.match(/(?:개수|수량)\s*[:：]\s*(\d+)/);
        if (match) parsed.quantity = parseInt(match[1]);
      } else if (trimmed.includes('수령자') || trimmed.includes('받는사람')) {
        const match = trimmed.match(/(?:수령자|받는사람)\s*[:：]\s*(.+)/);
        if (match) parsed.receiver = match[1].trim();
      }
    });
    
    res.json({ success: true, parsed });
  } catch (error) {
    res.status(400).json({ error: '메시지 파싱 중 오류가 발생했습니다.' });
  }
});

// 통계 API
app.get('/api/statistics', (req, res) => {
  const monthlyStats = {};
  const supplierStats = {};
  
  // 월별 통계
  inventoryData.forEach(item => {
    if (item.requestDate) {
      const month = moment(item.requestDate).format('YYYY-MM');
      if (!monthlyStats[month]) {
        monthlyStats[month] = { count: 0, value: 0 };
      }
      monthlyStats[month].count++;
      monthlyStats[month].value += item.totalPrice || 0;
    }
  });
  
  // 공급업체별 통계
  inventoryData.forEach(item => {
    if (item.supplier) {
      if (!supplierStats[item.supplier]) {
        supplierStats[item.supplier] = { count: 0, value: 0 };
      }
      supplierStats[item.supplier].count++;
      supplierStats[item.supplier].value += item.totalPrice || 0;
    }
  });
  
  res.json({
    monthly: monthlyStats,
    suppliers: supplierStats,
    totalValue: inventoryData.reduce((sum, item) => sum + (item.totalPrice || 0), 0),
    averageValue: inventoryData.length > 0 ? 
      inventoryData.reduce((sum, item) => sum + (item.totalPrice || 0), 0) / inventoryData.length : 0
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`=== 종합 ERP 관리 시스템 ===`);
  console.log(`포트: ${PORT}`);
  console.log(`웹 인터페이스: http://localhost:${PORT}`);
  console.log(`품목 수: ${inventoryData.length}`);
  console.log(`구매요청: ${purchaseRequests.length}`);
  console.log(`수령내역: ${receiptHistory.length}`);
  console.log('==========================');
  
  addLog('System Start', '서버 시작');
});