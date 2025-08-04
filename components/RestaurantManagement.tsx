import { useState, useEffect } from 'react';
import { Store, Clock, Menu as MenuIcon, MapPin, Phone, Edit, Plus, Trash2 } from 'lucide-react';
import { restaurantService } from '@lib/api/services';
import type { Restaurant, OperatingHours, MenuItem } from '@lib/api/services';

export function RestaurantManagement() {
  const [activeTab, setActiveTab] = useState('info');
  const [isEditing, setIsEditing] = useState(false);
  const [restaurantInfo, setRestaurantInfo] = useState<Restaurant | null>(null);
  const [operatingHours, setOperatingHours] = useState<OperatingHours | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [restaurantResponse, hoursResponse, menuResponse] = await Promise.all([
        restaurantService.getInfo(),
        restaurantService.getOperatingHours(),
        restaurantService.getMenu()
      ]);

      setRestaurantInfo(restaurantResponse.restaurant);
      setOperatingHours(hoursResponse.operatingHours);
      setMenuItems(menuResponse.items);
    } catch (err) {
      console.error('Restaurant data fetch error:', err);
      setError('매장 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInfo = async () => {
    if (!restaurantInfo) return;
    
    try {
      // 실제로는 폼 데이터를 수집해서 업데이트
      await restaurantService.updateInfo({
        name: restaurantInfo.name,
        category: restaurantInfo.category,
        // ... 기타 필드들
      });
      setIsEditing(false);
      fetchData(); // 데이터 새로고침
    } catch (err) {
      console.error('Update restaurant info error:', err);
      setError('매장 정보 업데이트에 실패했습니다.');
    }
  };

  const tabs = [
    { id: 'info', label: '매장 정보', icon: Store },
    { id: 'hours', label: '운영시간', icon: Clock },
    { id: 'menu', label: '메뉴 관리', icon: MenuIcon },
  ];

  const dayNames: Record<string, string> = {
    monday: '월요일',
    tuesday: '화요일',
    wednesday: '수요일',
    thursday: '목요일',
    friday: '금요일',
    saturday: '토요일',
    sunday: '일요일'
  };

  const renderInfoTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">매장 기본 정보</h3>
        <button 
          onClick={() => isEditing ? handleSaveInfo() : setIsEditing(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit size={16} />
          <span>{isEditing ? '저장' : '편집'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">매장명</label>
            {isEditing ? (
              <input 
                type="text" 
                defaultValue={restaurantInfo?.name || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900 font-medium">{restaurantInfo?.name || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
            {isEditing ? (
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="italian">이탈리안</option>
                <option value="korean">한식</option>
                <option value="japanese">일식</option>
                <option value="chinese">중식</option>
                <option value="western">양식</option>
              </select>
            ) : (
              <p className="text-gray-900">{restaurantInfo?.category || '-'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">주소</label>
            {isEditing ? (
              <input 
                type="text" 
                defaultValue={restaurantInfo?.address?.street || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-gray-400" />
                <p className="text-gray-900">{restaurantInfo?.address?.street || '-'}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
            {isEditing ? (
              <input 
                type="tel" 
                defaultValue={restaurantInfo?.phone || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-gray-400" />
                <p className="text-gray-900">{restaurantInfo?.phone || '-'}</p>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">매장 소개</label>
            {isEditing ? (
              <textarea 
                rows={4}
                defaultValue={restaurantInfo?.description || ''}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-700 leading-relaxed">{restaurantInfo?.description || '-'}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">매장 이미지</label>
          <div className="grid grid-cols-2 gap-4">
            {restaurantInfo?.images && restaurantInfo.images.length > 0 ? (
              restaurantInfo.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image} 
                    alt={`매장 이미지 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <button className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-8 text-gray-500">
                <p>등록된 이미지가 없습니다.</p>
              </div>
            )}
            {isEditing && (
              <button className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors">
                <div className="text-center">
                  <Plus size={24} className="mx-auto mb-2" />
                  <p className="text-sm">이미지 추가</p>
                </div>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderHoursTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">운영시간 설정</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Edit size={16} />
          <span>편집</span>
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">요일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">운영시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">브레이크타임</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operatingHours && Object.entries(operatingHours).map(([day, hours]) => (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {dayNames[day]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hours.isClosed ? '-' : `${hours.open} - ${hours.close}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {hours.isClosed || !hours.breakTime ? '-' : `${hours.breakTime.start} - ${hours.breakTime.end}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {hours.isClosed ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        휴무
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        운영
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">운영시간 안내</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• 운영시간은 고객 예약 가능 시간대에 반영됩니다</li>
          <li>• 브레이크타임 동안은 새로운 예약을 받지 않습니다</li>
          <li>• 임시 휴무나 특별 운영시간은 별도로 설정해 주세요</li>
        </ul>
      </div>
    </div>
  );

  const renderMenuTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">메뉴 관리</h3>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={16} />
          <span>메뉴 추가</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.length > 0 ? (
          menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              {item.isPopular && (
                <span className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                  인기메뉴
                </span>
              )}
              {!item.available && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-medium">품절</span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">{item.category}</p>
                  <h4 className="font-semibold text-gray-900">{item.name}</h4>
                </div>
                <div className="flex space-x-1">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <Edit size={14} />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-gray-900">
                  {item.price.toLocaleString()}원
                </p>
                <label className="inline-flex items-center">
                  <input 
                    type="checkbox" 
                    defaultChecked={item.available}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-600">판매</span>
                </label>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">등록된 메뉴가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">매장 관리</h1>
          <p className="text-gray-600">매장 정보, 운영시간, 메뉴를 관리하세요</p>
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
          <h1 className="text-2xl font-bold text-gray-900">매장 관리</h1>
          <p className="text-gray-600">매장 정보, 운영시간, 메뉴를 관리하세요</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={() => fetchData()} 
            className="mt-2 text-red-600 underline"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">매장 관리</h1>
        <p className="text-gray-600">매장 정보, 운영시간, 메뉴를 관리하세요</p>
      </div>

      {/* 탭 네비게이션 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'info' && renderInfoTab()}
        {activeTab === 'hours' && renderHoursTab()}
        {activeTab === 'menu' && renderMenuTab()}
      </div>
    </div>
  );
}