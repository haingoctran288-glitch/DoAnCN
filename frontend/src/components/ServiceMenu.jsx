import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Scissors, User, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const serviceCategories = [
  { name: 'Tất cả Dịch vụ', slug: 'all', desc: 'Xem toàn bộ menu dịch vụ', icon: Scissors },
  { name: 'Dịch vụ Nam', slug: 'nam', desc: 'Cắt tóc, tạo kiểu, chăm sóc da & râu', icon: User },
  { name: 'Dịch vụ cho Nữ', slug: 'nu', desc: 'Chăm sóc toàn diện, tạo kiểu chuyên nghiệp', icon: Sparkles }
];

const ServiceMenu = ({ className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Menu Trigger */}
      <Link 
        to="/services"
        className="text-gray-300 group-hover:text-accent uppercase tracking-wider text-sm font-medium transition-colors py-2 flex items-center gap-1 cursor-pointer h-full"
      >
        Dịch vụ
        <ChevronDown className="h-4 w-4 text-accent transition-transform duration-300 group-hover:rotate-180 group-hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
      </Link>

      {/* Dropdown Content - Premium Service Menu */}
      <div className="absolute top-[80%] left-0 mt-1 w-max min-w-[650px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50">
        <div className="pt-4">
          <div className="bg-[#0a0a0a] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-gray-800 p-6 flex gap-6">
            
            {/* Cột 1: Danh sách dịch vụ */}
            <div className="flex-1">
              <h3 className="text-white font-bold uppercase tracking-widest text-[11px] mb-4 pb-2 border-b border-gray-800/80 flex items-center gap-2 text-gray-400">
                <Scissors className="h-3.5 w-3.5 text-accent" />
                Hạng mục dịch vụ
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {serviceCategories.map((cat, idx) => {
                  const Icon = cat.icon;
                  return (
                    <Link 
                      key={idx}
                      to={cat.slug === 'all' ? '/services' : `/services/${cat.slug}`}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-accent/10 transition-all duration-200 group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-800/40 border border-gray-700/50 flex items-center justify-center text-accent group-hover/item:bg-accent group-hover/item:text-primary transition-all duration-300">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-left">
                        <span className="block text-sm font-bold text-gray-200 group-hover/item:text-accent transition-colors">
                          {cat.name}
                        </span>
                        <span className="block text-[11px] text-gray-500 font-medium mt-0.5">
                          {cat.desc}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Cột 2: Banner đặt lịch VIP */}
            <div className="w-64 border-l border-gray-800 pl-6 flex flex-col justify-between">
              <div>
                <h3 className="text-accent font-bold uppercase tracking-widest text-[11px] mb-4 flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  ĐẶT LỊCH NHANH
                </h3>
                <div className="bg-gradient-to-br from-[#111] to-[#0d0d0d] border border-gray-800/80 rounded-xl p-4 relative overflow-hidden group/card">
                  <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/5 rounded-full blur-xl"></div>
                  
                  <span className="text-xs text-accent font-bold uppercase tracking-wider block mb-1">Trải Nghiệm Premium</span>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-4">
                    Đảm bảo thời gian của bạn. Đặt lịch trước với Stylist hàng đầu của Hornet Royale để không phải chờ đợi.
                  </p>
                  
                  <Link 
                    to="/booking"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-lg bg-accent text-primary text-xs font-bold hover:bg-white transition-colors duration-300 shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
                  >
                    ĐẶT LỊCH NGAY
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              <div className="text-left text-[11px] text-gray-500 border-t border-gray-800/50 pt-4 mt-4">
                Hotline hỗ trợ: <span className="text-white font-bold">1900 xxxx</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceMenu;
