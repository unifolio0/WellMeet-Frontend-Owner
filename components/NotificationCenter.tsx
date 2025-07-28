import { useState } from 'react';
import { Bell, Calendar, Star, AlertCircle, Settings, Check, Trash2, Search } from 'lucide-react';

interface NotificationCenterProps {
  onNotificationsRead: () => void;
}

const mockNotifications = [
  {
    id: 1,
    type: 'booking',
    title: '새로운 예약 요청',
    message: '김민수님이 01-20 19:00에 2명으로 예약을 요청했습니다.',
    time: '5분 전',
    read: false,
    icon: Calendar,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  {
    id: 2,
    type: 'review',
    title: '새로운 리뷰',
    message: '이지은님이 ⭐⭐⭐⭐⭐ 리뷰를 남겼습니다: "정말 맛있었어요!"',
    time: '1시간 전',
    read: false,
    icon: Star,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100'
  },
  {
    id: 3,
    type: 'booking',
    title: '예약 취소',
    message: '박부장님이 01-20 18:30 예약을 취소했습니다.',
    time: '2시간 전',
    read: true,
    icon: Calendar,
    color: 'text-red-600',
    bgColor: 'bg-red-100'
  },
  {
    id: 4,
    type: 'system',
    title: '시스템 알림',
    message: '월간 매출 리포트가 준비되었습니다.',
    time: '1일 전',
    read: true,
    icon: AlertCircle,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  {
    id: 5,
    type: 'booking',
    title: '예약 확정',
    message: '최고객님의 예약이 자동으로 확정되었습니다.',
    time: '2일 전',
    read: true,
    icon: Calendar,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  }
];

const notificationSettings = {
  booking: { email: true, sms: false, kakao: true },
  review: { email: true, sms: false, kakao: true },
  system: { email: true, sms: false, kakao: false }
};

export function NotificationCenter({ onNotificationsRead }: NotificationCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showSettings, setShowSettings] = useState(false);

  const filterOptions = [
    { id: 'all', label: '전체', count: notifications.length },
    { id: 'unread', label: '미읽음', count: notifications.filter(n => !n.read).length },
    { id: 'booking', label: '예약', count: notifications.filter(n => n.type === 'booking').length },
    { id: 'review', label: '리뷰', count: notifications.filter(n => n.type === 'review').length },
    { id: 'system', label: '시스템', count: notifications.filter(n => n.type === 'system').length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || 
                          selectedFilter === notification.type ||
                          (selectedFilter === 'unread' && !notification.read);
    
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    onNotificationsRead();
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'booking': return '예약';
      case 'review': return '리뷰';
      case 'system': return '시스템';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">알림 센터</h1>
          <p className="text-gray-600">새로운 알림과 중요한 업데이트를 확인하세요</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleMarkAllAsRead}
            className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            모두 읽음 처리
          </button>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <Settings size={16} />
            <span>알림 설정</span>
          </button>
        </div>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedFilter(option.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                  selectedFilter === option.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{option.label}</span>
                {option.count > 0 && (
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedFilter === option.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {option.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="알림 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* 알림 설정 패널 */}
      {showSettings && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">알림 설정</h3>
          <div className="space-y-4">
            {Object.entries(notificationSettings).map(([type, settings]) => (
              <div key={type} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                <div>
                  <h4 className="font-medium text-gray-900">{getTypeLabel(type)} 알림</h4>
                  <p className="text-sm text-gray-500">
                    {type === 'booking' && '새 예약, 예약 변경, 취소 알림'}
                    {type === 'review' && '새 리뷰, 평점 변경 알림'}
                    {type === 'system' && '시스템 업데이트, 보고서 알림'}
                  </p>
                </div>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={settings.email}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">이메일</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={settings.sms}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">SMS</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      defaultChecked={settings.kakao}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-600">카카오톡</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              설정 저장
            </button>
          </div>
        </div>
      )}

      {/* 알림 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const Icon = notification.icon;
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${notification.bgColor}`}>
                      <Icon size={20} className={notification.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                            {!notification.read && (
                              <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                            )}
                          </h4>
                          <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          <p className="mt-2 text-xs text-gray-500">{notification.time}</p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="읽음 처리"
                            >
                              <Check size={16} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="삭제"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">알림이 없습니다</h3>
            <p className="text-gray-500">
              {selectedFilter === 'unread' 
                ? '읽지 않은 알림이 없습니다' 
                : '조건에 맞는 알림이 없습니다'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}