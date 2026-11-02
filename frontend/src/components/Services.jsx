import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const servicesList = [
  {
    id: 1,
    title: '',
    icon: <Crown className="h-5 w-5" />,
    description: 'Có những thứ không thể thay đổi, nhưng kiểu tóc và phong độ của bạn là do bạn quyết định ngay khi bước vào cánh cửa này.',
    image: '/images/b1.jpg'
  },
  {
    id: 2,
    title: '',
    icon: <ShieldCheck className="h-5 w-5" />,
    description: 'Chúng tôi không chỉ cầm kéo để cắt đi những sợi tóc thừa, chúng tôi dùng tâm huyết để tạc nên diện mạo của một người đàn ông thành đạt.',
    image: '/images/b3.jpg'
  },
  {
    id: 3,
    title: '',
    icon: <Sparkles className="h-5 w-5" />,
    description: 'Đàn ông có thể không nói nhiều, nhưng mái tóc và bộ râu sẽ thay họ kể câu chuyện về sự chỉn chu và đẳng cấp của chính mình.',
    image: '/images/b6.jpg'
  }
];

const Services = () => {
  return (
    <section id="services" className="py-32 bg-[#0B0B0B] text-gray-300 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-accent/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-accent/10 blur-[200px] rounded-full"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Polygon Honeycomb Layout */}
        <div className="flex flex-wrap justify-center gap-10 md:gap-12 lg:gap-16">
          {servicesList.map((service, index) => (
            <motion.div 
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`w-full sm:w-[340px] md:w-[360px] lg:w-[420px] ${index % 2 !== 0 ? 'lg:mt-32' : ''}`}
            >
              <Link to="/services" className="relative group block w-full aspect-[4/5] mx-auto">
                
                {/* 1. OUTER HEXAGON (Gold Border) */}
                <div 
                  className="absolute inset-0 bg-accent/20 transition-all duration-700"
                  style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                >
                  {/* INNER HEXAGON (Image Container) */}
                  <div 
                    className="absolute inset-[1px] bg-[#111] overflow-hidden"
                    style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
                  >
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-70"
                    />
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                  </div>
                </div>

                {/* 2. PREMIUM QUOTE CARD */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[92%] z-20">
                  <div className="relative bg-[#050505]/90 backdrop-blur-2xl rounded-2xl p-6 border-l-2 border-accent shadow-2xl transition-all duration-500">
                    
                    {/* Integrated Icon Badge */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent">
                        {service.icon}
                      </div>
                      <div className="h-[1px] flex-grow bg-white/10"></div>
                    </div>

                    <p className="text-gray-200 text-[13px] leading-[1.6] font-medium italic opacity-95">
                      "{service.description}"
                    </p>
                  </div>
                </div>

              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Services;
