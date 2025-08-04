
import { useState, useEffect } from 'react';
import { accountService, settingsService } from '@lib/api/services';
import type { TwoFactorSettings, AccessLog } from '@lib/api/services';

export function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [twoFactorSettings, setTwoFactorSettings] = useState<TwoFactorSettings | null>(null);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      const logsResponse = await settingsService.getAccessLogs({ page: 1, limit: 5 });
      setAccessLogs(logsResponse.logs);
      // Mock two factor settings since getTwoFactorSettings doesn't exist
      setTwoFactorSettings({ twoFactorEnabled: false });
    } catch (err) {
      console.error('Security data fetch error:', err);
      setError('보안 설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwords.new !== passwords.confirm) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setSaving(true);
      await accountService.changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setPasswords({ current: '', new: '', confirm: '' });
      alert('비밀번호가 성공적으로 변경되었습니다.');
    } catch (err) {
      console.error('Password change error:', err);
      setError('비밀번호 변경에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const handleTwoFactorToggle = async (enabled: boolean) => {
    try {
      await accountService.updateTwoFactor({ enabled });
      setTwoFactorSettings(prev => prev ? { ...prev, enabled } : null);
    } catch (err) {
      console.error('Two factor update error:', err);
      setError('2단계 인증 설정 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">보안 설정을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={() => fetchSecurityData()} 
          className="mt-2 text-red-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      <h3>보안 설정</h3>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6">
          <h4 className="mb-4">계정 보안</h4>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">현재 비밀번호</label>
              <input 
                type="password" 
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2">새 비밀번호</label>
              <input 
                type="password" 
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2">새 비밀번호 확인</label>
              <input 
                type="password" 
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button 
              onClick={handlePasswordChange}
              disabled={saving || !passwords.current || !passwords.new || !passwords.confirm}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '변경 중...' : '비밀번호 변경'}
            </button>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h4 className="mb-4">2단계 인증</h4>
          <div className="flex items-center justify-between">
            <div>
              <p>추가 보안을 위한 2단계 인증을 활성화하세요</p>
              <p className="text-sm text-muted-foreground mt-1">로그인 시 SMS 또는 앱을 통한 인증이 필요합니다</p>
            </div>
            <label className="inline-flex items-center">
              <input 
                type="checkbox" 
                checked={twoFactorSettings?.twoFactorEnabled || false}
                onChange={(e) => handleTwoFactorToggle(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              <span className="ml-2">활성화</span>
            </label>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h4 className="mb-4">접근 로그</h4>
          <div className="space-y-3">
            {accessLogs.map((log, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>{new Date(log.timestamp).toLocaleString('ko-KR')} - {log.ipAddress} ({log.action})</span>
                <span className="text-sm text-green-600">
                  성공
                </span>
              </div>
            ))}
          </div>
          <button 
            onClick={() => window.open('/settings/access-logs', '_blank')}
            className="mt-4 text-blue-600 hover:underline"
          >
            전체 로그 보기
          </button>
        </div>
      </div>
    </div>
  );
}