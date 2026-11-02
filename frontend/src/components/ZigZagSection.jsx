import React, { useEffect } from 'react';
import { Award, Star } from 'lucide-react';

const ZigZagSection = () => {
  return (
    <section className="py-24 bg-[#0a0a0a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Block 1: Image Left, Text Right */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-32 lg:mb-40">
          <div className="flex-1 w-full" data-aos="fade-right">
            <div className="relative group">
              <div className="absolute -inset-4 bg-accent/20 rounded-[24px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800&h=1000" 
                alt="Phong cách bản lĩnh" 
                className="w-full h-[450px] lg:h-[550px] object-cover rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/10 backdrop-blur-xl border border-accent/20 rounded-2xl flex items-center justify-center hidden lg:flex">
                <Award className="w-12 h-12 text-accent animate-pulse" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:mt-20" data-aos="fade-left">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-8 lg:p-12 shadow-2xl relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">01</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6 leading-tight">
                Phong cách tạo nên <span className="text-accent italic">bản lĩnh</span>
              </h2>
              <div className="w-20 h-1 bg-accent mb-8 rounded-full"></div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                Một người đàn ông hiện đại không chỉ cần gọn gàng mà còn phải có phong cách riêng. 
                Từ mái tóc cho đến từng chi tiết nhỏ, tất cả đều góp phần tạo nên sự tự tin và đẳng cấp.
              </p>
              <p className="text-gray-500 italic border-l-4 border-accent/30 pl-4">
                "Chúng tôi không chỉ cắt tóc, chúng tôi kiến tạo diện mạo cho những quý ông thực thụ."
              </p>
            </div>
          </div>
        </div>

        {/* Block 2: Text Left, Image Right */}
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div className="flex-1 w-full" data-aos="fade-left">
            <div className="relative group">
              <div className="absolute -inset-4 bg-accent/20 rounded-[24px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800&h=1000" 
                alt="Đẳng cấp quý ông" 
                className="w-full h-[450px] lg:h-[550px] object-cover rounded-[20px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent/10 backdrop-blur-xl border border-accent/20 rounded-2xl flex items-center justify-center hidden lg:flex">
                <Star className="w-12 h-12 text-accent animate-bounce" />
              </div>
            </div>
          </div>
          
          <div className="flex-1 w-full lg:mt-20" data-aos="fade-right">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[20px] p-8 lg:p-12 shadow-2xl relative">
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-primary font-bold text-xl">02</span>
              </div>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold text-white mb-6 leading-tight text-right lg:text-left">
                Đẳng cấp đến từ <span className="text-accent italic">sự chăm chút</span>
              </h2>
              <div className="w-20 h-1 bg-accent mb-8 rounded-full ml-auto lg:ml-0"></div>
              <p className="text-gray-400 text-lg leading-relaxed mb-6 text-right lg:text-left">
                Không phải ngẫu nhiên mà những quý ông thành công luôn đầu tư vào diện mạo. 
                Một kiểu tóc phù hợp có thể thay đổi hoàn toàn thần thái và vị thế của bạn trong mắt người đối diện.
              </p>
              <p className="text-gray-500 italic border-r-4 lg:border-r-0 lg:border-l-4 border-accent/30 pr-4 lg:pr-0 lg:pl-4 text-right lg:text-left">
                "Nơi hội tụ của những kỹ thuật truyền thống và xu hướng hiện đại bậc nhất."
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ZigZagSection;
