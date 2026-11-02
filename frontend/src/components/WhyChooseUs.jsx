import React from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

const reasons = [
  {
    title: 'Barber chuyên nghiệp',
    desc: 'Đội ngũ nghệ nhân tay nghề cao, am hiểu sâu sắc về phong cách và kỹ thuật.',
    icon: <UserCheck className="w-8 h-8" />
  },
  {
    title: 'Không gian Luxury',
    desc: 'Trải nghiệm đẳng cấp trong không gian được thiết kế tinh tế và đầy nghệ thuật.',
    icon: <Sparkles className="w-8 h-8" />
  },
  {
    title: 'Dịch vụ cá nhân hóa',
    desc: 'Tư vấn và thực hiện kiểu tóc dựa trên khuôn mặt, chất tóc và phong cách riêng.',
    icon: <HeartHandshake className="w-8 h-8" />
  },
  {
    title: 'Sản phẩm cao cấp',
    desc: 'Sử dụng 100% các dòng mỹ phẩm chăm sóc tóc và râu hàng đầu thế giới.',
    icon: <ShieldCheck className="w-8 h-8" />
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-32 bg-[#050505] relative overflow-hidden">
      {/* Decorative Lights */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="text-center mb-24">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-accent text-[12px] font-black uppercase tracking-[6px] mb-6 block"
          >
            Why Choose Us
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-heading font-black text-white"
          >
            Sự khác biệt <br /> tạo nên <span className="text-gray-600">đẳng cấp</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="group p-10 bg-[#0B0B0B] border border-white/5 rounded-[40px] transition-all duration-500 hover:border-accent/40 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-10 group-hover:bg-accent group-hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-500">
                <div className="text-accent group-hover:text-primary transition-colors duration-500">
                  {item.icon}
                </div>
              </div>

              <h4 className="text-white text-2xl font-heading font-bold mb-6 group-hover:text-accent transition-colors">
                {item.title}
              </h4>
              
              <p className="text-gray-500 text-sm leading-relaxed font-medium opacity-80 group-hover:text-gray-400 transition-colors">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
