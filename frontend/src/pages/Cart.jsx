import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Check } from 'lucide-react';
import { normalizeImageUrl } from '../utils/imageUrl';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, clearCart, consumeReorderedIds, lastUpdatedId, setLastUpdatedId } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Reset highlight after 2 seconds
  useEffect(() => {
    if (lastUpdatedId) {
      const timer = setTimeout(() => {
        setLastUpdatedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedId, setLastUpdatedId]);
  
  const [checkedItems, setCheckedItems] = useState([]);

  // Auto-check reordered items (chỉ chạy 1 lần khi vào trang sau "Mua lại")
  useEffect(() => {
    const reorderIds = consumeReorderedIds();
    if (reorderIds.length > 0) {
      setCheckedItems(prev => {
        const merged = new Set([...prev, ...reorderIds]);
        return [...merged];
      });
    }
  }, []);

  useEffect(() => {
    // Clean up checked items if they are removed from cart 
    setCheckedItems(prev => prev.filter(id => cartItems.some(item => item.id === id)));
  }, [cartItems]);

  const toggleCheck = (id) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const toggleCheckAll = () => {
    if (checkedItems.length === cartItems.length) {
      setCheckedItems([]);
    } else {
      setCheckedItems(cartItems.map(item => item.id));
    }
  };

  const calculateTotal = cartItems
    .filter(item => checkedItems.includes(item.id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      addToast({ title: 'Chưa chọn sản phẩm', message: 'Vui lòng chọn ít nhất 1 sản phẩm để thanh toán', type: 'remove' });
      return;
    }
    const selectedItems = cartItems.filter(item => checkedItems.includes(item.id));
    navigate('/checkout', { state: { items: selectedItems } });
  };

  const handleQuantityAdjust = (e, item, isChange = false) => {
    if(isChange) {
      const val = parseInt(e.target.value);
      if (!isNaN(val) && val >= 1) {
        if (item.stock && val > item.stock) {
          addToast({ title: 'Không đủ số lượng', message: `Sản phẩm này chỉ còn ${item.stock} cái trong kho`, type: 'auth_warning' });
          updateQuantity(item.id, item.stock);
        } else {
          updateQuantity(item.id, val);
        }
      }
    }
  };

  const handleRemoveItem = (item) => {
    removeFromCart(item.id);
    addToast({ title: 'Đã xoá khỏi giỏ hàng', message: item.name, type: 'remove' });
  };

  const handleRemoveSelected = () => {
    if (checkedItems.length === 0) return;
    checkedItems.forEach(id => removeFromCart(id));
    addToast({ title: 'Đã xoá sản phẩm', message: `Đã xoá ${checkedItems.length} sản phẩm đã chọn`, type: 'remove' });
    setCheckedItems([]);
  };

  const handleClearAll = () => {
    clearCart();
    addToast({ title: 'Đã xoá tất cả', message: 'Giỏ hàng hiện đang trống', type: 'remove' });
    setCheckedItems([]);
  };

  return (
    <div className="min-h-screen pt-24 pb-32 bg-primary text-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="border-b border-gray-800 pb-6 mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-heading font-bold uppercase tracking-tight text-white flex items-center gap-3">
              <span className="w-2 h-8 bg-accent block"></span>
              Giỏ Hàng Của Bạn
            </h1>
            <p className="text-gray-400 mt-3">Kiểm tra lại các item barber xịn xò trước khi thanh toán.</p>
          </div>
          {cartItems.length > 0 && (
             <div className="flex gap-4">
               {checkedItems.length > 0 && (
                 <button onClick={handleRemoveSelected} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg border border-red-500/30 text-sm font-medium transition-colors flex items-center gap-2">
                   <Trash2 className="w-4 h-4" /> Xoá đã chọn ({checkedItems.length})
                 </button>
               )}
               <button onClick={handleClearAll} className="text-gray-500 hover:text-red-400 text-sm font-medium underline flex items-center pr-2 transition-colors">
                 Xoá tất cả
               </button>
             </div>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-16 flex flex-col items-center justify-center text-center mt-10">
            <div className="w-24 h-24 bg-[#1a1a1a] rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Giỏ hàng trốn đi đâu mất rồi?</h2>
            <p className="text-gray-400 mb-8 max-w-md">Hiện tại bạn chưa chọn sản phẩm nào. Cùng khám phá bộ sưu tập Barber của chúng tôi nhé!</p>
            <Link 
              to="/products"
              className="px-8 py-3 bg-accent hover:bg-yellow-400 text-primary font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.2)] flex items-center gap-2"
            >
              Tiếp tục mua sắm <ArrowRight className="w-5 h-5"/>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* List Cart Items */}
            <div className="w-full lg:w-2/3 flex flex-col gap-6">
              
              {/* Checkbox Header */}
              <div className="bg-[#111] border border-gray-800 rounded-2xl p-4 flex items-center gap-4 sticky top-20 z-10 shadow-lg">
                <button 
                  onClick={toggleCheckAll}
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${checkedItems.length === cartItems.length && cartItems.length > 0 ? 'bg-accent border-accent text-primary' : 'border-gray-500 hover:border-gray-400'}`}
                >
                  {checkedItems.length === cartItems.length && cartItems.length > 0 && <Check className="w-4 h-4" />}
                </button>
                <span className="font-semibold text-gray-300">
                  Chọn tất cả ({cartItems.length} sản phẩm)
                </span>
              </div>
              {cartItems.map((item) => {
                const isNew = item.id === lastUpdatedId;
                return (
                  <div 
                    key={item.id} 
                    className={`bg-[#111] border rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 relative group transition-all duration-500 transform ${
                      isNew 
                        ? 'border-accent ring-2 ring-accent/20 shadow-[0_0_25px_rgba(212,175,55,0.25)] scale-[1.01]' 
                        : checkedItems.includes(item.id) 
                          ? 'border-accent/50 shadow-[0_5px_15px_rgba(212,175,55,0.15)] -translate-y-0.5' 
                          : 'border-gray-800 hover:border-gray-600'
                    }`}
                  >
                  
                  {/* Select Checkbox */}
                  <button 
                    onClick={() => toggleCheck(item.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors absolute top-6 left-4 sm:relative sm:top-auto sm:left-auto z-10 ${checkedItems.includes(item.id) ? 'bg-accent border-accent text-primary' : 'border-gray-500 hover:border-gray-400 bg-[#1a1a1a]'}`}
                  >
                    {checkedItems.includes(item.id) && <Check className="w-4 h-4" />}
                  </button>

                  {/* Delete Button (Absolute on Mobile, Top Right) */}
                  <button 
                    onClick={() => handleRemoveItem(item)}
                    className="absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto sm:order-last p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors z-10"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div 
                    onClick={() => navigate(`/product/${item.id}`, { state: { fromCart: true } })}
                    className="cart-image-wrapper cursor-pointer ml-8 sm:ml-0"
                  >
                    <img 
                      src={normalizeImageUrl(item.thumbnail || item.image1)} 
                      alt={item.name} 
                      onError={(e) => { if (!e.target.dataset.fallback) { e.target.src = "/images/default.jpg"; e.target.dataset.fallback = "true"; } }}
                      className="cart-image opacity-90 group-hover:scale-105 transition-transform" 
                    />
                  </div>

                  <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left w-full mt-4 sm:mt-0">
                    <h3 
                      onClick={() => navigate(`/product/${item.id}`, { state: { fromCart: true } })}
                      className="text-lg font-bold text-white mb-2 hover:text-accent cursor-pointer line-clamp-2 transition-colors"
                    >
                      {item.name}
                    </h3>
                    <div className="text-accent font-bold text-xl mb-4 sm:mb-auto">
                      {item.price.toLocaleString('vi-VN')}₫
                    </div>
                    
                    <div className="flex items-center justify-between w-full mt-auto">
                      {/* Input Số lượng */}
                      <div className="flex items-center bg-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden h-10 w-[120px]">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input 
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityAdjust(e, item, true)}
                          onBlur={(e) => { if(e.target.value === '' || parseInt(e.target.value) < 1) updateQuantity(item.id, 1) }}
                          className="w-10 h-full bg-transparent text-center font-bold text-sm text-white border-x border-gray-700 focus:outline-none focus:bg-white/5 appearance-none"
                          style={{ MozAppearance: 'textfield' }}
                        />
                        <button 
                          onClick={() => {
                            if (item.stock && item.quantity + 1 > item.stock) {
                              addToast({ title: 'Không đủ số lượng', message: `Sản phẩm này chỉ còn ${item.stock} cái trong kho`, type: 'auth_warning' });
                            } else {
                              updateQuantity(item.id, item.quantity + 1);
                            }
                          }}
                          className="w-10 h-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-sm text-gray-500 block mb-1">Thành tiền:</span>
                        <span className="font-bold text-white text-lg">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 sticky top-32 shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
                <h3 className="text-2xl font-heading font-bold uppercase text-white mb-6 border-b border-gray-800 pb-4">Tổng Đơn Hàng</h3>
                
                <div className="space-y-4 mb-6 text-gray-300">
                  <div className="flex justify-between">
                     <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                     <span>{calculateTotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Phí giao hàng</span>
                     <span className="text-green-400">Miễn phí</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Mã giảm giá</span>
                     <span className="text-gray-500 italic">Chưa áp dụng</span>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6 mb-8 flex justify-between items-end">
                   <span className="text-lg font-bold text-white uppercase">Tổng Cộng</span>
                   <span className="text-3xl font-bold text-accent">{calculateTotal.toLocaleString('vi-VN')}₫</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-primary font-bold text-lg uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.4)]"
                >
                  Tiến Hành Thanh Toán
                </button>
                
                <Link to="/products" className="block text-center mt-4 text-sm text-gray-400 hover:text-white transition-colors underline">
                  Hoặc tiếp tục mua sắm
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default Cart;
