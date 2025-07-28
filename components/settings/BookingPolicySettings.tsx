
export function BookingPolicySettings() {
  return (
    <div className="space-y-6">
      <h3>예약 정책 설정</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2">최소 사전 예약 시간</label>
          <select 
            defaultValue="2"
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
            defaultValue="30"
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
            defaultValue="1"
            min="1"
            className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2">최대 파티 사이즈</label>
          <input 
            type="number" 
            defaultValue="10"
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
              className="rounded border-border text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
            />
            <span className="ml-2">예약금 징수 활성화</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">예약금 금액</label>
              <input 
                type="number" 
                defaultValue="10000"
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block mb-2">노쇼 패널티</label>
              <input 
                type="number" 
                defaultValue="20000"
                className="w-full p-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}