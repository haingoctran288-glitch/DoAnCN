import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, RotateCcw, Eye, Calendar, ChevronRight } from 'lucide-react';
import axios from 'axios';
import ScrollToTop from '../components/ScrollToTop';

const Knowledge = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [category, setCategory] = useState('Tất cả');
  const [sort, setSort] = useState('Mới nhất');
  const [keyword, setKeyword] = useState('');
  const [searchInput, setSearchInput] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const size = 12;

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/public/knowledge', {
        params: { category, sort, keyword, page, size }
      });
      setArticles(response.data.content);
      setTotal(response.data.totalElements);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [category, sort, keyword, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setKeyword(searchInput);
    setPage(0);
  };

  const handleReset = () => {
    setCategory('Tất cả');
    setSort('Mới nhất');
    setKeyword('');
    setSearchInput('');
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    const HH = String(date.getHours()).padStart(2, '0');
    const MM = String(date.getMinutes()).padStart(2, '0');
    return `${dd}/${mm}/${yyyy} ${HH}:${MM}`;
  };

  const categories = ['Tất cả', 'Dịch vụ Nam', 'Dịch vụ Nữ', 'Sản phẩm'];

  return (
    <div className="bg-primary min-h-screen text-white pt-24 pb-20">
      {/* Banner */}
      <div className="relative bg-[#111] py-20 mb-12 border-b border-[#333]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-accent mb-6 uppercase tracking-wider">
            Kiến Thức & Cẩm Nang
          </h1>
          <div className="w-24 h-1 bg-accent mx-auto mb-6"></div>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Cập nhật xu hướng tóc, chăm sóc tóc, chăm sóc da và sản phẩm mới nhất từ HORNET ROYALE.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Sticky Filter Bar */}
        <div className="sticky top-20 z-40 bg-[#1a1a1a] p-4 rounded-xl border border-[#333] shadow-lg mb-10 shadow-black/50">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Category Buttons */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(0); }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    category === cat 
                      ? 'bg-accent text-black' 
                      : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
              {/* Search */}
              <form onSubmit={handleSearch} className="relative flex-grow lg:flex-grow-0">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full lg:w-64 bg-[#2a2a2a] border border-[#444] text-white px-4 py-2 pl-10 rounded-lg focus:outline-none focus:border-accent transition-colors"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </form>

              {/* Sort */}
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(0); }}
                className="bg-[#2a2a2a] border border-[#444] text-white px-4 py-2 rounded-lg focus:outline-none focus:border-accent cursor-pointer"
              >
                <option value="Mới nhất">Mới nhất</option>
                <option value="Cũ nhất">Cũ nhất</option>
              </select>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="p-2 bg-[#2a2a2a] text-gray-400 rounded-lg hover:bg-[#333] hover:text-white transition-colors"
                title="Làm mới"
              >
                <RotateCcw size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Article Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse bg-[#1a1a1a] rounded-xl overflow-hidden h-[400px]">
                <div className="h-48 bg-[#2a2a2a]"></div>
                <div className="p-5">
                  <div className="h-4 bg-[#2a2a2a] rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-[#2a2a2a] rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-full mb-2"></div>
                  <div className="h-4 bg-[#2a2a2a] rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {articles.map((article) => (
                <div 
                  key={article.id} 
                  className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] hover:border-accent transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
                >
                  <Link to={`/kienthuc/${article.slug}`} className="block relative h-48 overflow-hidden">
                    <img
                      src={article.thumbnailImage ? `http://localhost:8080${article.thumbnailImage}` : 'https://placehold.co/600x400/222/555?text=HORNET+ROYALE'}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-accent text-xs font-bold px-3 py-1 rounded-full border border-accent/30">
                      {article.category}
                    </div>
                  </Link>
                  
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center text-gray-400 text-xs mb-3 space-x-4">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(article.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1" />
                        {article.viewCount}
                      </div>
                    </div>
                    
                    <Link to={`/kienthuc/${article.slug}`}>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-grow">
                      {article.shortDescription}
                    </p>
                    
                    <Link 
                      to={`/kienthuc/${article.slug}`}
                      className="inline-flex items-center text-accent font-medium hover:text-white transition-colors mt-auto"
                    >
                      Đọc ngay <ChevronRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {total > size && (
              <div className="flex justify-center mt-12 space-x-2">
                {[...Array(Math.ceil(total / size))].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setPage(idx);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                      page === idx 
                        ? 'bg-accent text-black' 
                        : 'bg-[#2a2a2a] text-gray-300 hover:bg-[#333] hover:text-accent border border-[#444]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 bg-[#1a1a1a] rounded-xl border border-[#333]">
            <Search size={48} className="mx-auto text-gray-500 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">Không tìm thấy bài viết nào</h3>
            <p className="text-gray-400 mb-6">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            <button 
              onClick={handleReset}
              className="px-6 py-2 bg-accent text-black font-bold rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Làm mới bộ lọc
            </button>
          </div>
        )}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default Knowledge;
