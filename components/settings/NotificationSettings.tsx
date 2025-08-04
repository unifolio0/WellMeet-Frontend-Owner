
import { useState, useEffect } from 'react';
import { notificationsService } from '@lib/api/services';
import type { NotificationSettings as NotificationSettingsType } from '@lib/api/services';

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await notificationsService.getSettings();
      setSettings(response.settings);
    } catch (err) {
      console.error('Notification settings fetch error:', err);
      setError('알림 설정을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;
    
    try {
      setSaving(true);
      await notificationsService.updateSettings(settings);
    } catch (err) {
      console.error('Update settings error:', err);
      setError('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">설정을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-800">{error}</div>
        <button 
          onClick={() => fetchSettings()} 
          className="mt-2 text-red-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3>알림 설정</h3>
      
      <div className="space-y-6">
        <div className="border border-border rounded-lg p-6">
          <h4 className="mb-4">예약 관련 알림</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>새 예약 요청</span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={false}
                    onChange={() => {}}
                    className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">이메일</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={false}
                    onChange={() => {}}
                    className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">SMS</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={false}
                    onChange={() => {}}
                    className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">푸시</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h4 className="mb-4">리뷰 관련 알림</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>새 리뷰 작성</span>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={false}
                    onChange={() => {}}
                    className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">이메일</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={false}
                    onChange={() => {}}
                    className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">SMS</span>
                </label>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    checked={false}
                    onChange={() => {}}
                    className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-muted-foreground">푸시</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : '설정 저장'}
        </button>
      </div>
    </div>
  );
}