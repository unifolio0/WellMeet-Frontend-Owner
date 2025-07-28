import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Store, 
  Users, 
  Star, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: '대시보드' },
  { id: 'bookings', icon: Calendar, label: '예약 관리', badge: 5 },
  { id: 'restaurant', icon: Store, label: '매장 관리' },
  { id: 'customers', icon: Users, label: '고객 관리' },
  { id: 'reviews', icon: Star, label: '리뷰 관리', badge: 2 },
  { id: 'analytics', icon: BarChart3, label: '통계 분석' },
  { id: 'settings', icon: Settings, label: '시스템 설정' },
];

export function Sidebar({ currentPage, onPageChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`bg-slate-800 text-white transition-all duration-300 flex flex-col ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!collapsed && (
          <div>
            <h1 className="text-xl font-bold text-blue-400">WellMeet</h1>
            <p className="text-sm text-slate-400">식당 관리자</p>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded hover:bg-slate-700 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-4 py-3 text-left transition-colors relative ${
                    isActive 
                      ? 'bg-blue-600 text-white border-r-2 border-blue-400' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="ml-3 flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {collapsed && item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1 min-w-[16px] h-4 text-center leading-4">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400">
            <p>라비올로 레스토랑</p>
            <p>최사장님</p>
          </div>
        </div>
      )}
    </div>
  );
}