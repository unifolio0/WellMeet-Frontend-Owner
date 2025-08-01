import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { BookingManagement } from './components/BookingManagement';
import { RestaurantManagement } from './components/RestaurantManagement';
import { CustomerManagement } from './components/CustomerManagement';
import { ReviewManagement } from './components/ReviewManagement';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { NotificationCenter } from './components/NotificationCenter';
import { ProfileSettings } from './components/ProfileSettings';
import { AccountSettings } from './components/AccountSettings';

type Page = 'dashboard' | 'bookings' | 'restaurant' | 'customers' | 'reviews' | 'analytics' | 'settings' | 'notifications' | 'profile' | 'account';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    if (['dashboard', 'bookings', 'restaurant', 'customers', 'reviews', 'analytics', 'settings', 'notifications', 'profile', 'account'].includes(path)) {
      setCurrentPage(path as Page);
    }
  }, [location]);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    navigate(`/${page}`);
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      // TODO: API 호출하여 로그아웃 처리
      // localStorage.removeItem('token');
      // navigate('/login');
      alert('로그아웃되었습니다.');
    }
  };


  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          unreadNotifications={unreadNotifications}
          onNotificationClick={() => handlePageChange('notifications')}
          onProfileClick={() => handlePageChange('profile')}
          onAccountClick={() => handlePageChange('account')}
          onLogout={handleLogout}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/bookings" element={<BookingManagement />} />
            <Route path="/restaurant" element={<RestaurantManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/reviews" element={<ReviewManagement />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<NotificationCenter onNotificationsRead={() => setUnreadNotifications(0)} />} />
            <Route path="/profile" element={<ProfileSettings />} />
            <Route path="/account" element={<AccountSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}