import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, RefreshCw, Star, Zap, ArrowRight as ArrowTailRight, ChevronDown, ChevronUp, X, Minus, Plus } from 'lucide-react';
import { getProductById } from '../api/products';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { normalizeImageUrl } from '../utils/imageUrl';
import ReviewList from '../components/ReviewList';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { addToCart } = useCart();
  const { addToast } = useToast();
  
  const isFromCart = location.state?.fromCart;
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState("");
  const [descExpanded, setDescExpanded] = useState(false);
  
  // Buy Now Modal State
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [buyNowQty, setBuyNowQty] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);

    const fetchDetail = async () => {
      try {
        const found = await getProductById(id);
        if (found) {
          setProduct(found);
          const imagesArr = [found.image1, found.image2, found.image3].filter(Boolean).map(u => normalizeImageUrl(u));
          setMainImage(imagesArr.length > 0 ? imagesArr[0] : normalizeImageUrl(found.thumbnail));
        }
      } catch (err) {
        console.error("Lỗi fetch Product Detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowBuyNowModal(false);
    };
    if (showBuyNowModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBuyNowModal]);

  const handleAddToCart = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast({ title: 'Yêu Cầu Đăng Nhập', message: 'Để thêm sản phẩm vào giỏ hàng, bạn cần phải đăng nhập tài khoản!', type: 'auth_warning' });
      navigate('/login');
      return;
    }
    addToCart(product, quantity);
    addToast({ title: 'Đã thêm vào giỏ hàng', message: `+${quantity} ${product.name}` });
  };

  const handleOrderNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      addToast({ title: 'Yêu Cầu Đăng Nhập', message: 'Để thanh toán và đặt hàng ngay, bạn cần phải đăng nhập tài khoản!', type: 'auth_warning' });
      navigate('/login');
      return;
    }
    setBuyNowQty(quantity);
    setShowBuyNowModal(true);
  };

  // Buy Now Modal Logic
  const handleBuyNowQtyChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= 999) {
      if (product && product.stock && val > product.stock) {
        addToast({ title: 'Không đủ số lượng', message: `Sản phẩm này chỉ còn ${product.stock} cái trong kho`, type: 'auth_warning' });
        setBuyNowQty(product.stock);
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

  const handleBuyNowQtyAdjust = (amount) => {
    const current = buyNowQty === '' ? 1 : buyNowQty;
    const next = current + amount;
    if (product && product.stock && next > product.stock) {
      addToast({ title: 'Không đủ số lượng', message: `Sản phẩm này chỉ còn ${product.stock} cái trong kho`, type: 'auth_warning' });
      setBuyNowQty(product.stock);
    } else {
      setBuyNowQty(next >= 1 ? next : 1);
    }
  };

  const confirmBuyNow = () => {
    const itemQty = buyNowQty === '' ? 1 : buyNowQty;
    const item = {
      id: product.id,
      name: product.name,
      thumbnail: normalizeImageUrl(product.thumbnail || product.image1),
      price: product.price,
      quantity: itemQty
    };
    navigate('/checkout', { state: { items: [item], fromBuyNow: true } });
  };

  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= 999) {
      if (product && product.stock && val > product.stock) {
        addToast({ title: 'Không đủ số lượng', message: `Sản phẩm này chỉ còn ${product.stock} cái trong kho`, type: 'auth_warning' });
        setQuantity(product.stock);
      } else {
        setQuantity(val);
      }
    } else if (e.target.value === '') {
      setQuantity('');
    }
  };

  const handleQuantityBlur = () => {
    if (quantity === '' || quantity < 1) setQuantity(1);
  };

  const handleQuantityAdjust = (amount) => {
    const current = quantity === '' ? 1 : quantity;
    const next = current + amount;
    if (product && product.stock && next > product.stock) {
      addToast({ title: 'Không đủ số lượng', message: `Sản phẩm này chỉ còn ${product.stock} cái trong kho`, type: 'auth_warning' });
      setQuantity(product.stock);
    } else {
      setQuantity(next >= 1 ? next : 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-32 flex justify-center items-center text-white bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-32 flex flex-col justify-center items-center text-white bg-primary px-4">
        <h2 className="text-3xl font-bold mb-4 text-accent">Không tìm thấy sản phẩm</h2>
        <button onClick={() => navigate('/products')} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-lg transition font-bold text-white uppercase tracking-wider">
          <ArrowLeft className="inline w-5 h-5 mr-2" /> Về danh sách
        </button>
      </div>
    );
  }

  const galleryArr = [product.image1, product.image2, product.image3].filter(Boolean).map(u => normalizeImageUrl(u));
  const galleryImages = galleryArr.length > 0 ? galleryArr : [normalizeImageUrl(product.thumbnail)];

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-accent hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold uppercase tracking-wider text-sm">Quay lại</span>
        </button>

        <div className="bg-[#111] rounded-3xl border border-gray-800 p-6 md:p-12 shadow-2xl flex flex-col xl:flex-row gap-12 mb-12">
          
          {/* Gallery Ảnh (Trái) */}
          <div className="w-full xl:w-5/12 flex flex-col gap-4">
            {/* Ảnh Chính */}
            <div className="main-image-wrapper border border-gray-800 p-2 group">
              <img 
                src={mainImage} 
                alt={product.name} 
                onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = "/images/default.jpg"; e.target.dataset.fallback = "true"; } }}
                className="main-image transition-transform duration-700 hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                {product.isSale && <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg shadow-red-500/20">Sale</span>}
                {product.isBestSeller && <span className="bg-[#facc15] text-black text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg shadow-yellow-500/20">Best</span>}
                {product.isNew && <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider shadow-lg shadow-green-500/20">New</span>}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
                {galleryImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`thumbnail-wrapper border-2 transition-all duration-300 ${mainImage === img ? 'border-accent scale-105 opacity-100' : 'border-gray-800 opacity-60 hover:opacity-100 hover:border-gray-500'}`}
                  >
                    <img 
                      src={img} 
                      alt={`Thumbnail ${idx}`} 
                      onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = "/images/default.jpg"; e.target.dataset.fallback = "true"; } }}
                      className="thumbnail-img" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chi Tiết Sản Phẩm (Phải) */}
          <div className="w-full xl:w-7/12 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4 leading-tight">
              {product.name}
            </h1>
            
            {/* Đánh giá tóm tắt */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex text-yellow-400">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-gray-400 text-sm">{product.reviews ? product.reviews.length : 0} Đánh giá</span>
              <span className="text-gray-600">|</span>
              {(product.stock ?? 0) > 0 ? (
                <span className="text-green-400 text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Còn hàng ({product.stock})</span>
              ) : (
                <span className="text-red-500 text-sm flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Hết hàng</span>
              )}
              {product.branch && (
                <>
                  <span className="text-gray-600">|</span>
                  <span className="text-accent text-sm font-semibold">Cơ sở: {
                    product.branch === 'CN 1' ? 'Quận 1' :
                    product.branch === 'CN 2' ? 'Quận 2' :
                    product.branch === 'CN 3' ? 'Quận 3' :
                    product.branch === 'CN 7' ? 'Quận 7' :
                    product.branch === 'CN 9' ? 'Quận 9' :
                    product.branch === 'CN BT' ? 'Bình Thạnh' : product.branch
                  }</span>
                </>
              )}
            </div>

            {/* Giá */}
            <div className="flex items-end gap-4 mb-6 pb-6 border-b border-gray-800">
              <span className="text-4xl font-bold text-accent">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
              {product.oldPrice && (
                <span className="text-xl text-gray-500 line-through mb-1">
                  {product.oldPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>

            {/* Thông số / Mô tả sản phẩm */}
            <div className="mb-8">
               <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-3 flex items-center gap-2">
                 Thông số cơ bản
               </h3>
               {product.specs ? (
                 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-300">
                   {product.specs.map((spec, i) => (
                     <li key={i} className="flex justify-between border-b border-gray-800/50 pb-1">
                       <span className="text-gray-500">{spec.label}</span>
                       <span className="font-semibold">{spec.value}</span>
                     </li>
                   ))}
                 </ul>
               ) : product.description ? (
                 <div className="relative">
                   <div className={`product-description-wrapper custom-scrollbar ${descExpanded ? 'expanded' : ''}`}>
                     <p className="product-description text-gray-400">{product.description}</p>
                   </div>
                   {product.description && product.description.length > 150 && (
                     <button 
                       onClick={() => setDescExpanded(!descExpanded)}
                       className="mt-3 flex items-center gap-1 text-accent hover:text-yellow-300 text-sm font-semibold transition-colors"
                     >
                       {descExpanded ? (
                         <><ChevronUp className="w-4 h-4" /> Thu gọn</>
                       ) : (
                         <><ChevronDown className="w-4 h-4" /> Xem thêm</>
                       )}
                     </button>
                   )}
                 </div>
               ) : (
                 <p className="text-gray-500 italic">Chưa có mô tả cho sản phẩm này.</p>
               )}
            </div>

            {/* Các chính sách ưu đãi */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-10">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-gray-800">
                <ShieldCheck className="text-accent w-5 h-5" />
                <span className="text-xs text-gray-300">Chính hãng 100%</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-gray-800">
                <Truck className="text-accent w-5 h-5" />
                <span className="text-xs text-gray-300">Giao hàng tận nơi</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a1a1a] border border-gray-800">
                <RefreshCw className="text-accent w-5 h-5" />
                <span className="text-xs text-gray-300">Lỗi 1 đổi 1 7 ngày</span>
              </div>
            </div>

            {/* Actions: Số lượng + Add to Cart + Đặt Hàng Ngay */}
            {isFromCart ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="px-5 py-4 bg-[#111] border border-accent rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.1)] flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-accent" />
                  <span className="text-accent font-medium uppercase tracking-wider text-sm">Sản phẩm hiện đang trong giỏ</span>
                </div>
                <button 
                  onClick={() => navigate('/cart')}
                  className="flex-1 h-[56px] border border-gray-700 bg-[#1a1a1a] hover:bg-white/5 text-white font-bold text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg flex justify-center items-center gap-3"
                >
                  <ArrowTailRight className="w-5 h-5" />
                  Quay Lại Giỏ Hàng
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                {/* Box Nhập Trực Tiếp Số Lượng */}
                <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-xl overflow-hidden h-[56px] w-[140px]">
                  <button 
                    onClick={() => handleQuantityAdjust(-1)}
                    className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                  >
                    <span className="text-2xl leading-none -mt-1">-</span>
                  </button>
                  <input 
                    type="number"
                    min="1"
                    max="999"
                    value={quantity}
                    onChange={handleQuantityChange}
                    onBlur={handleQuantityBlur}
                    className="w-12 h-full bg-transparent text-center font-bold text-lg text-white border-x border-gray-700 focus:outline-none focus:bg-white/5 appearance-none"
                    style={{ MozAppearance: 'textfield' }} // hide spinner in firefox
                  />
                  <button 
                    onClick={() => handleQuantityAdjust(1)}
                    className="w-12 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10 transition-colors"
                  >
                     <span className="text-2xl leading-none -mt-1">+</span>
                  </button>
                </div>

                {/* Box Thêm Vào Giỏ */}
                <button 
                  disabled={(product.stock ?? 0) === 0}
                  onClick={handleAddToCart}
                  className={`h-[56px] px-6 border-2 font-bold uppercase tracking-wider rounded-xl transition-all flex justify-center items-center gap-3 ${
                    (product.stock ?? 0) > 0 
                    ? 'border-accent text-accent hover:bg-accent/10 shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.2)]' 
                    : 'border-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm Giỏ Hàng
                </button>

                {/* Box Đặt Hàng Ngay */}
                <button 
                  disabled={(product.stock ?? 0) === 0}
                  onClick={handleOrderNow}
                  className={`flex-1 h-[56px] font-bold text-lg uppercase tracking-wider rounded-xl transition-all flex justify-center items-center gap-3 ${
                    (product.stock ?? 0) > 0 
                    ? 'bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-primary shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]' 
                    : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                >
                  <Zap className="w-5 h-5" />
                  {(product.stock ?? 0) > 0 ? 'Đặt Hàng Ngay' : 'Hết hàng'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Section Review Khách Hàng */}
        <ReviewList type="product" itemId={product.id} />

      </div>

      {/* ===== THÊM MODAL ĐẶT HÀNG NGAY ===== */}
      {showBuyNowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 transform transition-opacity duration-300 opacity-100" onClick={() => setShowBuyNowModal(false)}>
          <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-transform duration-300 scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
              <h3 className="text-xl font-bold font-heading uppercase text-white">Xác nhận đặt hàng</h3>
              <button onClick={() => setShowBuyNowModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-4 mb-6">
              <img 
                src={mainImage} 
                alt={product.name} 
                className="w-20 h-20 rounded-lg object-cover bg-[#1a1a1a] border border-gray-800 flex-shrink-0"
              />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-white mb-1 line-clamp-2">{product.name}</h4>
                <div className="text-accent font-bold mb-3">
                  {product.price.toLocaleString('vi-VN')}₫
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

            <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-800">
               <span className="text-gray-400 text-sm">Tổng tạm tính:</span>
               <span className="text-xl font-bold text-accent">
                 {(product.price * (buyNowQty === '' ? 1 : buyNowQty)).toLocaleString('vi-VN')}₫
               </span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBuyNowModal(false)}
                className="flex-1 py-3 border border-red-500/30 text-red-400 font-semibold rounded-xl hover:bg-red-500/10 transition-colors flex justify-center items-center"
              >
                HỦY
              </button>
              <button
                onClick={confirmBuyNow}
                className="flex-1 py-3 bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-primary font-bold rounded-xl transition-all flex justify-center items-center shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                ĐẶT NGAY
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
