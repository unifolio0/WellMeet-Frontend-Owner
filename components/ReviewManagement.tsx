import { useState } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';

const reviewData: any[] = [];

export function ReviewManagement() {
  const [reviews, setReviews] = useState(reviewData);
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
        {reviews.length > 0 ? (
          reviews.map((review) => (
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
          ))
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">아직 작성된 리뷰가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}