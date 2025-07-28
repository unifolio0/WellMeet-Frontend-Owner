import React from 'react';

export function SecuritySettings() {
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
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2">새 비밀번호</label>
              <input 
                type="password" 
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2">새 비밀번호 확인</label>
              <input 
                type="password" 
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              비밀번호 변경
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
                className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
              />
              <span className="ml-2">활성화</span>
            </label>
          </div>
        </div>

        <div className="border border-border rounded-lg p-6">
          <h4 className="mb-4">접근 로그</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span>2024-01-15 14:30 - 서울 (Chrome)</span>
              <span className="text-sm text-green-600">현재 세션</span>
            </div>
            <div className="flex justify-between items-center">
              <span>2024-01-15 09:15 - 서울 (Safari)</span>
              <span className="text-sm text-muted-foreground">성공</span>
            </div>
            <div className="flex justify-between items-center">
              <span>2024-01-14 18:45 - 서울 (Chrome)</span>
              <span className="text-sm text-muted-foreground">성공</span>
            </div>
          </div>
          <button className="mt-4 text-primary hover:underline">
            전체 로그 보기
          </button>
        </div>
      </div>
    </div>
  );
}