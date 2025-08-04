import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Star, Clock, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dashboardService } from '@lib/api/services';
import type { TodayStats, RecentBooking, TimeSlot } from '@lib/api/services';

export function Dashboard() {
  const [todayStats, setTodayStats] = useState<TodayStats | null>(null);
  const [recentBookings, setRecentBookings] = useState<RecentBooking[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [, setKpiData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const today = new Date().toISOString().split('T')[0];
        
        const [statsData, bookingsData, timeSlotsData, kpiData] = await Promise.all([
          dashboardService.getTodayStats(),
          dashboardService.getRecentBookings({ limit: 10 }),
          dashboardService.getTimeSlots({ date: today }),
          dashboardService.getKpi()
        ]);

        setTodayStats(statsData);
        setRecentBookings(bookingsData);
        setTimeSlots(timeSlotsData);
        setKpiData(kpiData);
      } catch (err) {
        console.error('Dashboard data fetch error:', err);
        setError('데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const kpiCards = [
    {
      title: '오늘 예약',
      value: todayStats ? `${todayStats.todayBookings}건` : '로딩...',
      change: '-',
      changeType: 'neutral',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: '확정 예약',
      value: todayStats ? `${todayStats.confirmedBookings}건` : '로딩...',
      change: '-',
      changeType: 'neutral',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: '대기 중',
      value: todayStats ? `${todayStats.pendingBookings}건` : '로딩...',
      change: '-',
      changeType: 'neutral',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: '예상 매출',
      value: todayStats ? `${todayStats.expectedRevenue.toLocaleString()}원` : '로딩...',
      change: '-',
      changeType: 'neutral',
      icon: TrendingUp,
      color: 'bg-purple-500'
    }
  ];

  const timeData = timeSlots.map(slot => ({
    time: slot.time,
    reservations: slot.reservations
  }));

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">라비올로 레스토랑 운영 현황</p>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
          <p className="text-gray-600">라비올로 레스토랑 운영 현황</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-red-600 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }
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
              <BarChart data={timeData}>
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
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{booking.customer.name}</div>
                    {booking.customer.isVip && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                        VIP
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(booking.time).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
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
          {recentBookings.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">오늘 예약이 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}