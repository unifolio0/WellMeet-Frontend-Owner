import React from 'react';

const notificationCategories = [
  { type: '예약 관련', items: ['새 예약 요청', '예약 취소', '예약 변경'] },
  { type: '리뷰 관련', items: ['새 리뷰 작성', '평점 변경'] },
  { type: '시스템', items: ['매출 리포트', '시스템 업데이트', '보안 알림'] }
];

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h3>알림 설정</h3>
      
      <div className="space-y-6">
        {notificationCategories.map((category) => (
          <div key={category.type} className="border border-border rounded-lg p-6">
            <h4 className="mb-4">{category.type}</h4>
            <div className="space-y-3">
              {category.items.map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <span>{item}</span>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked
                        className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">이메일</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">SMS</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked
                        className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">카카오톡</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}