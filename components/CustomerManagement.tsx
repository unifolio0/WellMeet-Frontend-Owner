import { useState } from 'react';
import { Search, Star, Phone, Mail, Gift } from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  visits: number;
  totalSpent: number;
  averageRating: number;
  lastVisit: string;
  isVip: boolean;
  birthday: string;
  preferences: string[];
  allergies: string[];
}

const mockCustomers = [
  {
    id: 1,
    name: '김민수',
    phone: '010-1234-5678',
    email: 'minsu@email.com',
    visits: 12,
    totalSpent: 540000,
    averageRating: 4.8,
    lastVisit: '2024-01-10',
    isVip: false,
    birthday: '03-15',
    preferences: ['레드와인', '미디움 스테이크'],
    allergies: ['새우']
  },
  {
    id: 2,
    name: '이지은',
    phone: '010-5678-9012',
    email: 'jieun@email.com',
    visits: 8,
    totalSpent: 320000,
    averageRating: 4.9,
    lastVisit: '2024-01-12',
    isVip: true,
    birthday: '07-22',
    preferences: ['화이트와인', '해산물'],
    allergies: []
  },
  {
    id: 3,
    name: '박부장',
    phone: '010-9012-3456',
    email: 'park@company.com',
    visits: 15,
    totalSpent: 680000,
    averageRating: 4.5,
    lastVisit: '2024-01-08',
    isVip: true,
    birthday: '11-03',
    preferences: ['단체석', '접대용'],
    allergies: ['견과류']
  }
];

export function CustomerManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">고객 관리</h1>
        <p className="text-gray-600">고객 정보와 방문 이력을 관리하세요</p>
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
                      <div className="flex items-center space-x-1 mt-1">
                        <Mail size={12} className="text-gray-400" />
                        <span className="text-gray-500">{customer.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.visits}회</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {customer.totalSpent.toLocaleString()}원
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      <Star size={14} className="text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-900">{customer.averageRating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.lastVisit}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCustomerClick(customer);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      상세보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 고객 상세 모달 */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">고객 상세 정보</h3>
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
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
                      <a href={`tel:${selectedCustomer.phone}`} className="text-blue-600 hover:underline">
                        {selectedCustomer.phone}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={14} />
                      <a href={`mailto:${selectedCustomer.email}`} className="text-blue-600 hover:underline">
                        {selectedCustomer.email}
                      </a>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Gift size={14} />
                      <span>생일: {selectedCustomer.birthday}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 통계 정보 */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedCustomer.visits}</p>
                  <p className="text-sm text-gray-600">총 방문 횟수</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">
                    {selectedCustomer.totalSpent.toLocaleString()}원
                  </p>
                  <p className="text-sm text-gray-600">총 결제 금액</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-600">{selectedCustomer.averageRating}</p>
                  <p className="text-sm text-gray-600">평균 평점</p>
                </div>
              </div>

              {/* 선호도 & 특이사항 */}
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">선호 사항</h5>
                  <div className="flex flex-wrap gap-2">
                    {selectedCustomer.preferences.map((pref, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                        {pref}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedCustomer.allergies.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">알레르기 정보</h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedCustomer.allergies.map((allergy, index) => (
                        <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                          ⚠️ {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 메모 */}
              <div>
                <h5 className="font-medium text-gray-900 mb-2">메모</h5>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="고객에 대한 메모를 입력하세요"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button 
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
              <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}