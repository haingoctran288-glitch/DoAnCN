import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Eye, Share2, Link as LinkIcon, ChevronRight, ArrowLeft } from 'lucide-react';
import DOMPurify from 'dompurify'; // Need to sanitize HTML
import ScrollToTop from '../components/ScrollToTop';

const KnowledgeDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticleAndIncrementView = async () => {
      setLoading(true);
      try {
        // Fetch article detail
        const response = await axios.get(`http://localhost:8080/api/public/knowledge/${slug}`);
        setArticle(response.data);
        
        // Fetch related articles
        const relatedRes = await axios.get(`http://localhost:8080/api/public/knowledge/${slug}/related`);
        setRelated(relatedRes.data);
        
        // Increment view count asynchronously
        axios.post(`http://localhost:8080/api/public/knowledge/${slug}/view`).catch(err => console.error(err));
        
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticleAndIncrementView();
  }, [slug]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="bg-primary min-h-screen text-white pt-32 pb-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-primary min-h-screen text-white pt-32 pb-20 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">404 - Không tìm thấy bài viết</h1>
        <Link to="/kienthuc" className="text-accent hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  // Create sanitized HTML for CKEditor content
  // Note: CKEditor generates rich HTML that needs to be displayed properly
  const sanitizedContent = DOMPurify.sanitize(article.content, {
    ADD_TAGS: ['iframe'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
  });

  return (
    <div className="bg-primary min-h-screen text-white pt-24 pb-20">
      {/* Cover Image */}
      <div className="w-full relative bg-[#0a0a0a] pt-12">
        <div 
          className="hidden"
          style={{ 
            backgroundImage: `url(${article.thumbnailImage ? `http://localhost:8080${article.thumbnailImage}` : 'https://placehold.co/1920x1080/111/333?text=HORNET+ROYALE'})`
          }}
        ></div>
        <div className="hidden"></div>
        
        <div className="w-full">
          <div className="container mx-auto px-4 pb-12">
            <div className="max-w-4xl mx-auto relative">
              
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                <Link to="/kienthuc" className="inline-flex items-center w-max text-gray-300 hover:text-black hover:bg-accent transition-all bg-black/40 px-4 py-2 rounded-full border border-gray-700/50 backdrop-blur-sm font-medium text-sm">
                  <ArrowLeft size={16} className="mr-2" /> Quay lại trang Kiến Thức
                </Link>
                
                {/* Breadcrumb */}
                <div className="flex items-center text-sm text-gray-400 font-medium md:ml-auto">
                  <Link to="/" className="hover:text-accent transition-colors">Trang chủ</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <Link to="/kienthuc" className="hover:text-accent transition-colors">Kiến thức</Link>
                  <ChevronRight size={14} className="mx-2" />
                  <span className="text-accent truncate max-w-[150px]">{article.category}</span>
                </div>
              </div>
              
              <div className="inline-block bg-accent/20 text-accent px-4 py-1.5 rounded-full text-sm font-bold border border-accent/30 mb-6 backdrop-blur-sm">
                {article.category}
              </div>
              
              <h1 className="text-3xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center text-gray-300 gap-6 text-sm md:text-base">
                <div className="flex items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                  <Calendar size={16} className="mr-2 text-accent" />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
                <div className="flex items-center bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5">
                  <Eye size={16} className="mr-2 text-accent" />
                  <span>{article.viewCount} lượt xem</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        <div className="flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-[#1a1a1a] p-6 md:p-10 rounded-2xl border border-[#333] shadow-xl">
              
              {/* Full uncropped thumbnail */}
              {article.thumbnailImage && (
                <div className="mb-10 text-center">
                  <img 
                    src={`http://localhost:8080${article.thumbnailImage}`}
                    alt={article.title}
                    className="max-w-full h-auto rounded-xl mx-auto border border-[#333]"
                    style={{ maxHeight: '500px', objectFit: 'contain' }}
                  />
                </div>
              )}
              
              {/* CKEditor Content Rendering */}
              {/* The class ck-content is necessary for CKEditor default styles if imported */}
              <div 
                className="ck-content article-content text-gray-200 leading-relaxed text-lg"
                dangerouslySetInnerHTML={{ __html: sanitizedContent }}
              />
              
              {/* Share Options */}
              <div className="mt-16 pt-8 border-t border-[#333]">
                <h3 className="text-xl font-bold mb-6 flex items-center">
                  <Share2 className="mr-3 text-accent" />
                  Chia sẻ bài viết
                </h3>
                <div className="flex gap-4">
                  <a 
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1877F2] hover:bg-[#1877F2]/80 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </a>
                  <a 
                    href={`https://zalo.me/share?v=3&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0068FF] hover:bg-[#0068FF]/80 transition-colors text-white font-bold text-sm"
                  >
                    Zalo
                  </a>
                  <button 
                    onClick={handleCopyLink}
                    className="flex items-center justify-center w-12 h-12 rounded-full bg-[#333] hover:bg-accent hover:text-black transition-colors group relative"
                  >
                    <LinkIcon size={24} />
                    {copied && (
                      <span className="absolute -top-10 bg-accent text-black text-xs font-bold px-3 py-1 rounded-md whitespace-nowrap">
                        Đã copy!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Related Articles */}
          <div className="lg:w-1/4">
            <div className="sticky top-24">
              <h3 className="text-2xl font-bold mb-6 flex items-center font-heading">
                <span className="w-1.5 h-6 bg-accent mr-3 rounded-full"></span>
                Bài viết liên quan
              </h3>
              
              <div className="flex flex-col gap-6">
                {related.length > 0 ? (
                  related.map(item => (
                    <Link 
                      key={item.id} 
                      to={`/kienthuc/${item.slug}`}
                      className="group bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333] hover:border-accent transition-colors flex flex-col"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img 
                          src={item.thumbnailImage ? `http://localhost:8080${item.thumbnailImage}` : 'https://placehold.co/400x300/222/555?text=HORNET+ROYALE'}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 bg-black/80 text-accent text-[10px] font-bold px-2 py-1 rounded-full border border-accent/30">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold group-hover:text-accent transition-colors line-clamp-2 text-sm mb-2">
                          {item.title}
                        </h4>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center"><Calendar size={12} className="mr-1"/> {new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                          <span className="flex items-center"><Eye size={12} className="mr-1"/> {item.viewCount}</span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-gray-400 bg-[#1a1a1a] p-4 rounded-xl border border-[#333]">
                    Chưa có bài viết liên quan.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global CSS for CKEditor content rendering */}
      <style dangerouslySetInnerHTML={{__html: `
        .article-content h1 { font-size: 2.25rem; font-weight: bold; margin-top: 2rem; margin-bottom: 1rem; color: #d4af37; }
        .article-content h2 { font-size: 1.875rem; font-weight: bold; margin-top: 1.75rem; margin-bottom: 1rem; color: #d4af37; }
        .article-content h3 { font-size: 1.5rem; font-weight: bold; margin-top: 1.5rem; margin-bottom: 1rem; color: #fff; }
        .article-content h4 { font-size: 1.25rem; font-weight: bold; margin-top: 1.25rem; margin-bottom: 0.75rem; color: #fff; }
        .article-content p { margin-bottom: 1.25rem; }
        .article-content img { max-width: 100%; height: auto; border-radius: 0.5rem; margin: 1.5rem auto; display: block; }
        .article-content figure.image { display: table; clear: both; text-align: center; margin: 1em auto; }
        .article-content figure.image img { display: block; margin: 0 auto; max-width: 100%; min-width: 50px; }
        .article-content figure.image figcaption { display: table-caption; caption-side: bottom; word-break: break-word; color: #9ca3af; background-color: #2a2a2a; padding: 0.5rem; font-size: 0.875rem; outline-offset: -1px; }
        .article-content .image-style-side { float: right; margin-left: 1.5rem; max-width: 50%; }
        .article-content .image-style-align-left { float: left; margin-right: 1.5rem; }
        .article-content .image-style-align-center { margin-left: auto; margin-right: auto; }
        .article-content .image-style-align-right { float: right; margin-left: 1.5rem; }
        .article-content blockquote { border-left: 4px solid #d4af37; padding-left: 1rem; margin-left: 0; font-style: italic; color: #9ca3af; background: #2a2a2a; padding: 1rem; border-radius: 0 0.5rem 0.5rem 0; }
        .article-content a { color: #d4af37; text-decoration: none; }
        .article-content a:hover { text-decoration: underline; }
        .article-content ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .article-content ol { list-style-type: decimal; padding-left: 1.5rem; margin-bottom: 1.25rem; }
        .article-content li { margin-bottom: 0.5rem; }
        .article-content table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; border: 1px solid #444; }
        .article-content th, .article-content td { border: 1px solid #444; padding: 0.75rem; text-align: left; }
        .article-content th { background-color: #2a2a2a; font-weight: bold; color: #d4af37; }
        .article-content hr { border: 0; border-top: 1px solid #333; margin: 2rem 0; }
        .article-content pre { background-color: #2a2a2a; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-family: monospace; }
        .article-content code { font-family: monospace; background-color: rgba(212, 175, 55, 0.1); padding: 0.2rem 0.4rem; border-radius: 0.25rem; color: #d4af37; }
        .article-content mark { background-color: rgba(212, 175, 55, 0.3); color: inherit; padding: 0 2px; }
      `}} />

      <ScrollToTop />
    </div>
  );
};

export default KnowledgeDetail;
