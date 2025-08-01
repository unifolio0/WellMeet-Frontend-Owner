import { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  profileImage?: string;
}

export function ProfileSettings() {
  const [profile, setProfile] = useState<UserProfile>({
    name: '최사장님',
    email: 'owner@raviolo.com',
    phone: '010-1234-5678',
    address: '서울시 강남구 논현로 123',
    role: '사장님',
    profileImage: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile>(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
    // TODO: API 호출하여 프로필 업데이트
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditedProfile({ ...editedProfile, profileImage: imageUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">프로필 설정</h1>
        <p className="text-gray-600">개인 정보와 프로필 사진을 관리하세요</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        {/* 프로필 이미지 */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
              {(isEditing ? editedProfile : profile).profileImage ? (
                <img 
                  src={(isEditing ? editedProfile : profile).profileImage} 
                  alt="프로필" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={32} className="text-white" />
              )}
            </div>
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1 cursor-pointer hover:bg-blue-700">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {(isEditing ? editedProfile : profile).name}
            </h3>
            <p className="text-gray-500">{profile.role}</p>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                프로필 편집
              </button>
            )}
          </div>
        </div>

        {/* 프로필 정보 */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-2" />
              이름
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.name}
                onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-2" />
              이메일
            </label>
            {isEditing ? (
              <input
                type="email"
                value={editedProfile.email}
                onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              전화번호
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedProfile.phone}
                onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-2" />
              주소
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedProfile.address}
                onChange={(e) => setEditedProfile({ ...editedProfile, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ) : (
              <p className="text-gray-900">{profile.address}</p>
            )}
          </div>
        </div>

        {/* 편집 모드 버튼 */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Save size={16} />
              <span>저장</span>
            </button>
          </div>
        )}
      </div>

      {/* 계정 정보 */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">계정 정보</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">가입일</span>
            <span className="text-gray-900">2023년 12월 1일</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">마지막 로그인</span>
            <span className="text-gray-900">2024년 1월 15일 14:30</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">계정 상태</span>
            <span className="text-green-600 font-medium">활성</span>
          </div>
        </div>
      </div>
    </div>
  );
}