
import { useState, useEffect } from 'react';
import { settingsService } from '@lib/api/services';
import type { BookingPolicy } from '@lib/api/services';

export function BookingPolicySettings() {
  const [policy, setPolicy] = useState<BookingPolicy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPolicy();
  }, []);

  const fetchPolicy = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getBookingPolicy();
      setPolicy(response.policy);
    } catch (err) {
      console.error('Booking policy fetch error:', err);
      setError('예약 정책을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!policy) return;
    
    try {
      setSaving(true);
      await settingsService.updateBookingPolicy(policy);
      // 성공 알림 등 추가 가능
    } catch (err) {
      console.error('Update policy error:', err);
      setError('설정 저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const updatePolicy = (updates: Partial<BookingPolicy>) => {
    if (policy) {
      setPolicy({ ...policy, ...updates });
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
          onClick={() => fetchPolicy()} 
          className="mt-2 text-red-600 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3>예약 정책 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2">최소 사전 예약 시간</label>
          <select 
            value={policy?.cancellationHours || 2}
            onChange={(e) => updatePolicy({ cancellationHours: parseInt(e.target.value) })}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="1">1시간 전</option>
            <option value="2">2시간 전</option>
            <option value="4">4시간 전</option>
            <option value="24">1일 전</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">최대 사전 예약 기간</label>
          <select 
            value={policy?.advanceBookingDays || 30}
            onChange={(e) => updatePolicy({ advanceBookingDays: parseInt(e.target.value) })}
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7">7일 전</option>
            <option value="14">14일 전</option>
            <option value="30">30일 전</option>
            <option value="60">60일 전</option>
          </select>
        </div>

        <div>
          <label className="block mb-2">최소 파티 사이즈</label>
          <input 
            type="number" 
            value={policy?.minPartySize || 1}
            onChange={(e) => updatePolicy({ minPartySize: parseInt(e.target.value) })}
            min="1"
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2">최대 파티 사이즈</label>
          <input 
            type="number" 
            value={policy?.maxPartySize || 10}
            onChange={(e) => updatePolicy({ maxPartySize: parseInt(e.target.value) })}
            min="1"
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="mb-4">자동 승인 설정</h4>
        <div className="space-y-3">
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              defaultChecked
              className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            <span className="ml-2">VIP 고객 자동 승인</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            <span className="ml-2">3회 이상 방문 고객 자동 승인</span>
          </label>
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            <span className="ml-2">모든 예약 수동 승인</span>
          </label>
        </div>
      </div>

      <div className="border-t pt-6">
        <h4 className="mb-4">예약금 설정</h4>
        <div className="space-y-4">
          <label className="inline-flex items-center">
            <input 
              type="checkbox" 
              checked={policy?.depositRequired || false}
              onChange={(e) => updatePolicy({ depositRequired: e.target.checked })}
              className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            <span className="ml-2">예약금 징수 활성화</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">예약금 금액</label>
              <input 
                type="number" 
                value={policy?.depositAmount || 10000}
                onChange={(e) => updatePolicy({ depositAmount: parseInt(e.target.value) })}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2">노쇼 패널티</label>
              <input 
                type="number" 
                value={policy?.noShowPenalty || 20000}
                onChange={(e) => updatePolicy({ noShowPenalty: parseInt(e.target.value) })}
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
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