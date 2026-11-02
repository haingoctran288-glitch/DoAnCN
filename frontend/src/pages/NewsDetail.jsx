import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowLeft, Clock, Tag, Newspaper, Ticket, Gift, CheckCircle, AlertCircle } from 'lucide-react';
import { claimVoucher, getMyVouchers } from '../api/voucher';
import ScrollToTop from '../components/ScrollToTop';
import { getNewsById } from '../api/news';
import { useToast } from '../context/ToastContext';

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

const NEWS_TYPES = {
  SERVICE: 'Dịch vụ',
  PRODUCT: 'Sản phẩm'
};

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('token');
  const [claimStatus, setClaimStatus] = useState('IDLE'); // IDLE, CLAIMING, CLAIMED, EXHAUSTED
  const [claimMessage, setClaimMessage] = useState('');
  const { addToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchNewsDetail = async () => {
      try {
        const res = await getNewsById(id);
        setNews(res.data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết tin tức:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  useEffect(() => {
    const checkClaimStatus = async () => {
      if (!news?.attachedVoucher) return;
      const v = news.attachedVoucher;

      if (v.totalQuantity > 0 && v.usedQuantity >= v.totalQuantity) {
        setClaimStatus('EXHAUSTED');
        return;
      }

      if (isLoggedIn) {
        try {
          const userId = localStorage.getItem('userId');
          if (userId) {
            const res = await getMyVouchers(userId);
            const myVouchers = res.data || [];
            const alreadyClaimed = myVouchers.some(cv => cv.voucher.id === v.id);
            if (alreadyClaimed) {
              setClaimStatus('CLAIMED');
              setClaimMessage('Bạn đã nhận voucher này rồi nhé!');
            }
          }
        } catch (error) {
          console.error('Lỗi khi kiểm tra voucher:', error);
        }
      }
    };

    checkClaimStatus();
  }, [news, isLoggedIn]);

  const handleClaimVoucher = async () => {
    if (!isLoggedIn) {
      navigate('/login', { state: { from: `/news/${id}` } });
      return;
    }

    if (!news?.attachedVoucher) return;

    setClaimStatus('CLAIMING');
    try {
      // Assuming claimVoucher API exists in frontend
      await claimVoucher(news.attachedVoucher.id);
      setClaimStatus('CLAIMED');
      setClaimMessage('Bạn đã nhận Voucher thành công!');
      addToast({
        title: 'NHẬN VOUCHER THÀNH CÔNG',
        message: `Bạn đã nhận thành công voucher ${news.attachedVoucher.name}. Mở ví để kiểm tra nhé!`,
        type: 'success',
      });
    } catch (error) {
      const msg = error.response?.data?.message || 'Lỗi khi nhận voucher';
      if (msg === 'Bạn đã nhận voucher này rồi!') {
        setClaimStatus('CLAIMED');
        addToast({
          title: 'VOUCHER ĐÃ TRONG VÍ',
          message: 'Bạn đã nhận voucher này rồi nhé!',
          type: 'success',
        });
      } else if (msg === 'Voucher này đã hết số lượng phát hành!') {
        setClaimStatus('EXHAUSTED');
      } else {
        setClaimStatus('IDLE');
        addToast({
          title: 'LỖI NHẬN VOUCHER',
          message: msg,
          type: 'error',
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Đang tải nội dung...</p>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center p-4 py-32">
        <Newspaper size={64} className="text-gray-600 mb-4" />
        <h2 className="text-2xl text-white font-bold mb-4">Bài viết không tồn tại</h2>
        <button
          onClick={() => navigate('/news')}
          className="text-accent hover:text-white border border-accent hover:border-white px-6 py-2 rounded-full transition-all flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Quay lại Tin Tức
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0a] font-sans text-gray-300">

      <div className="pt-24 md:pt-32 pb-16 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-800 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="font-medium tracking-wide uppercase text-sm">Quay lại</span>
        </button>

        {/* Article Header */}
        <div className="animate-fade-in-up">
          <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-bold uppercase tracking-wider">
            <span className="text-accent bg-accent/10 px-3 py-1 rounded-full border border-accent/20">
              {NEWS_TYPES[news.type] || 'Tin tức'}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Tag size={12} />
              {CATEGORIES[news.categorySlug] || news.categorySlug}
            </span>
            <span className="flex items-center gap-1 text-gray-500 ml-auto">
              <Clock size={12} />
              {new Date(news.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white leading-tight mb-8">
            {news.title}
          </h1>

          {/* Thumbnail */}
          {news.thumbnail && (
            <div className="rounded-2xl overflow-hidden mb-10 border border-gray-800 shadow-2xl">
              <img
                src={`http://localhost:8080${news.thumbnail}`}
                alt={news.title}
                className="w-full h-auto object-cover max-h-[500px]"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-gray-300 prose-p:leading-relaxed prose-headings:font-heading prose-headings:text-white prose-a:text-accent hover:prose-a:text-white">
            {/* Nếu nội dung có HTML, dùng dangerouslySetInnerHTML, nếu chỉ là text thì hiển thị bình thường chia đoạn */}
            {news.content.includes('<') && news.content.includes('>') ? (
              <div dangerouslySetInnerHTML={{ __html: news.content }} />
            ) : (
              news.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-4">{paragraph}</p> : <br key={idx} />
              ))
            )}
          </div>

          {/* Attached Voucher Card - Premium Ticket Design */}
          {news.attachedVoucher && (
            <div className="mt-16 w-full max-w-4xl mx-auto relative group">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#d4af37]/20 via-yellow-500/20 to-[#d4af37]/20 rounded-[2rem] blur-lg opacity-50 group-hover:opacity-100 transition duration-700"></div>

              {/* Main Ticket Container */}
              <div className="relative flex flex-col md:flex-row bg-[#0a0a0a] rounded-[2rem] border border-[#d4af37]/30 shadow-2xl overflow-hidden">

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#d4af37]/10 via-transparent to-transparent"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Left Side - Details (70%) */}
                <div className="relative flex-1 p-8 md:p-10 flex flex-col justify-center border-b border-dashed border-[#d4af37]/30 md:border-b-0 md:border-r">
                  {/* Decorative Circles for Ticket Effect */}
                  <div className="hidden md:block absolute -top-4 -right-4 w-8 h-8 bg-[#111] rounded-full border-b border-l border-[#d4af37]/30"></div>
                  <div className="hidden md:block absolute -bottom-4 -right-4 w-8 h-8 bg-[#111] rounded-full border-t border-l border-[#d4af37]/30"></div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#d4af37] to-yellow-600 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.4)]">
                      <Ticket className="text-black" size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm text-[#d4af37] font-bold uppercase tracking-[0.2em] mb-1">
                        QUÀ TẶNG ĐỘC QUYỀN
                      </h3>
                      <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase flex items-center gap-3">
                        {news.attachedVoucher.name}
                        {news.attachedVoucher.userLimit > 1 && (
                          <span className="text-xs bg-[#d4af37] text-black px-3 py-1 rounded-full font-black tracking-widest flex-shrink-0 animate-pulse">
                            x{news.attachedVoucher.userLimit}
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 my-6 p-4 bg-black/40 rounded-xl border border-white/5">
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Mã Code</p>
                      <p className="text-[#d4af37] font-mono font-bold text-lg tracking-widest">{news.attachedVoucher.code}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Ưu Đãi</p>
                      <p className="text-white font-bold text-lg">
                        {news.attachedVoucher.voucherType === 'PERCENTAGE'
                          ? `Giảm ${news.attachedVoucher.value}%`
                          : news.attachedVoucher.voucherType === 'FREE_SERVICE'
                            ? 'Miễn phí dịch vụ'
                            : `Giảm ${Number(news.attachedVoucher.value).toLocaleString('vi-VN')}đ`}
                      </p>
                    </div>
                    {news.attachedVoucher.minOrderValue > 0 && (
                      <div className="col-span-2 border-t border-white/5 pt-3 mt-1">
                        <p className="text-gray-400 text-sm">
                          <span className="text-gray-500">Điều kiện:</span> Áp dụng cho hóa đơn từ <span className="text-white font-bold">{Number(news.attachedVoucher.minOrderValue).toLocaleString('vi-VN')}đ</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    {news.attachedVoucher.endDate ? (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={16} className="text-[#d4af37]" />
                        <span className="text-gray-400">HSD: <span className="text-gray-200 font-medium">
                          {new Date(news.attachedVoucher.endDate).toLocaleDateString('vi-VN')} {new Date(news.attachedVoucher.endDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span></span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Không giới hạn thời gian</span>
                    )}

                    {/* Progress Bar */}
                    {news.attachedVoucher.totalQuantity > 0 && (
                      <div className="w-full sm:w-48">
                        <div className="flex justify-between text-[10px] mb-1.5 uppercase font-bold tracking-wider text-gray-500">
                          <span>Đã nhận: {news.attachedVoucher.usedQuantity}/{news.attachedVoucher.totalQuantity}</span>
                          <span className="text-[#d4af37]">{Math.round((news.attachedVoucher.usedQuantity / news.attachedVoucher.totalQuantity) * 100)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-[#d4af37] to-yellow-200 relative"
                            style={{ width: `${Math.min(100, (news.attachedVoucher.usedQuantity / news.attachedVoucher.totalQuantity) * 100)}%` }}
                          >
                            <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-20"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side - Action (30%) */}
                <div className="relative md:w-[35%] p-8 flex flex-col items-center justify-center bg-gradient-to-br from-black to-[#111]">
                  <div className="absolute top-0 right-0 opacity-5">
                    <Gift size={150} />
                  </div>

                  <div className="relative z-10 w-full flex flex-col items-center justify-center text-center">
                    {claimStatus === 'CLAIMED' ? (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/30">
                          <CheckCircle size={32} className="text-green-500" />
                        </div>
                        <div>
                          <span className="block font-heading font-black text-xl uppercase tracking-wider text-green-500 mb-1">Đã Nhận</span>
                          {claimMessage && <span className="text-xs text-gray-400">{claimMessage}</span>}
                        </div>
                      </div>
                    ) : claimStatus === 'EXHAUSTED' ? (
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/30">
                          <AlertCircle size={32} className="text-red-500" />
                        </div>
                        <span className="font-heading font-black text-xl uppercase tracking-wider text-red-500">Đã Hết</span>
                        <span className="text-xs text-gray-400">Rất tiếc, voucher đã được nhận hết.</span>
                      </div>
                    ) : (
                      <div className="w-full flex flex-col items-center">
                        <Gift size={40} className="text-[#d4af37] mb-4 drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]" />
                        <button
                          onClick={handleClaimVoucher}
                          disabled={claimStatus === 'CLAIMING'}
                          className="w-full relative group/btn overflow-hidden rounded-xl bg-gradient-to-r from-[#d4af37] to-yellow-500 p-[1px] transition-all hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                        >
                          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                          <div className="relative px-6 py-4 bg-black/20 hover:bg-transparent transition-colors duration-300 rounded-[11px] flex items-center justify-center">
                            <span className="font-heading font-black uppercase tracking-widest text-white text-sm whitespace-nowrap">
                              {claimStatus === 'CLAIMING' ? 'ĐANG XỬ LÝ...' : isLoggedIn ? 'LẤY VOUCHER NGAY' : 'ĐĂNG NHẬP ĐỂ NHẬN'}
                            </span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
};

export default NewsDetail;
