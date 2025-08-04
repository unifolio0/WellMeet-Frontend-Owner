import { useState, useEffect } from 'react';
import { Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { reviewsService } from '@lib/api/services';
import type { Review, ReviewStats } from '@lib/api/services';

export function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage] = useState(1);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const reviewsResponse = await reviewsService.getReviews({ page: currentPage, limit: 10 });

      setReviews(reviewsResponse.reviews);
      // Mock stats for now
      setReviewStats({
        avgRating: 4.5,
        totalCount: reviewsResponse.reviews.length,
        distribution: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
        replyRate: 0,
        recentTrend: 'stable'
      });
    } catch (err) {
      console.error('Reviews data fetch error:', err);
      setError('리뷰 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  const handleReply = async (reviewId: number) => {
    try {
      await reviewsService.addReply(reviewId, { reply: replyText });
      
      // 로컬 상태 업데이트
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, reply: { content: replyText, createdAt: new Date().toISOString() } }
          : review
      ));
      
      setReplyText('');
      setEditingReplyId(null);
    } catch (err) {
      console.error('Reply error:', err);
      setError('답글 작성에 실패했습니다.');
    }
  };

  const handleUpdateReply = async (reviewId: number) => {
    try {
      await reviewsService.updateReply(reviewId, { reply: replyText });
      
      // 로컬 상태 업데이트
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, reply: { ...review.reply!, content: replyText } }
          : review
      ));
      
      setReplyText('');
      setEditingReplyId(null);
    } catch (err) {
      console.error('Update reply error:', err);
      setError('답글 수정에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
          <p className="text-gray-600">고객 리뷰에 답글을 달고 평점을 관리하세요</p>
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
          <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
          <p className="text-gray-600">고객 리뷰에 답글을 달고 평점을 관리하세요</p>
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">리뷰 관리</h1>
        <p className="text-gray-600">고객 리뷰에 답글을 달고 평점을 관리하세요</p>
      </div>

      {/* 리뷰 통계 */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              {renderStars(Math.round(reviewStats?.avgRating || 0))}
            </div>
            <p className="text-2xl font-bold text-gray-900">{reviewStats?.avgRating?.toFixed(1) || '0.0'}</p>
            <p className="text-sm text-gray-600">평균 평점</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{reviewStats?.totalCount || 0}</p>
            <p className="text-sm text-gray-600">총 리뷰 수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">0</p>
            <p className="text-sm text-gray-600">답글 완료</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{reviewStats?.totalCount || 0}</p>
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
                    {review.customer.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{review.customer.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex space-x-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <ThumbsUp size={14} />
                <span>0</span>
              </div>
            </div>

            <p className="text-gray-800 mb-4 leading-relaxed">{review.comment}</p>

            {/* 답글 섹션 */}
            {review.reply && (
              <div className="bg-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <MessageSquare size={16} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">사장님 답글</span>
                </div>
                <p className="text-gray-800">{review.reply?.content || ''}</p>
              </div>
            )}

            {/* 답글 작성/편집 */}
            {(!review.reply || editingReplyId === review.id) && (
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
                    onClick={() => editingReplyId === review.id ? handleUpdateReply(review.id) : handleReply(review.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingReplyId === review.id ? '답글 수정' : '답글 작성'}
                  </button>
                </div>
              </div>
            )}

            {review.reply && editingReplyId !== review.id && (
              <div className="border-t pt-4 flex justify-end">
                <button
                  onClick={() => {
                    setEditingReplyId(review.id);
                    setReplyText(review.reply?.content || '');
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