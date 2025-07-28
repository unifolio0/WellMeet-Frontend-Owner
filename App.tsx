import { useState } from 'react';
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

type Page = 'dashboard' | 'bookings' | 'restaurant' | 'customers' | 'reviews' | 'analytics' | 'settings' | 'notifications';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'bookings':
        return <BookingManagement />;
      case 'restaurant':
        return <RestaurantManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'notifications':
        return <NotificationCenter onNotificationsRead={() => setUnreadNotifications(0)} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          unreadNotifications={unreadNotifications}
          onNotificationClick={() => setCurrentPage('notifications')}
          sidebarCollapsed={sidebarCollapsed}
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}