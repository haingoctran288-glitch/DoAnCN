import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const QuoteSection = () => {
  return (
    <section className="py-40 relative bg-[#0B0B0B] overflow-hidden">
      {/* Background Cinematic Texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-accent rounded-full animate-pulse"></div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex justify-center mb-16"
        >
          <div className="w-24 h-24 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-accent">
            <Quote className="w-10 h-10" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-7xl font-heading font-black text-white leading-tight max-w-5xl mx-auto"
        >
          “Phong cách không chỉ là mái tóc. <br />
          <span className="italic text-accent">Đó là sự tự tin của người đàn ông hiện đại.</span>”
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: 200 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="h-[1px] bg-accent/50 mx-auto mt-20"
        ></motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-gray-500 font-black uppercase tracking-[8px] text-xs"
        >
          Barber Shop Philosophy
        </motion.p>
      </div>
    </section>
  );
};

export default QuoteSection;
