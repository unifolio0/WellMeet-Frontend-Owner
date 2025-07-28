import React, { useState } from 'react';
import { Search, Filter, Calendar, Clock, Users, Phone, Mail, MapPin, MessageSquare } from 'lucide-react';

const mockBookings = [
  {
    id: 'BK-240115-001',
    customer: '김민수',
    phone: '010-1234-5678',
    email: 'minsu@email.com',
    date: '2024-01-15',
    time: '19:00',
    party: 2,
    table: 'T3',
    status: 'pending',
    special: '창가 자리 요청합니다.',
    note: '단골 고객',
    isVip: false
  },
  {
    id: 'BK-240115-002',
    customer: '이지은',
    phone: '010-5678-9012',
    email: 'jieun@email.com',
    date: '2024-01-15',
    time: '20:30',
    party: 4,
    table: 'T5',
    status: 'confirmed',
    special: '생일 케이크 서프라이즈 도움 주세요',
    note: 'VIP 고객',
    isVip: true
  },
  {
    id: 'BK-240115-003',
    customer: '박부장',
    phone: '010-9012-3456',
    email: 'park@company.com',
    date: '2024-01-15',
    time: '18:30',
    party: 6,
    table: 'T1',
    status: 'confirmed',
    special: '',
    note: '회사 회식',
    isVip: false
  },
  {
    id: 'BK-240115-004',
    customer: '정수영',
    phone: '010-3456-7890',
    email: 'sooyoung@email.com',
    date: '2024-01-15',
    time: '19:30',
    party: 3,
    table: '',
    status: 'pending',
    special: '유아차 필요합니다',
    note: '',
    isVip: false
  }
];

export function BookingManagement() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">확정</span>;
      case 'pending':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">대기중</span>;
      case 'cancelled':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">취소</span>;
      case 'completed':
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">완료</span>;
      default:
        return null;
    }
  };

  const handleBookingClick = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    // 실제 구현에서는 API 호출
    console.log(`Booking ${bookingId} status changed to ${newStatus}`);
    setShowDetailModal(false);
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">예약 관리</h1>
        <p className="text-gray-600">고객 예약 요청을 관리하고 처리하세요</p>
      </div>

      {/* 필터 및 검색 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button 
              onClick={() => setSelectedDate('today')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDate === 'today' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              오늘
            </button>
            <button 
              onClick={() => setSelectedDate('tomorrow')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDate === 'tomorrow' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              내일
            </button>
            <button 
              onClick={() => setSelectedDate('week')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedDate === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              이번주
            </button>
          </div>

          <div className="flex space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="고객명 또는 전화번호 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
              <Filter size={16} />
              <span>필터</span>
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <span>📅 2024-01-15 (월)</span>
          <span>총 {mockBookings.length}건 예약</span>
          <span>대기 중 {mockBookings.filter(b => b.status === 'pending').length}건</span>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">테이블</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">인원</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">특별 요청</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleBookingClick(booking)}>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{booking.time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.table || <span className="text-gray-400">미배정</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{booking.customer}</span>
                      {booking.isVip && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">VIP</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.party}명</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {booking.special || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        상세
                      </button>
                      {booking.status === 'pending' && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(booking.id, 'confirmed');
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            승인
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusChange(booking.id, 'cancelled');
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            거부
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">예약 상세 정보</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-gray-500">예약 ID: {selectedBooking.id}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* 고객 정보 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Users size={16} />
                  <span>고객 정보</span>
                </h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{selectedBooking.customer}</span>
                    {selectedBooking.isVip && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">VIP</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <a href={`tel:${selectedBooking.phone}`} className="text-blue-600 hover:underline">
                      {selectedBooking.phone}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail size={14} />
                    <a href={`mailto:${selectedBooking.email}`} className="text-blue-600 hover:underline">
                      {selectedBooking.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* 예약 정보 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>예약 정보</span>
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">날짜</label>
                    <p className="font-medium">{selectedBooking.date} (월)</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">시간</label>
                    <p className="font-medium">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">인원</label>
                    <p className="font-medium">{selectedBooking.party}명</p>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">테이블</label>
                    <p className="font-medium">{selectedBooking.table || '미배정'}</p>
                  </div>
                </div>
              </div>

              {/* 특별 요청 */}
              {selectedBooking.special && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <MessageSquare size={16} />
                    <span>특별 요청</span>
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-800">{selectedBooking.special}</p>
                  </div>
                </div>
              )}

              {/* 운영진 메모 */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">운영진 메모</h4>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="내부 메모를 입력하세요"
                  defaultValue={selectedBooking.note}
                />
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>
                {selectedBooking.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                      className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                    >
                      거부
                    </button>
                    <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                      시간 조정
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                      className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      승인
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}