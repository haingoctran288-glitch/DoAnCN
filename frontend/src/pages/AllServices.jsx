import React, { useState, useEffect } from 'react';
import { Scissors, Clock, ArrowRight, Loader2, ArrowLeft, Sparkles, User, MapPin, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { normalizeImageUrl } from '../utils/imageUrl';

import ScrollToTop from '../components/ScrollToTop';

const MAIN_CATEGORIES = [
  { value: 'ALL', label: 'Tất cả dịch vụ', icon: <Scissors className="w-4 h-4" /> },
  { value: 'NAM', label: 'Dịch vụ cho Nam', icon: <User className="w-4 h-4" /> },
  { value: 'NU', label: 'Dịch vụ cho Nữ', icon: <Sparkles className="w-4 h-4" /> }
];

// SUB_CATEGORIES dynamically generated from services

// URL map
const PATH_MAP = {
  'all': 'ALL',
  'nam': 'NAM',
  'nu': 'NU'
};

const REVERSE_PATH_MAP = {
  'ALL': 'all',
  'NAM': 'nam',
  'NU': 'nu'
};

const AllServices = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  
  const initialMain = type ? (PATH_MAP[type] || 'ALL') : 'ALL';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMainCategory, setActiveMainCategory] = useState(initialMain);
  const [activeSubCategory, setActiveSubCategory] = useState('all');

  const BACKEND_URL = 'http://localhost:8080';

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (type && PATH_MAP[type]) {
      setActiveMainCategory(PATH_MAP[type]);
    } else {
      setActiveMainCategory('ALL');
    }
    setActiveSubCategory('all');
  }, [type]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BACKEND_URL}/api/services`);
        
        let allServices = res.data.filter(s => s.status === 'active');
        
        // Sắp xếp: khi xem tất cả dùng globalSortOrder (độc lập với per-category)
        allServices.sort((a, b) => (a.globalSortOrder || 0) - (b.globalSortOrder || 0));

        setServices(allServices);
      } catch (err) {
        console.error('Lỗi khi tải dịch vụ:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleMainTabClick = (val) => {
    setActiveMainCategory(val);
    setActiveSubCategory('all');
    if (val === 'ALL') {
      navigate('/services');
    } else {
      navigate(`/services/${REVERSE_PATH_MAP[val]}`);
    }
  };

  const getPageTitle = () => {
    const cat = MAIN_CATEGORIES.find(c => c.value === activeMainCategory);
    return cat ? cat.label : 'Dịch vụ';
  };

  const filteredByMain = activeMainCategory === 'ALL'
    ? services
    : services.filter(s => s.mainCategory === activeMainCategory);

  // Dynamically extract model types from filteredByMain
  const dynamicSubCategories = [{ value: 'all', label: 'Tất cả' }];
  const modelTypeNames = new Set();
  filteredByMain.forEach(s => {
    const mName = s.modelType?.name;
    if (mName && !modelTypeNames.has(mName)) {
      modelTypeNames.add(mName);
      dynamicSubCategories.push({ value: mName, label: mName });
    }
  });

  // Sort sub-categories according to specific priority
  const PRIORITY = {
    'all': 1,
    'cắt': 2,
    'tỉa': 2,
    'phục hồi': 3,
    'chăm sóc': 4,
    'uốn': 5,
    'nhuộm': 6
  };

  const getPriority = (label) => {
    const l = label.toLowerCase();
    if (l === 'tất cả') return 1;
    for (const key in PRIORITY) {
      if (l.includes(key)) return PRIORITY[key];
    }
    return 99; // unknown branches go to the end
  };

  dynamicSubCategories.sort((a, b) => {
    const pA = getPriority(a.label);
    const pB = getPriority(b.label);
    if (pA === pB) return a.label.localeCompare(b.label);
    return pA - pB;
  });

  const filteredServices = activeSubCategory === 'all'
    ? activeMainCategory === 'ALL'
      ? filteredByMain.slice().sort((a, b) => (a.globalSortOrder || 0) - (b.globalSortOrder || 0))
      : filteredByMain.slice().sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    : filteredByMain
        .filter(s => s.modelType?.name === activeSubCategory)
        .slice().sort((a, b) => (a.modelSortOrder || 0) - (b.modelSortOrder || 0));


  const displayServices = filteredServices;

  return (
    <div className="min-h-screen pt-32 pb-24 bg-primary text-gray-300 font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-accent hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-sm uppercase tracking-wider">Quay lại</span>
          </button>
        </div>

        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-[2px] bg-accent"></div>
            <span className="text-accent text-sm font-bold uppercase tracking-[4px]">Hệ thống dịch vụ</span>
            <div className="w-12 h-[2px] bg-accent"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-6">
            {getPageTitle()}
          </h1>
        </div>

        {/* Level 1: Main Categories */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-[#111] p-1.5 rounded-2xl border border-gray-800 shadow-2xl overflow-x-auto no-scrollbar max-w-full">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleMainTabClick(cat.value)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap ${
                  activeMainCategory === cat.value
                    ? 'bg-accent text-primary font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                    : 'text-gray-500 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.icon}
                <span className="text-sm font-medium tracking-wide">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Level 2: Sub Categories */}
        {activeMainCategory !== 'ALL' && (
          <div className="flex justify-center mb-16">
            <div className="flex flex-wrap justify-center gap-2 max-w-full">
              {dynamicSubCategories.map((sub) => (
                <button
                  key={sub.value}
                  onClick={() => setActiveSubCategory(sub.value)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 whitespace-nowrap text-sm font-medium ${
                    activeSubCategory === sub.value
                      ? 'bg-accent/10 border-accent/50 text-accent shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                      : 'bg-[#0a0a0a] border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-600'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Section */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 text-accent animate-spin" />
            <p className="text-gray-500 animate-pulse">Đang tìm kiếm dịch vụ tốt nhất...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-32 bg-[#111] rounded-[32px] border border-dashed border-gray-800" data-aos="fade-up">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Scissors className="w-10 h-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Chưa có dịch vụ nào</h3>
            <p className="text-gray-500 mb-8">Danh mục này hiện chưa có dịch vụ khả dụng. Vui lòng quay lại sau!</p>
          </div>
        ) : (
          <div className="space-y-16">
            {displayServices.length > 0 && (
                <div data-aos="fade-up">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/30">
                      <Scissors className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-heading font-black text-white uppercase tracking-[4px]">
                        Danh sách <span className="text-accent">dịch vụ</span>
                      </h2>
                      <p className="text-gray-500 text-sm font-medium tracking-wide">Chăm sóc chuyên sâu từng nhu cầu của bạn</p>
                    </div>
                    <div className="flex-grow h-[1px] bg-gradient-to-r from-accent/30 to-transparent"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayServices.map((service, index) => (
                      <div 
                        key={service.id}
                        className="group relative bg-[#111] border border-gray-800/50 rounded-[32px] overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:border-accent/40 hover:shadow-[0_30px_70px_rgba(0,0,0,0.7)] flex flex-col h-full"
                        data-aos="fade-up"
                        data-aos-delay={(index % 3) * 100}
                      >
                        <div className="h-60 overflow-hidden relative">
                          <img 
                            src={service.image?.startsWith('http') ? service.image : normalizeImageUrl(service.image)} 
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop'; }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-95"></div>
                          
                          <div className="absolute bottom-5 right-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-accent" />
                            <span className="text-[11px] font-black text-white uppercase tracking-wider">{service.duration} phút</span>
                          </div>
                        </div>

                        <div className="p-10 flex flex-col flex-grow">
                          <h3 className="text-2xl font-heading font-black text-white mb-4 group-hover:text-accent transition-colors leading-tight">
                            {service.name}
                          </h3>
                          
                          <p className="text-gray-500 mb-8 text-sm leading-relaxed flex-grow font-medium">
                            {service.description}
                          </p>
                          
                          <div className="pt-8 border-t border-gray-800/50 flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-[9px] text-gray-600 uppercase tracking-[2px] font-black mb-1">Giá dịch vụ</span>
                              <span className="text-2xl font-heading font-black text-accent">
                                {Number(service.price).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                            
                            <button 
                              onClick={() => navigate('/booking', { state: { serviceId: service.id } })}
                              className="bg-accent/10 hover:bg-accent text-accent hover:text-primary font-black px-6 py-4 rounded-2xl transition-all duration-300 flex items-center gap-2 border border-accent/20 transform active:scale-95"
                            >
                              <span className="text-[10px] uppercase tracking-wider">Đặt ngay</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        )}

        <div className="mt-24 p-10 lg:p-12 rounded-[32px] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-gray-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-16 h-16 bg-accent/10 rounded-[20px] flex items-center justify-center shrink-0 border border-accent/20">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div>
              <h4 className="text-white font-bold text-2xl mb-2">Ưu đãi trải nghiệm đầu tiên?</h4>
              <p className="text-gray-500 max-w-md">Giảm ngay <span className="text-accent font-bold">10%</span> cho khách hàng lần đầu sử dụng dịch vụ tại Barber Shop.</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/booking')}
            className="whitespace-nowrap px-10 py-5 bg-accent text-primary font-bold rounded-2xl hover:bg-white transition-all duration-500 relative z-10 shadow-2xl"
          >
            Nhận ưu đãi ngay
          </button>
        </div>
      </div>

      <style>{`
        @keyframes border-flow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-border-flow {
          animation: border-flow 3s linear infinite;
        }
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

export default AllServices;
