import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // IDs of items that were just reordered (for auto-check in Cart.jsx)
  const [reorderedIds, setReorderedIds] = useState([]);
  const [lastUpdatedId, setLastUpdatedId] = useState(null);

  // Save to local storage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingIdx = prevItems.findIndex(item => item.id === product.id);
      
      setLastUpdatedId(product.id);
      if (existingIdx !== -1) {
        // Nếu đã có: cập nhật số lượng và đưa lên đầu
        const items = [...prevItems];
        const existing = items.splice(existingIdx, 1)[0];
        return [
          { ...existing, quantity: existing.quantity + quantity },
          ...items
        ];
      }
      // Nếu mới: thêm vào đầu
      return [{ ...product, quantity }, ...prevItems];
    });
  };

  /**
   * Reorder: thêm nhiều sản phẩm từ đơn hàng cũ vào giỏ.
   * - Nếu trùng: tùy mergeType (Cộng dồn hoặc Giữ nguyên), đẩy lên đầu
   * - Nếu mới: thêm ở đầu
   * - Trả về danh sách IDs đã reorder để Cart auto-check
   */
  const reorderToCart = (orderItems, mergeType = 'ACCUMULATE') => {
    const reorderIds = orderItems.map(item => item.productId);
    
    setCartItems(prevItems => {
      // Tách items cũ thành 2 nhóm: trùng với reorder và không trùng
      const untouchedItems = [...prevItems];
      const reorderedAtTop = [];

      for (const orderItem of orderItems) {
        const existIdx = untouchedItems.findIndex(item => item.id === orderItem.productId);
        
        if (existIdx !== -1) {
          // Trùng: lấy ra, merge quantity, đẩy lên đầu
          const existing = untouchedItems.splice(existIdx, 1)[0];
          
          const newQty = mergeType === 'ACCUMULATE' 
            ? existing.quantity + orderItem.quantity
            : existing.quantity;

          reorderedAtTop.push({
            ...existing,
            quantity: newQty,
          });
        } else {
          // Mới: tạo mới, đẩy lên đầu 
          reorderedAtTop.push({
            id: orderItem.productId,
            name: orderItem.productName,
            price: orderItem.price,
            thumbnail: orderItem.productImage,
            image1: orderItem.productImage,
            quantity: orderItem.quantity,
          });
        }
      }

      // Reorder items ở đầu + items còn lại ở dưới
      return [...reorderedAtTop, ...untouchedItems];
    });

    // Lưu IDs để Cart.jsx auto-check
    setReorderedIds(reorderIds);
    setLastUpdatedId(reorderIds[0] || null);
    
    return reorderIds;
  };

  // Consume reordered IDs (Cart.jsx gọi 1 lần rồi clear)
  const consumeReorderedIds = () => {
    const ids = [...reorderedIds];
    setReorderedIds([]);
    return ids;
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setLastUpdatedId(id);
    setCartItems(prevItems => {
      const existingIdx = prevItems.findIndex(item => item.id === id);
      if (existingIdx !== -1) {
        const items = [...prevItems];
        const existing = items.splice(existingIdx, 1)[0];
        return [{ ...existing, quantity: newQuantity }, ...items];
      }
      return prevItems;
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const removeItemsFromCart = (ids) => {
    setCartItems(prevItems => prevItems.filter(item => !ids.includes(item.id)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getTotalCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      reorderToCart,
      consumeReorderedIds,
      reorderedIds,
      lastUpdatedId,
      setLastUpdatedId,
      updateQuantity,
      removeFromCart,
      removeItemsFromCart,
      clearCart,
      getTotalCount,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
