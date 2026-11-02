import React from 'react';
import { Quote } from 'lucide-react';

const AboutPhilosophy = () => {
  return (
    <section className="py-32 relative overflow-hidden bg-[#080808]">
      {/* Background Decorative */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent rounded-full animate-ping-slow"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div className="flex justify-center mb-12" data-aos="zoom-in">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center text-accent border border-accent/20">
            <Quote className="w-8 h-8" />
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl font-heading font-black text-white mb-12 leading-tight" data-aos="fade-up">
          "Phong cách tạo nên <br />
          <span className="text-accent italic">bản lĩnh phái mạnh</span>"
        </h2>

        <div className="max-w-3xl mx-auto space-y-8" data-aos="fade-up" data-aos-delay="200">
          <p className="text-gray-400 text-xl md:text-2xl font-medium leading-relaxed italic">
            Barber không chỉ là một dịch vụ, mà là một phong cách sống. Đó là sự tự tin, 
            sự chỉn chu và niềm tự hào về diện mạo của mỗi người đàn ông hiện đại.
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="h-[1px] w-12 bg-gray-800"></div>
            <span className="text-accent font-black uppercase tracking-[5px] text-xs">Our Philosophy</span>
            <div className="h-[1px] w-12 bg-gray-800"></div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 6s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutPhilosophy;
