// client/src/App.tsx (수정된 버전)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles, theme } from './styles/theme';

// Components
import Layout from './components/common/Layout';
import DashboardPage from './components/dashboard/DashboardPage';
import InventoryPage from './components/inventory/InventoryPage';
import ReceiptPage from './components/receipt/ReceiptPage';
import PurchaseRequestPage from './components/purchase/PurchaseRequestPage';
import KakaoPage from './components/kakao/KakaoPage';
import UploadPage from './components/upload/UploadPage';
import StatisticsPage from './components/statistics/StatisticsPage';
import LogsPage from './components/logs/LogsPage';

// Styles
import 'react-toastify/dist/ReactToastify.css';

// React Query 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="inventory" element={<InventoryPage />} />
                <Route path="receipts" element={<ReceiptPage />} />
                <Route path="purchase-requests" element={<PurchaseRequestPage />} />
                <Route path="kakao" element={<KakaoPage />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="logs" element={<LogsPage />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
            
            {/* Toast 알림 */}
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
          </div>
        </Router>
        
        {/* React Query DevTools (개발 환경에서만) */}
        {import.meta.env.DEV && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;