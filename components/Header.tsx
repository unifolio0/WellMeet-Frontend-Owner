import { useState, useEffect } from 'react';
import { Bell, Menu, User, LogOut, Settings } from 'lucide-react';

interface HeaderProps {
  unreadNotifications: number;
  onNotificationClick: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}

export function Header({ unreadNotifications, onNotificationClick, onToggleSidebar }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">식당 관리 시스템</h2>
            <p className="text-sm text-gray-500">{formatTime(currentTime)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* 알림 버튼 */}
          <button
            onClick={onNotificationClick}
            className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Bell size={20} className="text-gray-600" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadNotifications}
              </span>
            )}
          </button>

          {/* 프로필 메뉴 */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">최사장님</p>
                <p className="text-xs text-gray-500">라비올로 레스토랑</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <User size={16} />
                  <span>프로필 설정</span>
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                  <Settings size={16} />
                  <span>계정 설정</span>
                </button>
                <hr className="my-1" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2">
                  <LogOut size={16} />
                  <span>로그아웃</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}