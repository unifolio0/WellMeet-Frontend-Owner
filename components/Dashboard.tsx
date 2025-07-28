import { Calendar, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockTimeData = [
  { time: '12:00', reservations: 2 },
  { time: '13:00', reservations: 4 },
  { time: '14:00', reservations: 3 },
  { time: '15:00', reservations: 1 },
  { time: '16:00', reservations: 0 },
  { time: '17:00', reservations: 2 },
  { time: '18:00', reservations: 8 },
  { time: '19:00', reservations: 12 },
  { time: '20:00', reservations: 10 },
  { time: '21:00', reservations: 6 },
  { time: '22:00', reservations: 3 },
];

const mockRecentBookings = [
  { id: 1, customer: '김민수', time: '19:00', party: 2, status: 'confirmed', special: '창가 자리 요청' },
  { id: 2, customer: '이지은', time: '20:30', party: 4, status: 'pending', special: '생일 케이크' },
  { id: 3, customer: '박부장', time: '18:30', party: 6, status: 'confirmed', special: '' },
  { id: 4, customer: '정수영', time: '19:30', party:3, status: 'pending', special: '유아차 필요' },
];

const kpiCards = [
  {
    title: '오늘 예약',
    value: '12건',
    change: '+2건',
    changeType: 'increase',
    icon: Calendar,
    color: 'bg-blue-500'
  },
  {
    title: '확정 예약',
    value: '8건',
    change: '67%',
    changeType: 'increase',
    icon: CheckCircle,
    color: 'bg-green-500'
  },
  {
    title: '대기 중',
    value: '3건',
    change: '-1건',
    changeType: 'decrease',
    icon: Clock,
    color: 'bg-yellow-500'
  },
  {
    title: '예상 매출',
    value: '850,000원',
    change: '+15%',
    changeType: 'increase',
    icon: TrendingUp,
    color: 'bg-purple-500'
  }
];

export function Dashboard() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">확정</span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">대기</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">취소</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <p className="text-gray-600">라비올로 레스토랑 운영 현황</p>
      </div>

      {/* KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                  <p className={`text-sm mt-1 ${
                    card.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {card.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${card.color}`}>
                  <IconComponent size={24} className="text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 시간대별 예약 현황 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">시간대별 예약 현황</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reservations" fill="#3182CE" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 예약 통계 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">오늘 통계</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">승인률</span>
              <span className="font-semibold text-green-600">85%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">노쇼율</span>
              <span className="font-semibold text-red-600">3%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: '3%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">평균 파티 크기</span>
              <span className="font-semibold text-blue-600">3.2명</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-600">평균 평점</span>
              <div className="flex items-center space-x-1">
                <Star size={16} className="text-yellow-400 fill-current" />
                <span className="font-semibold text-yellow-600">4.6</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 최근 예약 목록 */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">최근 예약</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">인원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">특별 요청</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockRecentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customer}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.party}명</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {booking.special || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">상세</button>
                    {booking.status === 'pending' && (
                      <>
                        <button className="text-green-600 hover:text-green-900 mr-3">승인</button>
                        <button className="text-red-600 hover:text-red-900">거부</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}