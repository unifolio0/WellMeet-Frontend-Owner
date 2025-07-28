import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

const mockReviews = [
  {
    id: 1,
    customer: '이지은',
    rating: 5,
    content: '정말 맛있었어요! 트러플 파스타가 특히 인상깊었습니다. 다음에 또 올게요.',
    date: '2024-01-15',
    reply: '',
    helpful: 3,
    replied: false
  },
  {
    id: 2,
    customer: '김민수',
    rating: 4,
    content: '분위기도 좋고 음식도 맛있었습니다. 다만 예약 시간보다 조금 늦게 안내되어 아쉬웠어요.',
    date: '2024-01-14',
    reply: '소중한 리뷰 감사합니다. 대기 시간으로 불편을 드려 죄송합니다. 더욱 정확한 시간 안내를 위해 노력하겠습니다.',
    helpful: 2,
    replied: true
  },
  {
    id: 3,
    customer: '박부장',
    rating: 5,
    content: '회사 회식으로 방문했는데 모든 직원들이 만족했습니다. 서비스도 훌륭하고 음식 퀄리티도 최고예요!',
    date: '2024-01-12',
    reply: '정말 감사합니다! 앞으로도 최상의 서비스로 보답하겠습니다.',
    helpful: 5,
    replied: true
  }
];

export function ReviewManagement() {
  const [reviews, setReviews] = useState(mockReviews);
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleReply = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { ...review, reply: replyText, replied: true }
        : review
    ));
    setReplyText('');
    setEditingReplyId(null);
  };

  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="text-gray-600">고객 리뷰에 답글을 달고 평점을 관리하세요</p>
      </div>

      {/* 리뷰 통계 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {renderStars(Math.round(averageRating))}
            </div>
            <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            <p className="text-sm text-gray-600">평균 평점</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{reviews.length}</p>
            <p className="text-sm text-gray-600">총 리뷰 수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{reviews.filter(r => r.replied).length}</p>
            <p className="text-sm text-gray-600">답글 완료</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{reviews.filter(r => !r.replied).length}</p>
            <p className="text-sm text-gray-600">답글 대기</p>
          </div>
        </div>
      </div>

      {/* 리뷰 목록 */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {review.customer.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{review.customer}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ThumbsUp size={14} />
                <span>{review.helpful}</span>
              </div>
            </div>

            <p className="text-gray-800 mb-4 leading-relaxed">{review.content}</p>

            {/* 답글 섹션 */}
            {review.replied && review.reply && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">사장님 답글</span>
                </div>
                <p className="text-gray-800">{review.reply}</p>
              </div>
            )}

            {/* 답글 작성/편집 */}
            {(!review.replied || editingReplyId === review.id) && (
              <div className="border-t pt-4">
                <textarea
                  value={editingReplyId === review.id ? replyText : ''}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="고객에게 답글을 작성하세요..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
                <div className="flex justify-end space-x-2 mt-3">
                  {editingReplyId === review.id && (
                    <button
                      onClick={() => {
                        setEditingReplyId(null);
                        setReplyText('');
                      }}
                      className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      취소
                    </button>
                  )}
                  <button
                    onClick={() => handleReply(review.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    답글 작성
                  </button>
                </div>
              </div>
            )}

            {review.replied && editingReplyId !== review.id && (
              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={() => {
                    setEditingReplyId(review.id);
                    setReplyText(review.reply);
                  }}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  답글 수정
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}