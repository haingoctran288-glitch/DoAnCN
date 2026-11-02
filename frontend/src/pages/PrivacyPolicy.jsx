import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Share2, AlertCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-primary pt-32 pb-24 text-gray-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <Shield className="w-16 h-16 text-accent mx-auto mb-6 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
          <h1 className="text-4xl md:text-5xl font-black font-heading text-white mb-4 tracking-wider uppercase">
            Chính Sách <span className="text-accent">Bảo Mật</span>
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
              <Eye className="text-accent" /> 1. Thu thập thông tin cá nhân
            </h2>
            <p className="leading-relaxed mb-4 text-gray-400">
              Hornet Royale thu thập thông tin cá nhân của bạn khi bạn sử dụng dịch vụ đặt lịch, mua hàng, hoặc đăng ký tài khoản trên hệ thống của chúng tôi. Các thông tin thu thập bao gồm:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Họ và tên</li>
              <li>Số điện thoại liên hệ</li>
              <li>Địa chỉ email</li>
              <li>Địa chỉ giao hàng (nếu mua sản phẩm)</li>
              <li>Lịch sử đặt lịch và mua sắm tại cửa hàng</li>
            </ul>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Database className="text-accent" /> 2. Mục đích sử dụng thông tin
            </h2>
            <p className="leading-relaxed mb-4 text-gray-400">
              Thông tin của quý khách được sử dụng với các mục đích cụ thể nhằm mang lại trải nghiệm dịch vụ tốt nhất:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-400">
              <li>Xử lý và quản lý các lịch đặt cắt tóc/dịch vụ của bạn.</li>
              <li>Thực hiện việc giao hàng, xử lý đơn đặt hàng sản phẩm.</li>
              <li>Liên hệ xác nhận thông tin, gửi thông báo thay đổi về lịch hẹn.</li>
              <li>Gửi các chương trình khuyến mãi, ưu đãi đặc quyền dành riêng cho khách hàng VIP.</li>
              <li>Cải thiện và nâng cao chất lượng dịch vụ của Hornet Royale.</li>
            </ul>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Lock className="text-accent" /> 3. Bảo vệ dữ liệu của bạn
            </h2>
            <p className="leading-relaxed text-gray-400">
              Chúng tôi sử dụng các biện pháp bảo mật hiện đại nhất để đảm bảo an toàn cho dữ liệu cá nhân của bạn. Dữ liệu thanh toán của bạn (nếu có) được xử lý thông qua các đối tác thanh toán uy tín như VNPay, MoMo và chúng tôi không lưu trữ trực tiếp các thông tin thẻ tín dụng nhạy cảm của bạn trên hệ thống máy chủ của Hornet Royale.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <Share2 className="text-accent" /> 4. Chia sẻ thông tin với bên thứ ba
            </h2>
            <p className="leading-relaxed text-gray-400">
              Hornet Royale cam kết <strong className="text-white">KHÔNG</strong> bán, trao đổi hoặc chia sẻ thông tin cá nhân của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại. Chúng tôi chỉ chia sẻ thông tin trong các trường hợp bắt buộc như: đối tác giao hàng (Shipper), đối tác thanh toán, hoặc khi có yêu cầu từ cơ quan chức năng có thẩm quyền theo quy định của pháp luật.
            </p>
          </div>

          <div className="bg-[#111] p-8 rounded-2xl border border-gray-800 shadow-xl hover:border-accent/30 transition-colors duration-300">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
              <AlertCircle className="text-accent" /> 5. Quyền lợi của khách hàng
            </h2>
            <p className="leading-relaxed text-gray-400">
              Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa dữ liệu cá nhân của mình bất kỳ lúc nào thông qua phần "Tài khoản" trên trang web. Nếu bạn có bất kỳ thắc mắc nào về quyền riêng tư, vui lòng liên hệ với bộ phận CSKH của chúng tôi qua hotline hoặc email hỗ trợ.
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

export default PrivacyPolicy;
