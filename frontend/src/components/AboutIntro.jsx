import React from 'react';
import { Check, Sparkles, ShieldCheck, Clock } from 'lucide-react';

const AboutIntro = () => {
  return (
    <section className="py-24 bg-primary overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left: Overlapping images */}
          <div className="lg:w-1/2 relative h-[500px] w-full" data-aos="fade-right">
            <div className="absolute top-0 left-0 w-3/4 h-[400px] rounded-3xl overflow-hidden border border-accent/20 z-10 shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1599351432247-f012fc1ed089?q=80&w=1000&auto=format&fit=crop" 
                alt="Barber cutting hair" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-2/3 h-[300px] rounded-3xl overflow-hidden border border-accent/40 z-20 shadow-2xl transform translate-y-8 -translate-x-8 lg:translate-y-12 lg:-translate-x-12">
              <img 
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop" 
                alt="Barber tattoo and tools" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
              />
              <div className="absolute inset-0 bg-accent/10 mix-blend-overlay"></div>
            </div>
            {/* Decorative element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 blur-[100px] rounded-full z-0"></div>
          </div>

          {/* Right: Content */}
          <div className="lg:w-1/2" data-aos="fade-left">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white mb-8 leading-tight">
              Không chỉ là <br />
              <span className="text-accent uppercase tracking-widest text-2xl md:text-3xl">Cắt tóc</span>
            </h2>
            
            <p className="text-gray-400 text-lg mb-10 leading-relaxed font-medium">
              Tại Barber Shop, chúng tôi tin rằng mái tóc là bản sắc cá nhân. 
              Mỗi đường kéo, mỗi nét cạo đều được thực hiện với sự tập trung tuyệt đối để mang lại không chỉ vẻ ngoài hoàn hảo mà còn là trải nghiệm thư giãn đích thực.
            </p>

            <div className="space-y-6">
              {[
                { title: 'Barber chuyên nghiệp', desc: 'Đội ngũ tay nghề cao với hơn 10 năm kinh nghiệm.', icon: <Check className="w-5 h-5" /> },
                { title: 'Không gian chuẩn Luxury', desc: 'Thiết kế sang trọng, âm nhạc chill, hương tinh dầu thư giãn.', icon: <Sparkles className="w-5 h-5" /> },
                { title: 'Sản phẩm cao cấp', desc: 'Sử dụng 100% sáp và mỹ phẩm nhập khẩu chính hãng.', icon: <ShieldCheck className="w-5 h-5" /> }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1 group-hover:text-accent transition-colors">{item.title}</h4>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutIntro;
