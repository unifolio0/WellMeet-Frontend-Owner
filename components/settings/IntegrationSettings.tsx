import React from 'react';

const integrations = [
  { name: '이메일 (Gmail)', status: 'connected', color: 'green' },
  { name: 'SMS (알리고)', status: 'setup_needed', color: 'yellow' },
  { name: '카카오 알림톡', status: 'disconnected', color: 'red' },
  { name: 'POS 시스템', status: 'partial', color: 'yellow' },
  { name: '결제 게이트웨이', status: 'disconnected', color: 'red' },
  { name: '지도 API', status: 'connected', color: 'green' }
];

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'connected': return '연결됨';
    case 'setup_needed': return '설정 필요';
    case 'partial': return '부분 연결';
    case 'disconnected': return '미연결';
    default: return status;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'connected': return 'bg-green-100 text-green-800';
    case 'setup_needed': return 'bg-yellow-100 text-yellow-800';
    case 'partial': return 'bg-yellow-100 text-yellow-800';
    case 'disconnected': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <h3>외부 서비스 연동</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <div key={integration.name} className="border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h4>{integration.name}</h4>
              <span className={`px-3 py-1 rounded-full text-xs ${getStatusClass(integration.status)}`}>
                {getStatusLabel(integration.status)}
              </span>
            </div>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {integration.status === 'connected' ? '설정 관리' : '연결하기'}
              </button>
              {integration.status === 'connected' && (
                <button className="w-full px-4 py-2 text-primary border border-primary rounded-lg hover:bg-accent transition-colors">
                  테스트
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}