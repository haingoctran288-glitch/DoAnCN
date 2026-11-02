import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Flame, Star, Sparkles, Scissors, Wind, Droplets, ArrowRight } from 'lucide-react';
import { productCategories, highlightMenu } from '../data/products';

const getIcon = (slug) => {
  switch (slug) {
    case 'sale': return Flame;
    case 'best-seller': return Star;
    case 'new': return Sparkles;
    case 'tong-do': return Scissors;
    case 'may-lam-toc': return Wind;
    case 'sap-vuot': return Droplets;
    default: return ArrowRight;
  }
};

const getColor = (slug) => {
  switch (slug) {
    case 'sale': return 'text-red-500 bg-red-500/10 border-red-500/30';
    case 'best-seller': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    case 'new': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
    default: return 'text-gray-400 bg-gray-800/50 border-gray-700';
  }
};

const ProductMenu = ({ className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Menu Trigger */}
      <Link 
        to="/products"
        className="text-gray-300 group-hover:text-accent uppercase tracking-wider text-sm font-medium transition-colors py-2 flex items-center gap-1 cursor-pointer h-full"
      >
        Sản phẩm
        <ChevronDown className="h-4 w-4 text-accent transition-transform duration-300 group-hover:rotate-180 group-hover:drop-shadow-[0_0_6px_rgba(212,175,55,0.6)]" />
      </Link>

      {/* Dropdown Content - Mega Menu */}
      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 mt-1 w-max min-w-[700px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-3 group-hover:translate-y-0 z-50">
        <div className="pt-4"> {/* Spacer để không bị lỗi rớt khi di chuột */}
          <div className="bg-[#0a0a0a] rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] border border-gray-800 p-6 flex gap-8">
            
            {/* Cột 1: Danh mục */}
            <div className="w-64">
              <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4 pb-2 border-b border-gray-800 flex items-center gap-2">
                <Scissors className="h-4 w-4 text-accent" />
                Danh Mục
              </h3>
              <ul className="space-y-1">
                <li className="mb-2">
                    <Link to="/products" className="block px-3 py-2 text-accent bg-accent/10 font-bold hover:bg-accent/20 rounded-md transition-all duration-200 uppercase text-xs tracking-wider">
                      Tất cả sản phẩm
                    </Link>
                </li>
                {productCategories.map((cat, idx) => (
                  <li key={idx}>
                    <Link 
                      to={`/products/${cat.slug}`}
                      className="block px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-md transition-all duration-200"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Cột 2: Highlight Section - HOÀNH TRÁNG */}
            <div className="flex-1 flex flex-col justify-center border-l border-gray-800 pl-8">
              <h3 className="text-accent font-bold uppercase tracking-widest text-sm mb-4 text-center">Nổi Bật</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {highlightMenu.map((item, idx) => {
                  const Icon = getIcon(item.slug);
                  const colors = getColor(item.slug);
                  
                  return (
                    <Link
                      key={idx}
                      to={`/products/${item.slug}`}
                      className="group/item relative flex items-center gap-4 p-4 rounded-xl bg-[#111] border border-gray-800 hover:border-accent/40 hover:bg-[#1a1a1a] transition-all duration-300 overflow-hidden"
                    >
                      {/* Hiệu ứng glow dưới background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/0 to-accent/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>

                      <div className={`p-3 rounded-xl border transition-colors duration-300 ${colors} group-hover/item:border-current`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="relative z-10 flex-1">
                        <span className="text-white text-lg font-bold group-hover/item:text-accent transition-colors block">{item.name}</span>
                        <span className="text-gray-500 text-xs">Phát hiện những Deal chấn động Barbershop</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-600 group-hover/item:text-accent group-hover/item:translate-x-1 transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductMenu;
