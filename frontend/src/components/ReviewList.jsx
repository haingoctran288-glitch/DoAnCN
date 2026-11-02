import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, User as UserIcon, Clock } from 'lucide-react';
import axios from 'axios';

const ReviewList = ({ type, itemId }) => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ averageRating: 0, reviewCount: 0 });
  const [loading, setLoading] = useState(true);
  const [failedAvatars, setFailedAvatars] = useState({});

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
    return `http://localhost:8080${avatar.startsWith('/') ? '' : '/'}${avatar}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reviewsRes, statsRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/reviews/${type}/${itemId}`),
          axios.get(`http://localhost:8080/api/reviews/${type}/${itemId}/stats`)
        ]);
        setReviews(reviewsRes.data || []);
        setStats(statsRes.data || { averageRating: 0, reviewCount: 0 });
      } catch (err) {
        console.error("Lỗi fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    if (itemId) fetchData();
  }, [type, itemId]);

  if (loading) {
    return <div className="animate-pulse flex space-x-4 bg-[#111] p-6 rounded-2xl"><div className="rounded-full bg-gray-800 h-10 w-10"></div><div className="flex-1 space-y-4 py-1"><div className="h-2 bg-gray-800 rounded w-3/4"></div></div></div>;
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  };

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] rounded-3xl border border-[#333] p-8 md:p-12 mt-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>

      <div className="flex flex-col md:flex-row items-center gap-10 mb-10 border-b border-gray-800 pb-10 relative z-10">
        <div className="text-center md:text-left min-w-[200px]">
          <h2 className="text-6xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-br from-accent to-yellow-600 mb-2">
            {stats.averageRating.toFixed(1)}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-5 h-5 ${star <= Math.round(stats.averageRating) ? 'fill-accent text-accent' : 'text-gray-700'}`} 
              />
            ))}
          </div>
          <p className="text-gray-400 text-sm tracking-wider uppercase">{stats.reviewCount} đánh giá</p>
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <div className="w-8 h-[1px] bg-accent/50 hidden md:block"></div>
            <span className="text-accent text-xs font-bold uppercase tracking-[4px]">Niềm tin khách hàng</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Đánh giá từ khách hàng</h3>
          <p className="text-gray-400 text-sm leading-relaxed">Tất cả những đánh giá này đều đến từ khách hàng đã trải nghiệm thực tế sản phẩm và dịch vụ của chúng tôi.</p>
        </div>
      </div>

      <div className="space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar pr-2 relative z-10">
        {reviews.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <MessageCircle className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400">Chưa có đánh giá nào.</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-6 border border-white/10 relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-tr from-accent to-yellow-600 flex-shrink-0">
                  <div className="w-full h-full rounded-full bg-[#111] overflow-hidden flex items-center justify-center">
                    {review.user?.avatar && !failedAvatars[review.id] ? (
                      <img
                        src={getAvatarUrl(review.user.avatar)}
                        alt={review.user?.fullName || 'avatar'}
                        onError={() => setFailedAvatars(prev => ({ ...prev, [review.id]: true }))}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon className="w-6 h-6 text-accent" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-white text-lg truncate">{review.user?.fullName || review.user?.username || 'Khách hàng'}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap flex items-center gap-1.5 bg-black/40 px-3 py-1 rounded-full border border-gray-800">
                      <Clock className="w-3.5 h-3.5" /> {formatDateTime(review.createdAt)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-4 h-4 ${star <= review.rating ? 'fill-accent text-accent drop-shadow-[0_0_5px_rgba(212,175,55,0.5)]' : 'text-gray-700'}`} 
                      />
                    ))}
                  </div>
                  
                  {review.comment && (
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 bg-black/30 p-4 rounded-xl border border-gray-800/50 shadow-inner">
                      {review.comment}
                    </p>
                  )}

                  {review.reply && (
                    <div className="bg-gradient-to-r from-[rgba(212,175,55,0.05)] to-transparent border-l-4 border-accent p-5 rounded-r-xl relative mt-4 shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest ${
                          review.repliedByRole === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}>
                          {review.repliedByRole} PHẢN HỒI
                        </span>
                        {review.repliedAt && (
                          <span className="text-gray-500 text-[10px] ml-auto flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded-full border border-gray-800">
                            <Clock className="w-3 h-3" /> {formatDateTime(review.repliedAt)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{review.reply}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewList;
