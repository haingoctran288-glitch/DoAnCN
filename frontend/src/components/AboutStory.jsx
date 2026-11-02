import React from 'react';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

const AboutStory = () => {
  return (
    <section className="py-32 bg-[#0B0B0B] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">

          {/* LEFT: COLLAGE IMAGES */}
          <div className="w-full lg:w-1/2 relative h-[350px] sm:h-[450px] lg:h-[600px]">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="absolute top-0 left-0 w-[80%] h-[80%] rounded-[40px] overflow-hidden border border-white/5 shadow-2xl z-20"
            >
              <img
                src="/images/c4.jpg"
                alt="Barber Skill"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.3 }}
              className="absolute bottom-0 right-0 w-[60%] h-[60%] rounded-[40px] overflow-hidden border-4 border-[#0B0B0B] shadow-2xl z-30 transform translate-y-10"
            >
              <img
                src="/images/c3.jpg"
                alt="Details"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay"></div>
            </motion.div>

            {/* Decorative Gold Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-accent/10 rounded-full scale-110 z-0"></div>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-10 border border-accent/20">
                <Scissors className="w-8 h-8 text-accent" />
              </div>

              <h2 className="text-4xl md:text-6xl font-heading font-black text-white leading-tight mb-8">
                Không chỉ là <br />
                <span className="text-gray-600 italic">một tiệm cắt tóc</span>
              </h2>

              <div className="space-y-8">
                <p className="text-gray-400 text-lg leading-relaxed font-medium opacity-80">
                  Tại Barber Shop, chúng tôi không chỉ cung cấp dịch vụ chăm sóc tóc. Chúng tôi tạo dựng một cộng đồng, một không gian nơi mỗi người đàn ông có thể tìm thấy bản sắc riêng của mình.
                </p>

                <p className="text-gray-400 text-lg leading-relaxed font-medium opacity-80 border-l-2 border-accent/30 pl-8 italic">
                  "Sự hoàn hảo nằm ở những chi tiết nhỏ nhất. Đó là lý do chúng tôi dành trọn tâm huyết cho từng đường kéo, từng nét cạo."
                </p>

                <div className="pt-10 grid grid-cols-2 gap-10">
                  <div>
                    <h4 className="text-accent text-3xl font-heading font-black mb-2">10+</h4>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Năm kinh nghiệm</p>
                  </div>
                  <div>
                    <h4 className="text-accent text-3xl font-heading font-black mb-2">50k+</h4>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest">Khách hàng hài lòng</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutStory;
