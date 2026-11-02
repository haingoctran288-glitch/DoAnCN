import React, { useState, useEffect } from 'react';
import { getAllNews } from '../api/news';
import { Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop';

const CATEGORIES = {
  'nam': 'Dịch vụ Nam',
  'nu': 'Dịch vụ Nữ',
  'tong-do': 'Tông đơ',
  'keo-cat-tia': 'Kéo cắt & tỉa',
  'may-lam-toc': 'Máy làm tóc',
  'gom-xit-toc': 'Gôm xịt tóc',
  'sap-vuot-toc': 'Sáp vuốt tóc',
  'san-pham-duong-toc': 'Sản phẩm dưỡng tóc',
  'khac': 'Khác'
};

const News = () => {
  const navigate = useNavigate();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('ALL');
  const [activeSubCat, setActiveSubCat] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeType, activeSubCat]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await getAllNews();
        setNewsList(res.data);
      } catch (error) {
        console.error('Lỗi khi tải tin tức', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const filteredNews = newsList.filter(item => {
    if (activeType !== 'ALL' && item.type !== activeType) return false;
    if (activeSubCat !== 'ALL' && item.categorySlug !== activeSubCat) return false;
    return true;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Data for submenus
  const SUB_CATEGORIES = {
    SERVICE: [
      { id: 'nam', label: 'Dịch vụ Nam' },
      { id: 'nu', label: 'Dịch vụ Nữ' }
    ],
    PRODUCT: [
      { id: 'tong-do', label: 'Tông đơ' },
      { id: 'keo-cat-tia', label: 'Kéo cắt & tỉa' },
      { id: 'may-lam-toc', label: 'Máy làm tóc' },
      { id: 'gom-xit-toc', label: 'Gôm xịt tóc' },
      { id: 'sap-vuot-toc', label: 'Sáp vuốt tóc' },
      { id: 'san-pham-duong-toc', label: 'Sản phẩm dưỡng tóc' },
      { id: 'khac', label: 'Khác' }
    ]
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen font-sans text-gray-300">
      <div className="pt-32 pb-16 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="font-heading text-4xl md:text-5xl font-black tracking-[0.15em] uppercase text-white mb-4">
            Tin Tức <span className="text-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">Và Sự Kiện</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Cập nhật những xu hướng tóc mới nhất, kiến thức chăm sóc tóc và các thông tin nổi bật từ Hornet Royale.
          </p>
        </div>

        <div className="flex flex-col items-center mb-12">
          {/* Main Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <button 
              onClick={() => { setActiveType('ALL'); setActiveSubCat('ALL'); }}
              className={`px-6 py-2 rounded-full uppercase text-sm font-bold tracking-wider transition-all duration-300 ${activeType === 'ALL' ? 'bg-accent text-primary' : 'bg-[#1a1a1a] text-gray-400 hover:text-accent border border-gray-800'}`}
            >
              Tất cả
            </button>
            <button 
              onClick={() => { setActiveType('SERVICE'); setActiveSubCat('ALL'); }}
              className={`px-6 py-2 rounded-full uppercase text-sm font-bold tracking-wider transition-all duration-300 ${activeType === 'SERVICE' ? 'bg-accent text-primary' : 'bg-[#1a1a1a] text-gray-400 hover:text-accent border border-gray-800'}`}
            >
              Dịch vụ
            </button>
            <button 
              onClick={() => { setActiveType('PRODUCT'); setActiveSubCat('ALL'); }}
              className={`px-6 py-2 rounded-full uppercase text-sm font-bold tracking-wider transition-all duration-300 ${activeType === 'PRODUCT' ? 'bg-accent text-primary' : 'bg-[#1a1a1a] text-gray-400 hover:text-accent border border-gray-800'}`}
            >
              Sản phẩm
            </button>
          </div>

          {/* Sub Filter */}
          {activeType !== 'ALL' && SUB_CATEGORIES[activeType] && (
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up">
              <button
                onClick={() => setActiveSubCat('ALL')}
                className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${activeSubCat === 'ALL' ? 'bg-white/10 text-white border border-white/20' : 'bg-transparent text-gray-500 hover:text-gray-300 border border-gray-800'}`}
              >
                Tất cả {activeType === 'SERVICE' ? 'Dịch vụ' : 'Sản phẩm'}
              </button>
              {SUB_CATEGORIES[activeType].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubCat(sub.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all duration-300 ${activeSubCat === sub.id ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-transparent text-gray-500 hover:text-gray-300 border border-gray-800'}`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-20 text-gray-500 flex flex-col items-center">
            <Newspaper size={48} className="mb-4 opacity-50" />
            <p className="text-xl">Chưa có bài viết nào được đăng tải.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentItems.map(item => (
                <div 
                  key={item.id} 
                  onClick={() => navigate(`/news/${item.id}`)}
                  className="bg-[#111] rounded-2xl overflow-hidden border border-[#222] hover:border-accent transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer flex flex-col"
                >
                  <div className="h-48 overflow-hidden relative flex-shrink-0">
                    {item.thumbnail ? (
                      <img 
                        src={`http://localhost:8080${item.thumbnail}`} 
                        alt={item.title} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <Newspaper size={48} className="text-gray-600" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-accent text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {CATEGORIES[item.categorySlug] || item.categorySlug}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-accent transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-gray-400 line-clamp-3 text-sm mb-4" dangerouslySetInnerHTML={{ __html: item.content }} />
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span className="text-accent uppercase tracking-wider font-bold hover:underline">Xem thêm</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8 animate-fade-in-up">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handlePageChange(index + 1)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentPage === index + 1
                        ? 'bg-accent text-primary shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                        : 'bg-[#1a1a1a] text-gray-400 border border-gray-800 hover:border-accent/50 hover:text-white'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default News;
