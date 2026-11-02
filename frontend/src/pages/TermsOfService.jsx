import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Calendar, CreditCard, Ban, HelpCircle, Scale } from 'lucide-react';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-primary pt-32 pb-24 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <FileText className="w-16 h-16 text-accent mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-4 tracking-wider uppercase">
            Điều Khoản <span className="text-accent">Dịch Vụ</span>
          </h1>
          <p className="text-lg text-gray-400">
            Cập nhật lần cuối: Tháng 7, 2026
          </p>
          <div className="w-24 h-1 bg-accent mx-auto mt-8"></div>
        </div>

        {/* Content Section */}
        <div className="space-y-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          
          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Scale className="text-accent" /> 1. Chấp nhận điều khoản
            </h2>
            <p className="leading-relaxed text-gray-400">
              Bằng việc truy cập, sử dụng trang web và trải nghiệm dịch vụ tại Hornet Royale, quý khách đồng ý tuân thủ các Điều khoản Dịch vụ này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản, vui lòng không sử dụng các dịch vụ của chúng tôi.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Calendar className="text-accent" /> 2. Chính sách đặt lịch và Hủy lịch
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-400">
              <li>Quý khách có thể đặt lịch trước tối đa 7 ngày và chọn thợ cắt tóc mong muốn.</li>
              <li>Vui lòng đến đúng giờ. Hệ thống chỉ giữ chỗ của quý khách tối đa <strong className="text-white">15 phút</strong> so với thời gian đã hẹn. Quá thời gian này, lịch đặt có thể bị hủy để nhường chỗ cho khách hàng khác.</li>
              <li>Nếu muốn hủy hoặc dời lịch, quý khách vui lòng thực hiện trên hệ thống website hoặc gọi điện cho hotline trước giờ cắt ít nhất <strong className="text-white">30 phút</strong>.</li>
              <li>Tài khoản có hành vi đặt lịch ảo hoặc hủy lịch quá nhiều lần mà không có lý do chính đáng có thể bị từ chối phục vụ hoặc khóa chức năng đặt lịch tạm thời.</li>
            </ul>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <CreditCard className="text-accent" /> 3. Mua hàng và Thanh toán
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-gray-400">
              <li>Chúng tôi cung cấp các sản phẩm chăm sóc tóc, sáp vuốt tóc chính hãng. Mọi đơn đặt hàng đều có thể thanh toán trực tuyến qua VNPay/MoMo hoặc thanh toán khi nhận hàng (COD).</li>
              <li>Khách hàng thanh toán COD có dấu hiệu "bùng hàng" (không nhận hàng khi giao đến) sẽ bị <strong className="text-accent">khóa vĩnh viễn tính năng COD</strong> trên hệ thống.</li>
              <li>Chính sách hoàn tiền (Refund) chỉ áp dụng cho các đơn hàng đã thanh toán online nhưng bị lỗi do hệ thống, hết hàng hoặc hủy lịch trước thời gian quy định theo thông báo của Admin.</li>
            </ul>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Ban className="text-accent" /> 4. Trách nhiệm của khách hàng
            </h2>
            <p className="leading-relaxed text-gray-400">
              Khách hàng cần cung cấp thông tin chính xác khi đăng ký tài khoản và đặt lịch. Không sử dụng các từ ngữ tục tĩu, gây rối trong phần đánh giá (Review) dịch vụ, sản phẩm. Hornet Royale có quyền xóa các đánh giá vi phạm tiêu chuẩn cộng đồng mà không cần báo trước.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <HelpCircle className="text-accent" /> 5. Thay đổi điều khoản
            </h2>
            <p className="leading-relaxed text-gray-400">
              Hornet Royale có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ phần nào trong Điều khoản Dịch vụ này vào bất kỳ lúc nào. Các thay đổi có hiệu lực ngay khi được đăng trên trang web. Việc quý khách tiếp tục sử dụng dịch vụ sau khi các thay đổi được đăng tải đồng nghĩa với việc quý khách chấp nhận những thay đổi đó.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/" className="inline-block px-8 py-3 bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-primary font-bold uppercase tracking-widest transition-all duration-300">
            Trở về Trang Chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
