import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Scissors } from 'lucide-react';

const Booking = () => {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    [contentRef, img1Ref, img2Ref].forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  // Parallax nhẹ cho ảnh khi scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = -rect.top / window.innerHeight;

      if (img1Ref.current) {
        img1Ref.current.style.transform = `translateY(${scrollProgress * 25}px)`;
      }
      if (img2Ref.current) {
        img2Ref.current.style.transform = `translateY(${scrollProgress * -15}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="booking"
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-36 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}
    >
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-accent/[0.02] rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent/[0.015] rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-8 xl:gap-16">

          {/* === CỘT TRÁI: HÌNH ẢNH === */}
          <div className="w-full lg:w-[58%] relative" style={{ minHeight: 520 }}>

            {/* Ảnh 1 – Lớn, phía trên bên trái */}
            <div
              ref={img1Ref}
              className="booking-fade-element relative z-10 w-[75%] md:w-[70%]"
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="group relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6)]">
                <img
                  src="/images/mau.avif"
                  alt="Barber chuyên nghiệp"
                  className="w-full h-[320px] sm:h-[380px] md:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                {/* Gold accent line */}
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent to-accent/0"></div>
              </div>
            </div>

            {/* Ảnh 2 – Nhỏ hơn, phía dưới bên phải, overlap */}
            <div
              ref={img2Ref}
              className="booking-fade-element relative z-20 w-[55%] md:w-[50%] ml-auto -mt-16 sm:-mt-20 md:-mt-24 mr-0 lg:-mr-4"
              style={{ transitionDelay: '0.3s' }}
            >
              <div className="group relative overflow-hidden rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-white/[0.06]">
                <img
                  src="/images/mau2.avif"
                  alt="Gentleman phong cách"
                  className="w-full h-[240px] sm:h-[280px] md:h-[300px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-accent/0 via-accent/60 to-accent/0"></div>
              </div>
            </div>

            {/* Decorative floating badge */}
            <div className="absolute -right-2 top-8 z-30 hidden lg:flex items-center gap-2 bg-accent/10 backdrop-blur-sm border border-accent/20 rounded-full px-4 py-2">
              <Scissors className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs font-bold tracking-wider uppercase">Since 2020</span>
            </div>
          </div>

          {/* === CỘT PHẢI: NỘI DUNG === */}
          <div
            ref={contentRef}
            className="booking-fade-element w-full lg:w-[42%] lg:pt-16 xl:pt-24"
            style={{ transitionDelay: '0.25s' }}
          >
            {/* Subtitle */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-[2px] bg-accent"></div>
              <span className="text-accent text-sm font-bold uppercase tracking-[3px]">
                Phong cách của quý ông hiện đại
              </span>
            </div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] xl:text-5xl font-heading font-bold text-white leading-tight mb-8">
              Chăm chút diện mạo
              <br />
              <span className="relative inline-block">
                Khẳng định
                <span className="text-accent"> đẳng cấp</span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M2 6C50 2 150 2 198 6" stroke="rgb(212,175,55)" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </svg>
              </span>
            </h2>

            {/* Description */}
            <div className="space-y-4 mb-10">
              <p className="text-gray-400 text-base lg:text-[17px] leading-relaxed">
                Một người đàn ông chỉn chu là người biết đầu tư cho diện mạo. Từ mái tóc được tạo kiểu tinh tế,
                đường cạo sắc nét cho đến phong thái tự tin — tất cả bắt đầu từ chiếc ghế barber.
              </p>
              <p className="text-gray-500 text-base leading-relaxed">
                Tại đây, chúng tôi không chỉ cắt tóc — chúng tôi kiến tạo phong cách.
                Mỗi dịch vụ là một trải nghiệm được cá nhân hóa, với đội ngũ barber được đào tạo bài bản
                và sản phẩm cao cấp nhập khẩu.
              </p>
            </div>

            {/* Stats mini */}
            <div className="flex items-center gap-8 mb-10 pb-10 border-b border-white/[0.06]">
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-accent">5+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Năm kinh nghiệm</div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-accent">10K+</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Khách hàng</div>
              </div>
              <div className="w-px h-10 bg-white/10"></div>
              <div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-accent">4.9</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Đánh giá</div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => navigate('/booking')}
              className="group relative inline-flex items-center gap-3 bg-accent hover:bg-accent/90 text-primary font-bold py-4 px-10 rounded-xl transition-all duration-300 uppercase tracking-widest text-sm focus:outline-none transform hover:-translate-y-1 shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_30px_rgba(212,175,55,0.45)]"
            >
              Đặt lịch ngay
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>

            <p className="text-gray-600 text-xs mt-4 tracking-wide">
              Đặt lịch trước để được phục vụ ưu tiên, không phải chờ đợi.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Booking;
