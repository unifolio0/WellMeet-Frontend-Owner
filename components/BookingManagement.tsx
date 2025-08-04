import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Users, Phone, Mail, MessageSquare, Edit, Trash2, Clock, TableProperties } from 'lucide-react';
import { bookingsService } from '@lib/api/services';
import type { Booking, BookingDetail, BookingsListParams } from '@lib/api/services';

export function BookingManagement() {
  const [selectedDate, setSelectedDate] = useState('today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<BookingDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<BookingDetail>>({});
  const [memo, setMemo] = useState('');
  const [showTableAssignment, setShowTableAssignment] = useState(false);
  const [selectedTable, setSelectedTable] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [selectedDate, currentPage]);

  useEffect(() => {
    if (searchTerm) {
      handleSearch();
    } else {
      fetchBookings();
    }
  }, [searchTerm]);

  const getDateFilter = (): string | undefined => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (selectedDate) {
      case 'today':
        return today.toISOString().split('T')[0];
      case 'tomorrow':
        return tomorrow.toISOString().split('T')[0];
      case 'week':
        return undefined; // 일주일 범위는 API에서 처리
      default:
        return undefined;
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: BookingsListParams = {
        page: currentPage,
        limit: 20,
        date: getDateFilter(),
      };

      const response = await bookingsService.getBookings(params);
      setBookings(response.bookings);
    } catch (err) {
      console.error('Bookings fetch error:', err);
      setError('예약 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchBookings();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await bookingsService.searchBookings({ q: searchTerm });
      setBookings(response.bookings);
    } catch (err) {
      console.error('Booking search error:', err);
      setError('검색에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

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

  const handleBookingClick = async (booking: Booking) => {
    try {
      const response = await bookingsService.getBookingDetail(booking.id);
      setSelectedBooking(response.booking);
      setEditForm(response.booking);
      setMemo(response.booking.note || '');
      setShowDetailModal(true);
      setIsEditing(false);
    } catch (err) {
      console.error('Booking detail fetch error:', err);
      setError('예약 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleStatusChange = async (bookingId: number, newStatus: string) => {
    try {
      await bookingsService.updateBookingStatus(bookingId, { 
        status: newStatus as any 
      });
      setShowDetailModal(false);
      fetchBookings(); // 목록 새로고침
    } catch (err) {
      console.error('Status update error:', err);
      setError('예약 상태 변경에 실패했습니다.');
    }
  };

  const handleBookingUpdate = async () => {
    if (!selectedBooking) return;

    try {
      const response = await bookingsService.updateBooking(selectedBooking.id, editForm);
      setSelectedBooking(response.booking);
      setEditForm(response.booking);
      setIsEditing(false);
      fetchBookings(); // 목록 새로고침
    } catch (err) {
      console.error('Booking update error:', err);
      setError('예약 정보 수정에 실패했습니다.');
    }
  };

  const handleBookingDelete = async (bookingId: number) => {
    if (!confirm('정말로 이 예약을 삭제하시겠습니까?')) return;

    try {
      await bookingsService.deleteBooking(bookingId);
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      if (selectedBooking && selectedBooking.id === bookingId) {
        setShowDetailModal(false);
        setSelectedBooking(null);
      }
    } catch (err) {
      console.error('Booking delete error:', err);
      setError('예약 삭제에 실패했습니다.');
    }
  };

  const handleMemoSave = async () => {
    if (!selectedBooking) return;

    try {
      await bookingsService.updateBooking(selectedBooking.id, { note: memo });
      setSelectedBooking(prev => prev ? { ...prev, note: memo } : null);
    } catch (err) {
      console.error('Memo save error:', err);
      setError('메모 저장에 실패했습니다.');
    }
  };

  const handleTableAssignment = async () => {
    if (!selectedBooking || !selectedTable) return;

    try {
      const tableNum = parseInt(selectedTable.replace('T', ''));
      await bookingsService.updateBooking(selectedBooking.id, { tableNumber: tableNum });
      setSelectedBooking(prev => prev ? { ...prev, tableNumber: tableNum } : null);
      setShowTableAssignment(false);
      fetchBookings(); // 목록 새로고침
    } catch (err) {
      console.error('Table assignment error:', err);
      setError('테이블 배정에 실패했습니다.');
    }
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
          <span>📅 {new Date().toLocaleDateString('ko-KR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            weekday: 'short' 
          })}</span>
          <span>총 {bookings.length}건 예약</span>
          <span>대기 중 {bookings.filter(b => b.status === 'pending').length}건</span>
        </div>
      </div>

      {/* 예약 목록 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-500">데이터를 불러오는 중...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 m-6">
            <div className="text-red-800">{error}</div>
            <button 
              onClick={() => fetchBookings()} 
              className="mt-2 text-red-600 underline"
            >
              다시 시도
            </button>
          </div>
        )}

        {!loading && !error && (
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
              {bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleBookingClick(booking)}>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {new Date(booking.time).toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {booking.tableNumber || <span className="text-gray-400">미배정</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">{booking.customer.name}</span>
                      {booking.customer.isVip && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">VIP</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.party}명</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {booking.note || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingClick(booking);
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                      >
                        <Edit size={14} />
                        <span>상세</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookingDelete(booking.id);
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center space-x-1"
                      >
                        <Trash2 size={14} />
                        <span>삭제</span>
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
            {bookings.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-gray-500">예약이 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">예약 상세 정보</h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <Edit size={14} />
                    <span>{isEditing ? '취소' : '편집'}</span>
                  </button>
                  <button 
                    onClick={() => setShowDetailModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
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
                    <span className="font-medium">{selectedBooking.customer.name}</span>
                    {selectedBooking.customer.isVip && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">VIP</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone size={14} />
                    <a href={`tel:${selectedBooking.customer.phone}`} className="text-blue-600 hover:underline">
                      {selectedBooking.customer.phone}
                    </a>
                  </div>
                  {selectedBooking.customer.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail size={14} />
                      <a href={`mailto:${selectedBooking.customer.email}`} className="text-blue-600 hover:underline">
                        {selectedBooking.customer.email}
                      </a>
                    </div>
                  )}
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
                    {isEditing ? (
                      <input
                        type="date"
                        value={editForm.date || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                        className="border border-gray-300 rounded px-3 py-2 font-medium"
                      />
                    ) : (
                      <p className="font-medium">
                        {new Date(selectedBooking.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          weekday: 'short'
                        })}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">시간</label>
                    {isEditing ? (
                      <input
                        type="time"
                        value={editForm.time ? new Date(editForm.time).toTimeString().slice(0, 5) : ''}
                        onChange={(e) => {
                          const timeStr = e.target.value;
                          if (timeStr && editForm.date) {
                            const dateTime = new Date(`${editForm.date}T${timeStr}:00`);
                            setEditForm(prev => ({ ...prev, time: dateTime.toISOString() }));
                          }
                        }}
                        className="border border-gray-300 rounded px-3 py-2 font-medium"
                      />
                    ) : (
                      <p className="font-medium">
                        {new Date(selectedBooking.time).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">인원</label>
                    {isEditing ? (
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={editForm.party || ''}
                        onChange={(e) => setEditForm(prev => ({ ...prev, party: parseInt(e.target.value) }))}
                        className="border border-gray-300 rounded px-3 py-2 font-medium w-24"
                      />
                    ) : (
                      <p className="font-medium">{selectedBooking.party}명</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">테이블</label>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{selectedBooking.tableNumber || '미배정'}</p>
                      <button 
                        onClick={() => setShowTableAssignment(true)}
                        className="flex items-center space-x-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                      >
                        <TableProperties size={12} />
                        <span>배정</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 특별 요청 */}
              {selectedBooking.specialRequests && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <MessageSquare size={16} />
                    <span>특별 요청</span>
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-gray-800">{selectedBooking.specialRequests}</p>
                  </div>
                </div>
              )}

              {/* 운영진 메모 */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">운영진 메모</h4>
                  <button 
                    onClick={handleMemoSave}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    <Clock size={12} />
                    <span>저장</span>
                  </button>
                </div>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="내부 메모를 입력하세요"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
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
                {isEditing && (
                  <button 
                    onClick={handleBookingUpdate}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    저장
                  </button>
                )}
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

      {/* 테이블 배정 모달 */}
      {showTableAssignment && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">테이블 배정</h3>
                <button 
                  onClick={() => setShowTableAssignment(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">테이블 번호</label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">테이블을 선택하세요</option>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={`T${num.toString().padStart(2, '0')}`}>
                      테이블 {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">예약 정보</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>고객: {selectedBooking.customer.name}</p>
                  <p>인원: {selectedBooking.party}명</p>
                  <p>시간: {new Date(selectedBooking.time).toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowTableAssignment(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleTableAssignment}
                disabled={!selectedTable}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                배정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}