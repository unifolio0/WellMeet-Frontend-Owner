import { useState } from 'react';
import { Calendar, TrendingUp, Users, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const weeklyData: { day: string; reservations: number; revenue: number }[] = [];

const customerTypes: { name: string; value: number; color: string }[] = [];

const timeSlots: { time: string; bookings: number }[] = [];

export function Analytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const totalReservations = weeklyData.reduce((sum, data) => sum + data.reservations, 0);
  const totalRevenue = weeklyData.reduce((sum, data) => sum + data.revenue, 0);
  const averagePartySize = 0;
  const satisfactionScore = 0;

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
              <BarChart data={weeklyData}>
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
                  data={customerTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {customerTypes.map((entry, index) => (
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
              <LineChart data={timeSlots}>
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
              <LineChart data={weeklyData}>
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

      {/* 데이터 없음 안내 */}
      {weeklyData.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-12 text-center">
          <p className="text-gray-500">아직 표시할 데이터가 없습니다.</p>
        </div>
      )}
    </div>
  );
}