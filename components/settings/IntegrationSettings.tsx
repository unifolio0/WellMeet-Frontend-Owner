
import { useState, useEffect } from 'react';
import { settingsService } from '@lib/api/services';
import type { Integration } from '@lib/api/services';


export function IntegrationSettings() {
  const [integrations, setIntegrations] = useState<Integration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getIntegrations();
      setIntegrations(response.integrations);
    } catch (err) {
      console.error('Integrations fetch error:', err);
      setError('연동 설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (service: string) => {
    try {
      await settingsService.connectIntegration(service, { provider: service });
      fetchIntegrations(); // 새로고침
    } catch (err) {
      console.error('Integration connect error:', err);
      setError('연동 연결에 실패했습니다.');
    }
  };

  const handleDisconnect = async (service: string) => {
    try {
      await settingsService.disconnectIntegration(service);
      fetchIntegrations(); // 새로고침
    } catch (err) {
      console.error('Integration disconnect error:', err);
      setError('연동 연결 해제에 실패했습니다.');
    }
  };

  const handleTest = async (service: string) => {
    try {
      const response = await settingsService.testIntegration(service);
      alert('테스트 성공: ' + response.message);
    } catch (err) {
      console.error('Integration test error:', err);
      alert('테스트 실패');
    }
  };

  const integrationServices = [
    { key: 'pos', name: 'POS 시스템' },
    { key: 'payment', name: '결제 게이트웨이' },
    { key: 'delivery', name: '배달 서비스' },
    { key: 'marketing', name: '마케팅 플랫폼' },
    { key: 'accounting', name: '회계 시스템' }
  ];

  if (loading) {
    return <div className="text-center py-8">연동 설정을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={() => fetchIntegrations()} 
          className="mt-2 text-red-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3>외부 서비스 연동</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationServices.map((service) => {
          const serviceData = integrations?.[service.key as keyof Integration] as any;
          const isConnected = serviceData?.connected || false;
          
          return (
            <div key={service.key} className="border border-gray-300 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h4>{service.name}</h4>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {isConnected ? '연결됨' : '미연결'}
                </span>
              </div>
              <div className="space-y-2">
                <button 
                  onClick={() => isConnected ? handleDisconnect(service.key) : handleConnect(service.key)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {isConnected ? '연결 해제' : '연결하기'}
                </button>
                {isConnected && (
                  <button 
                    onClick={() => handleTest(service.key)}
                    className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    테스트
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}