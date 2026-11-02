import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, User, ArrowLeft, MapPin, Award } from 'lucide-react';
import { getStaff } from '../api/staff';
import ScrollToTop from '../components/ScrollToTop';
import BarberReviewModal from '../components/BarberReviewModal';

const BASE_URL = 'http://localhost:8080';

const ChooseBarber = () => {
  const navigate = useNavigate();
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [reviewModalBarber, setReviewModalBarber] = useState(null);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getStaff();
        setBarbers(data);
      } catch (error) {
        console.error('Failed to fetch staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const getAvatarUrl = (avatar) => {
    if (!avatar) return null;
    if (avatar.startsWith('http') || avatar.startsWith('data:')) return avatar;
    return BASE_URL + avatar;
  };

  const branches = ['all', ...new Set(barbers.map(b => b.branch).filter(Boolean))];

  const filteredBarbers = selectedBranch === 'all' 
    ? barbers 
    : barbers.filter(b => b.branch === selectedBranch);

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-accent hover:text-white transition-colors group relative z-10"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wider">Quay lại</span>
          </button>
        </div>

        <div className="text-center mb-12 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-accent"></div>
            <span className="text-accent text-sm font-bold uppercase tracking-[4px]">Đội ngũ chuyên gia</span>
            <div className="w-12 h-[2px] bg-accent"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">Chọn Thợ Cắt Tóc</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Gặp gỡ đội ngũ Barber chuyên nghiệp, giàu kinh nghiệm. Hãy chọn người thợ phù hợp để gửi gắm phong cách của bạn.
          </p>
        </div>

        {/* Branch Filter (Horizontal Tabs) */}
        <div className="flex justify-center mb-16 relative z-10">
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-gray-800 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setSelectedBranch('all')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                selectedBranch === 'all'
                  ? 'bg-accent text-primary font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-sm font-medium tracking-wide">Tất cả chi nhánh</span>
            </button>
            {branches.filter(b => b !== 'all').map(branch => (
              <button
                key={branch}
                onClick={() => setSelectedBranch(branch)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  selectedBranch === branch
                    ? 'bg-accent text-primary font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium tracking-wide">{branch}</span>
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : filteredBarbers.length === 0 ? (
          <div className="flex justify-center items-center h-64 text-gray-400">
            Không tìm thấy thợ cắt tóc nào ở chi nhánh này.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {filteredBarbers.map(barber => (
              <div key={barber.id} className="bg-[#1a1a1a] rounded-xl border border-[#2a2a2a] overflow-hidden group hover:border-[#c9a84c] transition-all duration-300 ease-in-out hover:-translate-y-[6px] flex flex-col h-full shadow-lg">
                <div className="h-72 overflow-hidden relative flex justify-center items-center bg-[#111]">
                  {barber.avatar ? (
                    <img 
                      src={getAvatarUrl(barber.avatar)} 
                      alt={barber.name} 
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <User size={64} className="text-gray-600 group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">{barber.name}</h3>

                  {barber.rating && barber.rating > 0 ? (
                    <div className="flex items-center text-[#c9a84c] mb-4">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="ml-1.5 font-bold">{Number(barber.rating).toFixed(1)}</span>
                      <span className="ml-1 text-gray-500 text-sm">/ 5.0</span>
                    </div>
                  ) : (
                    <div className="mb-4 text-sm text-[#c9a84c] italic tracking-wider">
                      Chưa có đánh giá
                    </div>
                  )}
                  
                  <div className="mb-6 flex-grow flex flex-col gap-3">
                    <div className="text-sm leading-snug">
                      <span className="text-xs text-gray-500 uppercase tracking-wide mr-2">Chuyên môn:</span>
                      <span className="text-gray-200 font-medium">
                        {barber.specialty || 'Chưa cập nhật'}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-2 text-sm text-gray-400">
                        <Award className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                        <span>Thâm niên: <span className="text-gray-200 font-medium">{barber.experienceYears || 0} năm</span></span>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-400">
                        <MapPin className="w-4 h-4 text-[#c9a84c] shrink-0 mt-0.5" />
                        <span className="whitespace-nowrap">Chi nhánh:</span>
                        <span className="text-gray-200 font-medium leading-snug">
                          {barber.branch || 'Chưa cập nhật'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  
                  <div className="mt-auto flex flex-col gap-2">
                    <button
                      onClick={() => setReviewModalBarber(barber)}
                      className="w-full flex items-center justify-center gap-2 bg-transparent text-[#c9a84c] border border-[#c9a84c] font-bold py-2.5 px-6 rounded-lg transition-all duration-300 hover:bg-[#c9a84c]/10 active:scale-95 uppercase tracking-widest text-xs"
                    >
                      Xem Đánh Giá
                    </button>
                    <Link
                      to={`/contact-barber/${barber.id}`}
                      className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-primary font-bold py-3 px-6 rounded-lg transition-all duration-300 hover:bg-[#b39543] hover:-translate-y-1 hover:shadow-[0_5px_15px_rgba(201,168,76,0.4)] active:scale-95 uppercase tracking-widest text-sm"
                    >
                      Chọn Thợ
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BarberReviewModal 
        barber={reviewModalBarber} 
        onClose={() => setReviewModalBarber(null)} 
      />
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <ScrollToTop />
    </div>
  );
};

export default ChooseBarber;
