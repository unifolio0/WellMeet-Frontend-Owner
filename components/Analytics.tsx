import React, { useState } from 'react';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const mockWeeklyData = [
  { day: '월', reservations: 15, revenue: 450000 },
  { day: '화', reservations: 18, revenue: 520000 },
  { day: '수', reservations: 12, revenue: 380000 },
  { day: '목', reservations: 22, revenue: 680000 },
  { day: '금', reservations: 28, revenue: 850000 },
  { day: '토', reservations: 32, revenue: 950000 },
  { day: '일', reservations: 20, revenue: 600000 },
];

const mockCustomerTypes = [
  { name: '신규 고객', value: 35, color: '#3182CE' },
  { name: '재방문 고객', value: 45, color: '#38A169' },
  { name: 'VIP 고객', value: 20, color: '#D69E2E' },
];

const mockTimeSlots = [
  { time: '12:00', bookings: 8 },
  { time: '13:00', bookings: 12 },
  { time: '14:00', bookings: 6 },
  { time: '17:00', bookings: 4 },
  { time: '18:00', bookings: 15 },
  { time: '19:00', bookings: 25 },
  { time: '20:00', bookings: 22 },
  { time: '21:00', bookings: 18 },
];

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const totalReservations = mockWeeklyData.reduce((sum, data) => sum + data.reservations, 0);
  const totalRevenue = mockWeeklyData.reduce((sum, data) => sum + data.revenue, 0);
  const averagePartySize = 3.2;
  const satisfactionScore = 4.6;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">통계 분석</h1>
        <p className="text-gray-600">매장 운영 데이터를 분석하고 인사이트를 얻으세요</p>
      </div>

      {/* 기간 선택 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex space-x-2">
          {['week', 'month', 'quarter'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period === 'week' && '최근 7일'}
              {period === 'month' && '최근 30일'}
              {period === 'quarter' && '분기별'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 예약 수</p>
              <p className="text-2xl font-bold text-gray-900">{totalReservations}건</p>
              <p className="text-sm text-green-600">+12% 전주 대비</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">총 매출</p>
              <p className="text-2xl font-bold text-gray-900">{totalRevenue.toLocaleString()}원</p>
              <p className="text-sm text-green-600">+8% 전주 대비</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">평균 파티 크기</p>
              <p className="text-2xl font-bold text-gray-900">{averagePartySize}명</p>
              <p className="text-sm text-gray-600">전주와 동일</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">고객 만족도</p>
              <p className="text-2xl font-bold text-gray-900">{satisfactionScore}/5.0</p>
              <p className="text-sm text-green-600">+0.2 전주 대비</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <TrendingUp size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 요일별 예약 현황 */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">요일별 예약 현황</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [value + '건', '예약 수']} />
                <Bar dataKey="reservations" fill="#3182CE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 고객 유형 분포 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">고객 유형 분포</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCustomerTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {mockCustomerTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value + '%', '비율']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 시간대별 예약 분포 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">시간대별 예약 분포</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTimeSlots}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [value + '건', '예약 수']} />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#3182CE" 
                  strokeWidth={3}
                  dot={{ fill: '#3182CE', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 매출 추이 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">매출 추이</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockWeeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis tickFormatter={(value) => `${Math.round(value / 10000)}만`} />
                <Tooltip formatter={(value) => [value.toLocaleString() + '원', '매출']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#38A169" 
                  strokeWidth={3}
                  dot={{ fill: '#38A169', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 인사이트 카드 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 이번 주 인사이트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">🚀 성장 포인트</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 금요일 저녁 예약이 28% 증가했습니다</li>
              <li>• VIP 고객 재방문율이 15% 상승했습니다</li>
              <li>• 고객 만족도가 전주 대비 0.2점 향상되었습니다</li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">💡 개선 제안</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• 화요일 점심시간 프로모션을 고려해보세요</li>
              <li>• 19-20시 대기시간 단축 방안이 필요합니다</li>
              <li>• 신규 고객 대상 리워드 프로그램을 추천합니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}