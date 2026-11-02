import React from 'react';
import { Scissors, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-black pt-16 pb-8 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 text-center md:text-left">
          {/* Brand */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 md:gap-4 justify-center md:justify-start">
              <img 
                src="/images/logo.png" 
                alt="Hornet Royale Logo" 
                className="h-[52px] md:h-[64px] w-auto object-contain mix-blend-screen brightness-110 drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]" 
              />
              <span className="font-heading text-xl md:text-2xl font-black tracking-[0.15em] uppercase text-white mt-1">
                HORNET <span className="text-accent drop-shadow-[0_0_10px_rgba(212,175,55,0.4)]">ROYALE</span>
              </span>
            </div>
            <p className="text-gray-400 leading-relaxed text-center md:text-left">
              Địa điểm lý tưởng để các quý ông tân trang lại phong cách. Đội ngũ thợ nhợ chuyên nghiệp, không gian sang trọng và dịch vụ đẳng cấp.
            </p>
            <div className="flex space-x-4 justify-center md:justify-start w-full">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#1877F2] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#E4405F] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-[#FF0000] hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-heading font-bold text-xl mb-6 uppercase tracking-wider relative inline-block text-center md:text-left">
              Khám phá
              <span className="absolute -bottom-2 left-1/4 md:left-0 w-1/2 h-0.5 bg-accent"></span>
            </h4>
            <ul className="space-y-4 w-full text-center md:text-left">
              <li><Link to="/" className="text-gray-400 hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start"><span className="text-accent mr-2 text-xs">◆</span> Trang chủ</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start"><span className="text-accent mr-2 text-xs">◆</span> Dịch vụ</Link></li>
              <li><Link to="/booking" className="text-gray-400 hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start"><span className="text-accent mr-2 text-xs">◆</span> Đặt lịch</Link></li>
              <li><Link to="/kienthuc" className="text-gray-400 hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start"><span className="text-accent mr-2 text-xs">◆</span> Kiến thức</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-accent transition-colors inline-flex items-center justify-center md:justify-start"><span className="text-accent mr-2 text-xs">◆</span> Về chúng tôi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div id="contact" className="flex flex-col items-center md:items-start">
            <h4 className="text-white font-heading font-bold text-xl mb-6 uppercase tracking-wider relative inline-block text-center md:text-left">
              Liên hệ
              <span className="absolute -bottom-2 left-1/4 md:left-0 w-1/2 h-0.5 bg-accent"></span>
            </h4>
            <ul className="space-y-6 w-full text-center md:text-left">
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-0">
                <MapPin className="h-6 w-6 text-accent md:mr-4 shrink-0" />
                <span className="text-gray-400">123 Đường Nam Kỳ Khởi Nghĩa, Quận 1, Thành phố Hồ Chí Minh</span>
              </li>
              <li className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-0">
                <Phone className="h-6 w-6 text-accent md:mr-4 shrink-0" />
                <span className="text-gray-400">Hotline: 0912 345 678</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 text-center md:text-left gap-4 md:gap-0 pb-20 md:pb-0">
          <p>&copy; {new Date().getFullYear()} Barber Shop. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-accent transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
