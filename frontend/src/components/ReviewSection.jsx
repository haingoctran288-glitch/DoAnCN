import React, { useState, useEffect } from 'react';
import { Star, MessageCircle, Send, CheckCircle2, User as UserIcon } from 'lucide-react';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const RATING_EMOJIS = {
  1: { emoji: '😢', text: 'Tệ' },
  2: { emoji: '😞', text: 'Không hài lòng' },
  3: { emoji: '😐', text: 'Bình thường' },
  4: { emoji: '😊', text: 'Hài lòng' },
  5: { emoji: '😍', text: 'Tuyệt vời' }
};

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return `http://localhost:8080${avatar}`;
};

const ReviewSection = ({ type, itemId, transactionId, status, isCompleted, itemName, itemImage }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [existingReview, setExistingReview] = useState(null);
  
  const { addToast } = useToast();
  const userId = parseInt(localStorage.getItem('userId'));
  
  useEffect(() => {
    // Kiem tra xem user da danh gia chua
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/reviews/${type}/${itemId}`);
        const reviews = res.data || [];
        const myReview = reviews.find(r => 
          r.user.id === userId && 
          (type === 'barber' ? r.bookingId === transactionId : r.orderId === transactionId)
        );
        if (myReview) {
          setHasReviewed(true);
          setExistingReview(myReview);
        }
      } catch (err) {
        console.error("Lỗi fetch reviews:", err);
      }
    };
    if (itemId) fetchReviews();
  }, [type, itemId, transactionId, userId]);

  if (!isCompleted && !hasReviewed) {
    return (
      <div className="bg-[#111] rounded-2xl border border-gray-800 p-8 text-center mt-8">
        <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Đánh giá {type === 'barber' ? 'Nhân viên' : 'Sản phẩm'}</h3>
        <p className="text-gray-400">Bạn có thể đánh giá và nêu cảm nhận sau khi đơn hàng hoặc dịch vụ bạn chọn hoàn thành.</p>
      </div>
    );
  }

  const handleCompleteClick = () => {
    if (rating === 0) {
      addToast({ title: 'Lỗi', message: 'Vui lòng chọn số sao đánh giá', type: 'remove' });
      return;
    }
    setShowConfirm(true);
  };

  const submitReview = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        userId,
        rating,
        comment
      };
      if (type === 'barber') {
        payload.barberId = itemId;
        payload.bookingId = transactionId;
      } else {
        payload.productId = itemId;
        payload.orderId = transactionId;
      }
      
      const res = await axios.post(`http://localhost:8080/api/reviews/${type}`, payload);
      setHasReviewed(true);
      setExistingReview(res.data);
      setShowConfirm(false);
      addToast({ title: 'Thành công', message: 'Cảm ơn bạn đã đánh giá!' });
    } catch (err) {
      addToast({ title: 'Lỗi', message: err.response?.data?.message || 'Không thể gửi đánh giá', type: 'remove' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (hasReviewed && existingReview) {
    return (
      <div className="bg-[#111] rounded-2xl border border-gray-800 p-6 mt-8">
        <h3 className="text-lg font-bold text-accent mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> Đánh giá của bạn
        </h3>
        
        <div className="bg-[#1a1a1a] rounded-xl p-5 border border-gray-700 relative">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden">
              {existingReview.user?.avatar ? (
                <img src={getAvatarUrl(existingReview.user.avatar)} alt="" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-6 h-6 text-gray-500" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-white">{existingReview.user?.fullName}</span>
                <span className="text-xs text-gray-500">
                  {new Date(existingReview.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
              
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    className={`w-4 h-4 ${star <= existingReview.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
                <span className="ml-2 text-sm text-yellow-400 font-bold">{existingReview.rating} sao</span>
              </div>
              
              {existingReview.comment && (
                <p className="text-gray-300 text-sm bg-[#222] p-3 rounded-lg">{existingReview.comment}</p>
              )}

              {/* Phản hồi từ Admin/Editor */}
              {existingReview.reply && (
                <div className="mt-5 bg-gradient-to-r from-[rgba(212,175,55,0.05)] to-transparent border-l-4 border-accent p-4 rounded-r-lg relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      existingReview.repliedByRole === 'ADMIN' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}>
                      {existingReview.repliedByRole} ĐÃ TRẢ LỜI
                    </span>
                    {existingReview.repliedAt && (
                      <span className="text-gray-500 text-[10px] ml-auto">
                        {new Date(existingReview.repliedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{existingReview.reply}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const displayRating = hoverRating || rating;
  const currentEmoji = RATING_EMOJIS[Math.ceil(displayRating)] || { emoji: '🤔', text: 'Chưa đánh giá' };

  return (
    <div className="bg-gradient-to-b from-[#1a1a1a] to-[#111] rounded-3xl border border-[#333] p-8 md:p-12 mt-12 shadow-[0_10px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      
      <div className="text-center mb-10 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-[1px] bg-accent/50"></div>
          <span className="text-accent text-xs font-bold uppercase tracking-[4px]">Cảm nhận của bạn</span>
          <div className="w-12 h-[1px] bg-accent/50"></div>
        </div>
        <h3 className="text-3xl font-heading font-bold text-white uppercase tracking-wider">
          Đánh giá {type === 'barber' ? 'Dịch vụ' : 'Sản phẩm'}
        </h3>
      </div>
      
      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* Item Info */}
        <div className="flex items-center gap-5 bg-white/5 backdrop-blur-sm px-8 py-4 rounded-2xl border border-white/10 shadow-lg">
           {itemImage ? (
             <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-accent to-yellow-600">
               <img src={itemImage} alt={itemName} className="w-full h-full rounded-full object-cover border-2 border-[#111]" />
             </div>
           ) : (
             <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-accent to-yellow-600 p-[2px]">
               <div className="w-full h-full rounded-full bg-[#111] flex items-center justify-center">
                 {type === 'barber' ? <UserIcon className="w-6 h-6 text-accent" /> : <Star className="w-6 h-6 text-accent" />}
               </div>
             </div>
           )}
           <div>
             <p className="text-xs text-accent uppercase tracking-widest mb-1 font-bold">{type === 'barber' ? 'Thợ thực hiện' : 'Sản phẩm'}</p>
             <p className="font-heading font-bold text-white text-xl">{itemName}</p>
           </div>
        </div>

        {/* Stars */}
        <div className="flex flex-col items-center">
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <div 
                key={star}
                className="relative cursor-pointer"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
              >
                <Star 
                  className={`w-12 h-12 transition-all duration-300 ${
                    star <= displayRating 
                      ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] scale-110' 
                      : 'text-gray-700'
                  }`} 
                />
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-3 bg-gray-800/50 px-6 py-2 rounded-full">
            <span className="text-3xl animate-bounce">{currentEmoji.emoji}</span>
            <span className="text-yellow-400 font-bold text-lg">{currentEmoji.text}</span>
          </div>
        </div>

        {/* Comment */}
        <div className="w-full max-w-2xl relative">
          <div className="absolute inset-0 bg-accent/5 rounded-2xl blur-xl transition-opacity duration-300 opacity-0 focus-within:opacity-100"></div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về trải nghiệm này (không bắt buộc)..."
            className="w-full relative z-10 bg-black/40 border border-gray-700 rounded-2xl p-5 text-white placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent min-h-[140px] resize-none text-sm transition-all shadow-inner"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleCompleteClick}
          className="bg-accent hover:bg-accent/90 text-black font-bold py-3 px-10 rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] flex items-center gap-2"
        >
          <Send className="w-5 h-5" /> Hoàn thành đánh giá
        </button>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#111] border border-gray-700 rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2 text-center">Xác nhận đánh giá</h3>
            <p className="text-gray-400 text-center text-sm mb-6">
              Bạn có chắc chắn với đánh giá {rating} sao và những phản hồi này không? Mỗi khách hàng chỉ được đánh giá 1 lần.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-700 text-white font-bold hover:bg-gray-800 transition-colors"
              >
                Sửa lại
              </button>
              <button 
                onClick={submitReview}
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-lg bg-accent text-black font-bold hover:bg-accent/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Đang gửi...' : 'Chắc chắn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
