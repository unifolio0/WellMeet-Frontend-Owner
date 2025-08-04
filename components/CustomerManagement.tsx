import { useState, useEffect } from 'react';
import { Search, Star, Phone, Mail, Gift, Edit, Trash2, Plus, UserCheck, Calendar, MessageSquare } from 'lucide-react';
import { customersService } from '@lib/api/services';
import type { Customer, CustomerDetail, CustomerBooking, CustomerReview } from '@lib/api/services';

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage] = useState(1);
  const [customerBookings, setCustomerBookings] = useState<CustomerBooking[]>([]);
  const [customerReviews, setCustomerReviews] = useState<CustomerReview[]>([]);
  const [activeTab, setActiveTab] = useState<'info' | 'bookings' | 'reviews'>('info');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<CustomerDetail>>({});
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    phone: '',
    email: '',
    birthday: '',
    preferences: '',
    allergies: '',
    notes: ''
  });

  useEffect(() => {
    fetchCustomers();
  }, [currentPage]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: 20,
        sort: 'visitCount:desc',
      };

      const response = await customersService.getCustomers(params);
      setCustomers(response.customers);
    } catch (err) {
      console.error('Customers fetch error:', err);
      setError('고객 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCustomerClick = async (customer: Customer) => {
    try {
      const response = await customersService.getCustomerDetail(customer.id);
      setSelectedCustomer(response.customer);
      setEditForm(response.customer);
      setShowDetailModal(true);
      setActiveTab('info');
      setIsEditing(false);

      // 예약 이력 로드
      const bookingsResponse = await customersService.getCustomerBookings(customer.id);
      setCustomerBookings(bookingsResponse.bookings);

      // 리뷰 이력 로드  
      const reviewsResponse = await customersService.getCustomerReviews(customer.id);
      setCustomerReviews(reviewsResponse.reviews);
    } catch (err) {
      console.error('Customer detail fetch error:', err);
      setError('고객 상세 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleVipToggle = async (customerId: number, isVip: boolean) => {
    try {
      await customersService.updateVipStatus(customerId, { isVip: !isVip });
      
      // 로컬 상태 업데이트
      setCustomers(prev => prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, isVip: !isVip }
          : customer
      ));

      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer(prev => prev ? { ...prev, isVip: !isVip } : null);
      }
    } catch (err) {
      console.error('VIP status update error:', err);
      setError('VIP 상태 변경에 실패했습니다.');
    }
  };

  const handleCustomerUpdate = async () => {
    if (!selectedCustomer) return;

    try {
      const response = await customersService.updateCustomer(selectedCustomer.id, editForm);
      setSelectedCustomer(response.customer);
      setEditForm(response.customer);
      setIsEditing(false);
      
      // 고객 목록도 업데이트
      fetchCustomers();
    } catch (err) {
      console.error('Customer update error:', err);
      setError('고객 정보 수정에 실패했습니다.');
    }
  };

  const handleCustomerDelete = async (customerId: number) => {
    if (!confirm('정말로 이 고객을 삭제하시겠습니까?')) return;

    try {
      await customersService.deleteCustomer(customerId);
      setCustomers(prev => prev.filter(customer => customer.id !== customerId));
      
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setShowDetailModal(false);
        setSelectedCustomer(null);
      }
    } catch (err) {
      console.error('Customer delete error:', err);
      setError('고객 삭제에 실패했습니다.');
    }
  };

  const handleNewCustomerCreate = async () => {
    try {
      const response = await customersService.createCustomer(newCustomerForm);
      setCustomers(prev => [response.customer, ...prev]);
      setShowNewCustomerModal(false);
      setNewCustomerForm({
        name: '',
        phone: '',
        email: '',
        birthday: '',
        preferences: '',
        allergies: '',
        notes: ''
      });
    } catch (err) {
      console.error('Customer create error:', err);
      setError('고객 등록에 실패했습니다.');
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
          <p className="text-gray-600">고객 정보와 방문 이력을 관리하세요</p>
        </div>
        <button
          onClick={() => setShowNewCustomerModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          <span>새 고객 등록</span>
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="고객명, 전화번호, 이메일로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* 고객 목록 */}
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
              onClick={() => fetchCustomers()} 
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연락처</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">방문 횟수</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">총 결제액</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평균 평점</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">최근 방문</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">액션</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCustomerClick(customer)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {customer.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-900">{customer.name}</span>
                          {customer.isVip && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              VIP
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      <div className="flex items-center space-x-1">
                        <Phone size={12} className="text-gray-400" />
                        <span>{customer.phone}</span>
                      </div>
                      {customer.email && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Mail size={12} className="text-gray-400" />
                          <span className="text-gray-500">{customer.email}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.visitCount}회</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalSpent.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-900">{customer.averagePartySize}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomerClick(customer);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        상세보기
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVipToggle(customer.id, customer.isVip);
                        }}
                        className={`flex items-center space-x-1 px-2 py-1 rounded text-xs ${
                          customer.isVip 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <UserCheck size={12} />
                        <span>{customer.isVip ? 'VIP 해제' : 'VIP 설정'}</span>
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomerDelete(customer.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-gray-500">등록된 고객이 없습니다.</p>
            </div>
          )}
          </div>
        )}
      </div>

      {/* 고객 상세 모달 */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">고객 상세 정보</h3>
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
              
              {/* 탭 네비게이션 */}
              <div className="flex space-x-6 mt-4">
                <button
                  onClick={() => setActiveTab('info')}
                  className={`pb-2 border-b-2 font-medium text-sm ${
                    activeTab === 'info'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  기본 정보
                </button>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`pb-2 border-b-2 font-medium text-sm ${
                    activeTab === 'bookings'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  예약 이력 ({customerBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2 border-b-2 font-medium text-sm ${
                    activeTab === 'reviews'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  리뷰 이력 ({customerReviews.length})
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* 기본 정보 탭 */}
              {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* 고객 프로필 */}
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {selectedCustomer.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-xl font-semibold text-gray-900">{selectedCustomer.name}</h4>
                        {selectedCustomer.isVip && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                            VIP 고객
                          </span>
                        )}
                      </div>
                      <div className="mt-1 space-y-1 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Phone size={14} />
                          {isEditing ? (
                            <input
                              type="tel"
                              value={editForm.phone || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <a href={`tel:${selectedCustomer.phone}`} className="text-blue-600 hover:underline">
                              {selectedCustomer.phone}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail size={14} />
                          {isEditing ? (
                            <input
                              type="email"
                              value={editForm.email || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <a href={`mailto:${selectedCustomer.email}`} className="text-blue-600 hover:underline">
                              {selectedCustomer.email}
                            </a>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Gift size={14} />
                          {isEditing ? (
                            <input
                              type="date"
                              value={editForm.birthday || ''}
                              onChange={(e) => setEditForm(prev => ({ ...prev, birthday: e.target.value }))}
                              className="border border-gray-300 rounded px-2 py-1"
                            />
                          ) : (
                            <span>생일: {selectedCustomer.birthday}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 통계 정보 */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-blue-600">{selectedCustomer.visitCount}</p>
                      <p className="text-sm text-gray-600">총 방문 횟수</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {selectedCustomer.totalSpent.toLocaleString()}원
                      </p>
                      <p className="text-sm text-gray-600">총 결제 금액</p>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <p className="text-2xl font-bold text-yellow-600">{selectedCustomer.averagePartySize}</p>
                      <p className="text-sm text-gray-600">평균 평점</p>
                    </div>
                  </div>

                  {/* 선호도 & 특이사항 */}
                  <div className="space-y-4">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">선호 사항</h5>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.preferences || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, preferences: e.target.value }))}
                          placeholder="선호사항을 콤마로 구분하여 입력"
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.preferences && selectedCustomer.preferences.split(',').map((pref: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                              {pref}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">알레르기 정보</h5>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.allergies || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, allergies: e.target.value }))}
                          placeholder="알레르기 정보를 콤마로 구분하여 입력"
                          className="w-full border border-gray-300 rounded px-3 py-2"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {selectedCustomer.allergies && selectedCustomer.allergies.split(',').map((allergy: string, index: number) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                              ⚠️ {allergy}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 메모 */}
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">메모</h5>
                    <textarea
                      value={isEditing ? (editForm.notes || '') : (selectedCustomer.notes || '')}
                      onChange={isEditing ? (e) => setEditForm(prev => ({ ...prev, notes: e.target.value })) : undefined}
                      readOnly={!isEditing}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="고객에 대한 메모를 입력하세요"
                    />
                  </div>
                </div>
              )}

              {/* 예약 이력 탭 */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">예약 이력</h5>
                  {customerBookings.length > 0 ? (
                    <div className="space-y-3">
                      {customerBookings.map((booking) => (
                        <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center space-x-2">
                                <Calendar size={16} className="text-gray-400" />
                                <span className="font-medium">{booking.date} {booking.time}</span>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="mt-1 text-sm text-gray-600">
                                <span>인원: {booking.party}명</span>
                                {booking.tableNumber && <span> • 테이블: {booking.tableNumber}</span>}
                                {booking.totalAmount && <span> • 결제: {booking.totalAmount.toLocaleString()}원</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">예약 이력이 없습니다.</p>
                  )}
                </div>
              )}

              {/* 리뷰 이력 탭 */}
              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  <h5 className="font-medium text-gray-900">리뷰 이력</h5>
                  {customerReviews.length > 0 ? (
                    <div className="space-y-3">
                      {customerReviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex space-x-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <Star
                                      key={i}
                                      size={14}
                                      className={`${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-800 mb-2">{review.comment}</p>
                              {review.reply && (
                                <div className="bg-blue-50 rounded p-3 mt-2">
                                  <div className="flex items-center space-x-1 mb-1">
                                    <MessageSquare size={12} className="text-blue-600" />
                                    <span className="text-xs font-medium text-blue-900">사장님 답글</span>
                                  </div>
                                  <p className="text-sm text-gray-700">{review.reply}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">리뷰 이력이 없습니다.</p>
                  )}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
              {isEditing && (
                <button 
                  onClick={handleCustomerUpdate}
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  저장
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 새 고객 등록 모달 */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">새 고객 등록</h3>
                <button 
                  onClick={() => setShowNewCustomerModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름 *</label>
                <input
                  type="text"
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="고객 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호 *</label>
                <input
                  type="tel"
                  value={newCustomerForm.phone}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="010-1234-5678"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <input
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="customer@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">생일</label>
                <input
                  type="date"
                  value={newCustomerForm.birthday}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, birthday: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">선호사항</label>
                <input
                  type="text"
                  value={newCustomerForm.preferences}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, preferences: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="매운맛, 창가자리 등 (콤마로 구분)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">알레르기 정보</label>
                <input
                  type="text"
                  value={newCustomerForm.allergies}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, allergies: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="견과류, 새우 등 (콤마로 구분)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">메모</label>
                <textarea
                  value={newCustomerForm.notes}
                  onChange={(e) => setNewCustomerForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="고객에 대한 추가 정보를 입력하세요"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowNewCustomerModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button 
                onClick={handleNewCustomerCreate}
                disabled={!newCustomerForm.name || !newCustomerForm.phone}
                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                등록
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}