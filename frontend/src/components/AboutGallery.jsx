import React from 'react';
import { motion } from 'framer-motion';

const items = [
  {
    url: 'https://images.unsplash.com/photo-1593702275677-f916c8c96045?q=80&w=1000&auto=format&fit=crop',
    title: 'Classic Cut',
    size: 'md:col-span-2 md:row-span-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop',
    title: 'Fade mastery',
    size: 'col-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1621605815841-2cd6060f19a6?q=80&w=1000&auto=format&fit=crop',
    title: 'Precision Tools',
    size: 'col-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?q=80&w=1000&auto=format&fit=crop',
    title: 'Beard Art',
    size: 'md:col-span-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1512690199101-837340f1a660?q=80&w=1000&auto=format&fit=crop',
    title: 'Authentic Vibe',
    size: 'col-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1000&auto=format&fit=crop',
    title: 'Golden Glow',
    size: 'col-span-1'
  }
];

const AboutGallery = () => {
  return (
    <section className="py-32 bg-[#050505]">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <span className="text-accent text-[12px] font-black uppercase tracking-[6px] mb-6 block">Gallery</span>
            <h2 className="text-5xl md:text-7xl font-heading font-black text-white leading-tight">
              Khoảnh khắc <br /> <span className="text-gray-600">tại Barber Shop</span>
            </h2>
          </div>
          <p className="text-gray-500 max-w-sm font-medium mb-4 italic">
            Ghi lại những khoảnh khắc làm nghề đầy đam mê và phong cách của các nghệ nhân tại tiệm.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1 }}
              className={`group relative overflow-hidden rounded-[40px] border border-white/5 ${item.size}`}
            >
              <img 
                src={item.url} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                <h4 className="text-white text-2xl font-heading font-bold italic transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  {item.title}
                </h4>
              </div>
              
              {/* Luxury Frame */}
              <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/30 rounded-[40px] transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutGallery;
