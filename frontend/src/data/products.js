export const productCategories = [
  { name: "Tông đơ", slug: "tong-do" },
  { name: "Kéo cắt & tỉa", slug: "keo-cat" },
  { name: "Máy làm tóc", slug: "may-lam-toc" },
  { name: "Gôm xịt tóc", slug: "gom-xit" },
  { name: "Sáp vuốt tóc", slug: "sap-vuot" },
  { name: "Sản phẩm dưỡng tóc", slug: "duong-toc" },
  { name: "Khác", slug: "khac" }
];

export const highlightMenu = [
  { name: "Giảm giá", slug: "sale" },
  { name: "Bán chạy", slug: "best-seller" },
  { name: "Sản phẩm mới", slug: "new" }
];

const mockSpecs = [
  { label: "Bảo hành", value: "12 tháng" },
  { label: "Thương hiệu", value: "Barber Collection" },
  { label: "Xuất xứ", value: "Nhập khẩu" },
  { label: "Tình trạng", value: "Mới 100%" },
];

const mockReviews = [
  { name: "Khách VIP 01", rating: 5, comment: "Sản phẩm cực chất lượng, cầm rất đầm tay. Rất hài lòng với dịch vụ gói hàng." },
  { name: "Nguyễn Barber", rating: 4, comment: "Dùng ổn áp, đúng mô tả. Tuy nhiên ship hơi lâu 1 chút xíu." },
];

const rawProducts = [
  // Tông đơ
  { 
    id: 1, 
    name: "Tông Đơ Wahl Magic Clip Cordless", 
    price: 2550000, 
    oldPrice: 3000000, 
    image: "https://images.unsplash.com/photo-1593702295071-8b010c7329d7?q=80&w=600&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1593702295071-8b010c7329d7?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop"
    ],
    category: "tong-do", 
    isSale: true, 
    isBestSeller: true, 
    isNew: false, 
    description: "Dòng tông đơ không dây kinh điển dành cho barber chuyên nghiệp.",
    specs: [
      { label: "Công suất", value: "10W" },
      { label: "Loại pin", value: "Lithium-ion" },
      { label: "Thời gian sử dụng", value: "90 phút" },
      { label: "Trọng lượng", value: "290g" },
      { label: "Thương hiệu", value: "Wahl" }
    ],
    reviews: mockReviews
  },
  { 
    id: 2, 
    name: "Tông Đơ Andis Master Cordless", 
    price: 4200000, 
    oldPrice: null, 
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop", 
    images: [
      "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593702295071-8b010c7329d7?q=80&w=600&auto=format&fit=crop",
      "https://plus.unsplash.com/premium_photo-1661299307738-4e899cb63d76?q=80&w=600&auto=format&fit=crop"
    ],
    category: "tong-do", 
    isSale: false, 
    isBestSeller: true, 
    isNew: false, 
    description: "Tông đơ cắt fade chuyên dụng động cơ từ tính mạnh mẽ.",
    specs: mockSpecs,
    reviews: mockReviews
  },
  { id: 3, name: "Tông Đơ Chấn Viền Babyliss Pro Skeleton", price: 3100000, oldPrice: 3500000, image: "https://plus.unsplash.com/premium_photo-1661299307738-4e899cb63d76?q=80&w=600&auto=format&fit=crop", images: ["https://plus.unsplash.com/premium_photo-1661299307738-4e899cb63d76?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop"], category: "tong-do", isSale: true, isBestSeller: false, isNew: true, description: "Lưỡi thép không gỉ cao cấp, chuyên dùng chấn viền, tattoo.", specs: mockSpecs, reviews: mockReviews },
  // Kéo cắt & tỉa
  { id: 4, name: "Kéo Cắt Tóc Kềm Nghĩa PRO 6.0", price: 850000, oldPrice: null, image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop", images: ["https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop", "https://plus.unsplash.com/premium_photo-1661299307738-4e899cb63d76?q=80&w=600&auto=format&fit=crop", "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop"], category: "keo-cat", isSale: false, isBestSeller: true, isNew: false, description: "Kéo cắt thiết kế tinh tế từ thép Nhật S440C.", specs: mockSpecs, reviews: mockReviews },
  { id: 5, name: "Kéo Tỉa Tóc Viko 30% Thưa", price: 950000, oldPrice: null, image: "https://images.unsplash.com/photo-1534201389798-2b814e5a9c9f?q=80&w=600&auto=format&fit=crop", category: "keo-cat", isSale: false, isBestSeller: false, isNew: false, description: "Kéo tỉa chính xác với tỉ lệ tóc rớt 30%." },
  { id: 6, name: "Bộ Kéo Cắt Tỉa Barber Nhật Bản SAKURA", price: 4500000, oldPrice: 5000000, image: "https://plus.unsplash.com/premium_photo-1682125714341-a15f0dcc524f?q=80&w=600&auto=format&fit=crop", category: "keo-cat", isSale: true, isBestSeller: false, isNew: true, description: "Bộ kéo sang trọng mạ Titan đen nhám bám tay hoàn hảo." },
  // Sáp vuốt tóc
  { id: 7, name: "Sáp Volcanic Clay V5", price: 340000, oldPrice: null, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: false, isBestSeller: true, isNew: false, description: "Sáp vuốt tóc huyền thoại không bóng, giữ nếp Extreme Hold." },
  { id: 8, name: "Sáp Kevin Murphy Rough Rider", price: 680000, oldPrice: 750000, image: "https://images.unsplash.com/photo-1626285861696-9f0bf5a49c6d?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: true, isBestSeller: true, isNew: false, description: "Sáp vuốt tóc cao cấp từ Mỹ có chứa dưỡng chất bảo vệ tóc." },
  { id: 9, name: "Sáp Hanz de Fuko Quicksand", price: 550000, oldPrice: null, image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: false, isBestSeller: false, isNew: true, description: "Kết hợp giữa sáp và dầu gội khô giúp tóc bồng bềnh tự nhiên." },
  // Gôm xịt tóc
  { id: 10, name: "Gôm Xịt Tóc Butterfly Shadow", price: 120000, oldPrice: 150000, image: "https://images.unsplash.com/photo-1580870059881-0d32c58e5781?q=80&w=600&auto=format&fit=crop", category: "gom-xit", isSale: true, isBestSeller: true, isNew: false, description: "Dòng gôm giữ nếp siêu cứng phổ biến thị trường." },
  { id: 11, name: "Gôm Osis+ 3 Session", price: 350000, oldPrice: null, image: "https://images.unsplash.com/photo-1629198725805-4c07d391fc35?q=80&w=600&auto=format&fit=crop", category: "gom-xit", isSale: false, isBestSeller: false, isNew: true, description: "Xịt tạo kiểu chuyên nghiệp khô nhanh, không dính." },
  // Dưỡng tóc
  { id: 12, name: "Tinh dầu dưỡng Moroccanoil Treatment", price: 890000, oldPrice: 950000, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop", category: "duong-toc", isSale: true, isBestSeller: true, isNew: false, description: "Tinh dầu argan phục hồi tóc hư tổn hiệu quả nhất thế giới." },
  // Thêm một số đồ khác
  { id: 13, name: "Tông đơ viền Kemei 1974A", price: 290000, oldPrice: null, image: "https://images.unsplash.com/photo-1632832049611-37dcaadc0f94?q=80&w=600&auto=format&fit=crop", category: "tong-do", isSale: false, isBestSeller: false, isNew: true, description: "Chấn viền giá rẻ hiệu năng cao, thiết kế rồng vàng cực chất." },
  { id: 14, name: "Máy Sấy Tóc Dyson Supersonic Pro", price: 11500000, oldPrice: 12000000, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop", category: "may-lam-toc", isSale: true, isBestSeller: false, isNew: false, description: "Máy sấy công nghệ cao giúp làm khô tóc mà không hỏng cấu trúc." },
  { id: 15, name: "Sáp Apestomen Volcanic Clay (Bản gốc)", price: 280000, oldPrice: null, image: "https://images.unsplash.com/photo-1590159754378-0112aa5c75de?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: false, isBestSeller: true, isNew: false, description: "Dòng Volcanic bản cũ vẫn rất được giới Barber săn đón." },
  { id: 16, name: "Máy Sấy Panasonic Salon Pro", price: 1250000, oldPrice: null, image: "https://plus.unsplash.com/premium_photo-1677093206456-df52caab2b2a?q=80&w=600&auto=format&fit=crop", category: "may-lam-toc", isSale: false, isBestSeller: true, isNew: false, description: "Sấy tóc công suất 2000W chuẩn tiệm." },
  { id: 17, name: "Bình xịt nước Barber Vintage", price: 120000, oldPrice: 150000, image: "https://images.unsplash.com/photo-1605342416960-938b813bfeaa?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: true, isBestSeller: false, isNew: true, description: "Bình xịt tạo sưong nhẹ, kiểu dáng Jack Daniel phong cách." },
  { id: 18, name: "Áo choàng cắt tóc Premium sọc Pinstripe", price: 180000, oldPrice: null, image: "https://images.unsplash.com/photo-1582643875323-289569ceb4ec?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: false, isBestSeller: true, isNew: false, description: "Chất vải lụa trơn mát, chống bám tóc tuyệt đối." },
  { id: 19, name: "Reuzel Blue Pomade", price: 420000, oldPrice: 480000, image: "https://images.unsplash.com/photo-1626444343729-ea267c7e97ef?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: true, isBestSeller: true, isNew: false, description: "Pomade gốc nước dễ gội, giữ nếp siêu cao Heady Hold." },
  { id: 20, name: "Reuzel Pink Pomade", price: 420000, oldPrice: null, image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: false, isBestSeller: false, isNew: true, description: "Pomade gốc dầu truyền thống, mùi táo nhẹ nhàng lôi cuốn." },
  { id: 21, name: "Gôm siêu cứng Colonna", price: 180000, oldPrice: null, image: "https://images.unsplash.com/photo-1580870058869-7ae54907a3c3?q=80&w=600&auto=format&fit=crop", category: "gom-xit", isSale: false, isBestSeller: false, isNew: false, description: "Khóa nếp tóc suốt 24h, bất chấp mồ hôi leo núi." },
  { id: 22, name: "Sáp dạng bột Osis+ 1 Dust It", price: 280000, oldPrice: 320000, image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: true, isBestSeller: true, isNew: false, description: "Sáp rắc dạng bột giúp Texture đẹp và hút dầu cực tốt." },
  { id: 23, name: "Lưỡi tông đơ Wahl T-Wide", price: 550000, oldPrice: null, image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: false, isBestSeller: true, isNew: false, description: "Lưỡi thay thế cho Wahl Detailer sắc bén nhất." },
  { id: 24, name: "Lược bán nguyệt Chaoba", price: 80000, oldPrice: 100000, image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: true, isBestSeller: true, isNew: false, description: "Lược chống tĩnh điện, chuyên dùng uốn cong pompadour." },
  { id: 25, name: "Cọ phủi tóc cổ ngựa", price: 150000, oldPrice: null, image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: false, isBestSeller: false, isNew: true, description: "Lông mềm mịn không gây rát vùng gáy khách hàng." },
  { id: 26, name: "Khăn mặt lạnh cạo râu (x12)", price: 200000, oldPrice: null, image: "https://images.unsplash.com/photo-1632832049611-37dcaadc0f94?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: false, isBestSeller: false, isNew: false, description: "Khăn sợi bông Ai Cập giữ nhiệt đắp mặt cạo siêu chill." },
  { id: 27, name: "Tông đơ viền Kiepe Zero Estremo", price: 1800000, oldPrice: 2000000, image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=600&auto=format&fit=crop", category: "tong-do", isSale: true, isBestSeller: false, isNew: true, description: "Thương hiệu Ý cao cấp chuyên dụng góc hẹp." },
  { id: 28, name: "Máy kẹp tóc chỉnh nhiệt Codos", price: 650000, oldPrice: null, image: "https://plus.unsplash.com/premium_photo-1677093206456-df52caab2b2a?q=80&w=600&auto=format&fit=crop", category: "may-lam-toc", isSale: false, isBestSeller: false, isNew: false, description: "Kẹp thẳng và uốn giả cho phái nam tóc hơi rối." },
  { id: 29, name: "Sáp Blumaan Tê Giác", price: 540000, oldPrice: null, image: "https://images.unsplash.com/photo-1590159754378-0112aa5c75de?q=80&w=600&auto=format&fit=crop", category: "sap-vuot", isSale: false, isBestSeller: true, isNew: false, description: "Sáp đa dụng Pre-stlying rất được ưa chuộng." },
  { id: 30, name: "Túi đồ nghề đeo thắt lưng Da mộc", price: 890000, oldPrice: 950000, image: "https://images.unsplash.com/photo-1582643875323-289569ceb4ec?q=80&w=600&auto=format&fit=crop", category: "khac", isSale: true, isBestSeller: false, isNew: true, description: "Bao đeo kéo phong cách thủ công siêu bền lãng tử." },
];

// Fallback logic cho Gallery: Nếu không có mảng images hoặc thiếu ảnh, tự động thêm filler
export const mockProducts = rawProducts.map(p => {
  const images = p.images && p.images.length >= 3 ? p.images : [
    p.image,
    "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=600&auto=format&fit=crop", // placeholder 1 (Grooming setup)
    "https://plus.unsplash.com/premium_photo-1661299307738-4e899cb63d76?q=80&w=600&auto=format&fit=crop" // placeholder 2 (Haircut toolkit)
  ];
  return { ...p, images };
});
