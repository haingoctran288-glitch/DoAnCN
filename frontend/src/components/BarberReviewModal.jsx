import React from 'react';
import { X, Star, MapPin, Award, User } from 'lucide-react';
import ReviewList from './ReviewList';

const BASE_URL = 'http://localhost:8080';

const getAvatarUrl = (avatar) => {
  if (!avatar) return null;
  if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
  return BASE_URL + avatar;
};

const BarberReviewModal = ({ barber, onClose }) => {
  if (!barber) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-[#111] rounded-3xl border border-gray-800 shadow-[0_0_50px_rgba(212,175,55,0.1)] w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black text-gray-400 hover:text-white rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Barber Header Info */}
          <div className="relative p-6 sm:p-10 border-b border-gray-800 bg-gradient-to-b from-[#1a1a1a] to-[#111]">
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
              {/* Avatar */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-[#222] shadow-[0_0_20px_rgba(212,175,55,0.2)] overflow-hidden flex-shrink-0">
                {barber.avatar ? (
                  <img src={getAvatarUrl(barber.avatar)} alt={barber.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#222] flex items-center justify-center">
                    <User className="w-12 h-12 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-2">{barber.name}</h2>
                <p className="text-accent text-sm font-bold uppercase tracking-[2px] mb-4">
                  {barber.specialty || 'Chuyên gia tạo mẫu tóc'}
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm mb-4">
                  <div className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Star className="w-4 h-4 text-accent fill-accent" />
                    <span className="text-white font-bold">{barber.rating > 0 ? Number(barber.rating).toFixed(1) : '0.0'}</span>
                    <span>/ 5.0</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <Award className="w-4 h-4 text-accent" />
                    <span className="text-white font-bold">{barber.experienceYears || 0} năm</span>
                    <span>Kinh nghiệm</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    <MapPin className="w-4 h-4 text-accent" />
                    <span className="text-white font-bold">{barber.branch || 'Tất cả'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="p-6 sm:p-10 bg-[#111]">
            <ReviewList type="barber" itemId={barber.id} hideTitle={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberReviewModal;
