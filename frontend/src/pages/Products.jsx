import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Flame, Star, Sparkles, X, Minus, Plus, ShoppingCart } from 'lucide-react';
import { productCategories } from '../data/products';
import { getProducts, getProductsByCategory } from '../api/products';
import { normalizeImageUrl } from '../utils/imageUrl';
import ScrollToTop from '../components/ScrollToTop';

const CustomToast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []); // Remove onClose from dependencies

  return (
    <div className="fixed top-24 right-4 z-[9999] bg-[#1a1a1a] border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded-xl overflow-hidden min-w-[320px]">
      <div className="p-4 flex items-start gap-3">
        <span className="text-2xl leading-none">😥</span>
        <div className="flex-1 mt-0.5">
          <span className="text-white text-sm font-medium leading-relaxed">{message}</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white flex-shrink-0 mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="h-1 bg-red-500/20 w-full">
        <div className="h-full bg-red-500" style={{ animation: 'shrinkBar 5s linear forwards' }}></div>
      </div>
      <style>{`
        @keyframes shrinkBar {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

const Products = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(() => {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (user?.role === 'EDITOR' && user?.branch) {
      return user.branch;
    }
    return 'Online';
  });
  const [products, setProducts] = useState([]);

  // Modal State
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [buyNowQty, setBuyNowQty] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const hasShownToast = useRef(false);

  // Title page calculation
  const getCategoryName = (slug) => {
    if (!slug) return "Tất Cả Sản Phẩm";
    const categories = {
      "tong-do": "Tông đơ",
      "keo-cat": "Kéo cắt & tỉa",
      "may-lam-toc": "Máy làm tóc",
      "gom-xit": "Gôm xịt tóc",
      "sap-vuot": "Sáp vuốt tóc",
      "duong-toc": "Sản phẩm dưỡng tóc",
      "khac": "Khác",
      "sale": "Đang Giảm Giá Khủng",
      "best-seller": "Sản Phẩm Bán Chạy",
      "new": "Sản Phẩm Mới Tới"
    };
    return categories[slug] || "Sản Phẩm";
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchData = async () => {
      try {
        let fetchResult = [];

        if (!slug || slug === 'sale' || slug === 'best-seller' || slug === 'new') {
          fetchResult = await getProducts(selectedBranch);
          if (slug === 'sale') fetchResult = fetchResult.filter(p => p.isSale);
          if (slug === 'best-seller') fetchResult = fetchResult.filter(p => p.isBestSeller);
          if (slug === 'new') fetchResult = fetchResult.filter(p => p.isNew);
        } else {
          fetchResult = await getProductsByCategory(slug, selectedBranch);
        }

        if (searchTerm) {
          fetchResult = fetchResult.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sắp xếp: Còn hàng lên trước, Hết hàng đẩy xuống cuối
        fetchResult.sort((a, b) => {
          const stockA = a.stock ?? 0;
          const stockB = b.stock ?? 0;
          if (stockA > 0 && stockB === 0) return -1;
          if (stockA === 0 && stockB > 0) return 1;
          return 0;
        });

        setProducts(fetchResult);
      } catch (err) {
        console.error("Lỗi fetch Products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug, searchTerm, selectedBranch]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowBuyNowModal(false);
    };
    if (showBuyNowModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBuyNowModal]);

  const handleBuyNowClick = (product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setSelectedProduct(product);
    setBuyNowQty(1);
    setShowBuyNowModal(true);
    hasShownToast.current = false;
  };

  const triggerToast = (maxStock) => {
    if (!hasShownToast.current) {
      setToastMessage(`Dạ HORNET ROYALE  rất xin lỗi quý khách, hiện tại sản phẩm này chỉ còn lại ${maxStock} mặt hàng!`);
      hasShownToast.current = true;
    }
  };

  const handleBuyNowQtyAdjust = (amount) => {
    if (!selectedProduct) return;
    const maxStock = selectedProduct.stock ?? 0;

    setBuyNowQty(prev => {
      const next = prev + amount;
      if (next > maxStock) {
        triggerToast(maxStock);
        return maxStock;
      }
      return next >= 1 ? next : 1;
    });
  };

  const handleBuyNowQtyChange = (e) => {
    if (!selectedProduct) return;
    const maxStock = selectedProduct.stock ?? 0;
    const val = parseInt(e.target.value);

    if (!isNaN(val) && val >= 1) {
      if (val > maxStock) {
        triggerToast(maxStock);
        setBuyNowQty(maxStock);
      } else {
        setBuyNowQty(val);
      }
    } else if (e.target.value === '') {
      setBuyNowQty('');
    }
  };

  const handleBuyNowQtyBlur = () => {
    if (buyNowQty === '' || buyNowQty < 1) setBuyNowQty(1);
  };

  const confirmBuyNow = () => {
    if (!selectedProduct) return;
    const itemQty = buyNowQty === '' ? 1 : buyNowQty;
    const item = {
      id: selectedProduct.id,
      name: selectedProduct.name,
      thumbnail: normalizeImageUrl(selectedProduct.thumbnail || selectedProduct.image1),
      price: selectedProduct.price,
      quantity: itemQty
    };
    navigate('/checkout', { state: { items: [item], fromBuyNow: true } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 mt-24 text-white pb-32">
      {toastMessage && (
        <CustomToast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Nút quay lại */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-accent hover:text-white mb-8 transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
        <span className="font-semibold uppercase tracking-wider text-sm">Quay lại</span>
      </button>

      {/* Header & Thanh Tìm Kiếm */}
      <div className="border-b border-gray-800 pb-8 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3">
            <span className="w-2 h-8 bg-accent block"></span>
            {getCategoryName(slug)}
          </h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            {slug ? `Khám phá bộ sưu tập ${getCategoryName(slug).toLowerCase()} dành riêng cho bạn.` :
              "Tất cả các sản phẩm Barber chất lượng nhất đều hội tụ tại đây. Đảm bảo chính hãng 100%."}
          </p>
        </div>

        {/* Controls: Tìm kiếm */}
        <div className="flex flex-col sm:flex-row gap-4 min-w-[300px] md:min-w-[500px]">
          {/* Thanh Tìm Kiếm */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm sản phẩm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111] border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-gray-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(`/product/${item.id}`)}
              className="bg-[#111] rounded-2xl overflow-hidden border border-gray-800 hover:border-accent hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] transition-all duration-300 group cursor-pointer flex flex-col h-full"
            >
              {/* Image Container */}
              <div className="product-image-wrapper relative">
                <img
                  src={normalizeImageUrl(item.thumbnail || item.image1)}
                  alt={item.name}
                  onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = '/images/default.jpg'; e.target.dataset.fallback = 'true'; } }}
                  className="product-image opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent"></div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                  {(item.stock ?? 0) === 0 && (
                    <div className="bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-lg">
                      Hết hàng
                    </div>
                  )}
                  {item.isSale && (
                    <div className="bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-red-600/20">
                      <Flame className="w-3 h-3" /> Sale
                    </div>
                  )}
                  {item.isBestSeller && (
                    <div className="bg-[#facc15] text-black text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-yellow-500/20">
                      <Star className="w-3 h-3" /> Best
                    </div>
                  )}
                  {item.isNew && (
                    <div className="bg-green-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-green-600/20">
                      <Sparkles className="w-3 h-3" /> New
                    </div>
                  )}
                </div>

                {item.isSale && item.oldPrice && (
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md text-accent text-[10px] font-bold px-2 py-1 rounded border border-accent/30 shadow-lg">
                    -{Math.round((1 - item.price / item.oldPrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Information */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-bold group-hover:text-accent transition-colors">
                  {productCategories.find(c => c.slug === item.category)?.name || item.category}
                </p>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight flex-1 group-hover:text-accent transition-colors line-clamp-2">
                  {item.name}
                </h3>

                <div className="flex flex-col mt-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xl font-bold text-accent">
                      {item.price.toLocaleString('vi-VN')}₫
                    </span>
                    {item.oldPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {item.oldPrice.toLocaleString('vi-VN')}₫
                      </span>
                    )}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      disabled={(item.stock ?? 0) === 0}
                      onClick={(e) => {
                        e.stopPropagation();
                        if ((item.stock ?? 0) > 0) navigate(`/product/${item.id}`);
                      }}
                      className={`flex-1 py-2 border rounded-lg font-bold uppercase tracking-wider transition-all text-[11px] sm:text-xs flex justify-center items-center gap-1 ${(item.stock ?? 0) > 0
                        ? 'border-gray-700 bg-transparent text-gray-300 group-hover:border-accent group-hover:text-accent'
                        : 'border-gray-800 bg-gray-800/50 text-gray-600 cursor-not-allowed'
                        }`}
                    >
                      {(item.stock ?? 0) > 0 ? 'Chi tiết' : 'Hết hàng'}
                    </button>
                    {(item.stock ?? 0) > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuyNowClick(item); }}
                        className="flex-1 py-2 bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-primary border-none rounded-lg font-bold uppercase tracking-wider transition-all text-[11px] sm:text-xs flex justify-center items-center shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                      >
                        Mua ngay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-[#111] rounded-2xl border border-gray-800">
          <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Không tìm thấy sản phẩm</h2>
          <p className="text-gray-400">Thử thay đổi từ khóa tìm kiếm của bạn xem sao.</p>
        </div>
      )}
      <ScrollToTop />

      {/* ===== MODAL ĐẶT HÀNG NGAY ===== */}
      {showBuyNowModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transform transition-opacity duration-300 opacity-100">
          {/* Overlay click to close */}
          <div className="absolute inset-0" onClick={() => setShowBuyNowModal(false)}></div>

          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl relative z-10">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
              <h3 className="text-xl font-bold font-heading uppercase text-white">Xác nhận đặt hàng</h3>
              <button onClick={() => setShowBuyNowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-4 mb-4">
              <img
                src={normalizeImageUrl(selectedProduct.thumbnail || selectedProduct.image1)}
                alt={selectedProduct.name}
                onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = '/images/default.jpg'; e.target.dataset.fallback = 'true'; } }}
                className="w-20 h-20 rounded-lg object-cover bg-[#1a1a1a] border border-gray-800 flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{selectedProduct.name}</h4>
                <div className="text-accent font-bold mb-3">
                  {selectedProduct.price.toLocaleString('vi-VN')}₫
                </div>

                {/* Quantity */}
                <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden h-9 w-[110px]">
                  <button
                    onClick={() => handleBuyNowQtyAdjust(-1)}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={buyNowQty}
                    onChange={handleBuyNowQtyChange}
                    onBlur={handleBuyNowQtyBlur}
                    className="w-10 h-full bg-transparent text-center font-bold text-sm text-white border-x border-gray-700 focus:outline-none focus:bg-white/5 appearance-none"
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <button
                    onClick={() => handleBuyNowQtyAdjust(1)}
                    className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-accent hover:text-primary transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Tồn kho */}
            <div className="text-right text-sm text-gray-400 mb-6 pb-4 border-b border-gray-800">
              Số lượng tồn kho: <span className="font-bold text-green-500">{selectedProduct.stock}</span>
            </div>

            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-sm">Tổng tạm tính:</span>
              <span className="text-xl font-bold text-accent">
                {(selectedProduct.price * (buyNowQty === '' ? 1 : buyNowQty)).toLocaleString('vi-VN')}₫
              </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyNowModal(false)}
                className="flex-1 py-3 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/10 transition-colors flex justify-center items-center"
              >
                THOÁT
              </button>
              <button
                onClick={confirmBuyNow}
                className="flex-1 py-3 bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-primary font-bold rounded-xl transition-all flex justify-center items-center shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                MUA NGAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
