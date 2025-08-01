import { useState } from 'react';
import { Lock, Shield, Key, AlertTriangle, Check, Eye, EyeOff } from 'lucide-react';

export function AccountSettings() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    // TODO: API 호출하여 비밀번호 변경
    alert('비밀번호가 변경되었습니다.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    // TODO: API 호출하여 2단계 인증 설정
  };

  const handleAccountDelete = () => {
    // TODO: API 호출하여 계정 삭제
    alert('계정 삭제 요청이 처리되었습니다.');
    setShowDeleteConfirm(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">계정 설정</h1>
        <p className="text-gray-600">보안 설정과 계정 관리를 할 수 있습니다</p>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Lock size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">비밀번호 변경</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              현재 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">8자 이상, 영문, 숫자, 특수문자 조합</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              새 비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            onClick={handlePasswordChange}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            비밀번호 변경
          </button>
        </div>
      </div>

      {/* 2단계 인증 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield size={20} className="text-gray-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">2단계 인증</h3>
              <p className="text-sm text-gray-600">계정 보안을 강화하세요</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={handleTwoFactorToggle}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Check size={16} className="text-green-600" />
              <span className="text-sm text-green-800">2단계 인증이 활성화되었습니다</span>
            </div>
          </div>
        )}
      </div>

      {/* 로그인 활동 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Key size={20} className="text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">최근 로그인 활동</h3>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">현재 세션</p>
              <p className="text-xs text-gray-500">Chrome - 서울, 대한민국</p>
            </div>
            <span className="text-xs text-green-600 font-medium">활성</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <div>
              <p className="text-sm font-medium text-gray-900">2024.01.14 09:30</p>
              <p className="text-xs text-gray-500">Safari - 서울, 대한민국</p>
            </div>
            <span className="text-xs text-gray-500">종료됨</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">2024.01.13 18:45</p>
              <p className="text-xs text-gray-500">Chrome - 서울, 대한민국</p>
            </div>
            <span className="text-xs text-gray-500">종료됨</span>
          </div>
        </div>

        <button className="mt-4 text-sm text-blue-600 hover:text-blue-800">
          모든 다른 세션 종료
        </button>
      </div>

      {/* 계정 삭제 */}
      <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
        <div className="flex items-center space-x-2 mb-4">
          <AlertTriangle size={20} className="text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">위험 구역</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
        </p>

        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          계정 삭제
        </button>

        {/* 삭제 확인 모달 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center space-x-2 mb-4">
                <AlertTriangle size={24} className="text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">계정 삭제 확인</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAccountDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}