import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Scissors, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen py-32 flex items-center overflow-hidden bg-[#0a0a0a]">
      {/* 1. CINEMATIC BACKGROUND */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src="/images/banner0.png"
          alt="Luxury Barber Shop"
          className="w-full h-full object-cover opacity-60"
        />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black/40 z-10"></div>

        {/* Floating Light Particles (Simplified) */}
        <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-20 w-full pt-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* LEFT CONTENT */}
          <div className="w-full lg:w-3/5 relative z-20">
            {/* BACK BUTTON (Services Style) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -top-16 md:-top-28 left-0 flex items-center gap-4"
            >
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-accent hover:text-white transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm uppercase tracking-wider">Quay lại</span>
              </button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="h-[1px] w-12 bg-accent/50"></span>
                <span className="text-accent text-[10px] md:text-[12px] font-black uppercase tracking-[5px] drop-shadow-lg">
                  Premium Barber Experience
                </span>
              </div>

              <h1 className="text-6xl md:text-8xl lg:text-[110px] font-heading font-black text-white leading-[1.3] mb-2 tracking-[-2px] pb-8">
                Nâng tầm <br />
                <span className="inline-block pr-4 pb-4 bg-gradient-to-r from-[#d4af37] via-[#f9e498] to-[#d4af37] bg-clip-text text-transparent italic drop-shadow-2xl">
                  phong cách <br className="hidden md:block" /> phái mạnh
                </span>
              </h1>

              <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 max-w-xl font-medium opacity-80">
                Sự kết hợp giữa kỹ thuật Barber hiện đại, không gian Luxury chuẩn thượng lưu và tinh thần phục vụ cá nhân hóa tuyệt đối. Chúng tôi không chỉ cắt tóc, chúng tôi kiến tạo bản lĩnh.
              </p>

              <div className="flex flex-wrap gap-6">
                <button
                  onClick={() => navigate('/booking')}
                  className="group relative px-10 py-5 bg-accent rounded-full overflow-hidden transition-all duration-500 hover:shadow-[0_20px_40px_rgba(212,175,55,0.3)] hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500"></div>
                  <div className="relative flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="text-primary font-black uppercase tracking-widest text-sm">Đặt lịch ngay</span>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/services')}
                  className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full text-white font-black uppercase tracking-widest text-sm hover:bg-white/10 hover:border-accent/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Khám phá dịch vụ
                </button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT DECORATION */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            transition={{ delay: 0.5, duration: 1.5 }}
            className="w-full sm:w-3/4 md:w-2/3 lg:w-2/5 relative mt-16 lg:mt-0"
          >
            <div className="relative z-10 rounded-[40px] overflow-hidden border border-accent/30 shadow-[0_50px_100px_rgba(0,0,0,0.8)] transform rotate-[-2deg] hover:rotate-0 transition-transform duration-700 aspect-[4/5]">
              <img
                src="/images/o1.png"
                alt="Barber Art"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <div className="flex items-center gap-3 text-accent mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-[3px]">Masterpiece</span>
                </div>
                <p className="text-white font-heading text-2xl font-bold italic">Authentic Craftsmanship</p>
              </div>
            </div>

            {/* Background Layer */}
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full z-0 opacity-30 animate-pulse"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-accent/10 rounded-full z-0 animate-spin-slow"></div>
          </motion.div>

        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutHero;
