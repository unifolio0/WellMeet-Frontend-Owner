import { useState } from 'react';
import { Clock, Bell, Link, Shield } from 'lucide-react';
import { BookingPolicySettings } from './settings/BookingPolicySettings';
import { NotificationSettings } from './settings/NotificationSettings';
import { IntegrationSettings } from './settings/IntegrationSettings';
import { SecuritySettings } from './settings/SecuritySettings';

const tabs = [
  { id: 'booking', label: '예약 정책', icon: Clock },
  { id: 'notifications', label: '알림 설정', icon: Bell },
  { id: 'integrations', label: '외부 연동', icon: Link },
  { id: 'security', label: '보안 설정', icon: Shield },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('booking');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'booking':
        return <BookingPolicySettings />;
      case 'notifications':
        return <NotificationSettings />;
      case 'integrations':
        return <IntegrationSettings />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <BookingPolicySettings />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1>시스템 설정</h1>
        <p className="text-muted-foreground">매장 운영에 필요한 각종 설정을 관리하세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-card rounded-lg shadow p-6">
        {renderTabContent()}
      </div>

      {/* 저장 버튼 */}
      <div className="flex justify-end">
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          설정 저장
        </button>
      </div>
    </div>
  );
}