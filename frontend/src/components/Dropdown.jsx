import React from 'react';
import { Link } from 'react-router-dom';

const Dropdown = ({ title, items, linkPath, className = '' }) => {
  return (
    <div className={`group relative ${className}`}>
      <Link 
        to={linkPath || "#"} 
        className="text-gray-300 group-hover:text-accent uppercase tracking-wider text-sm font-medium transition-colors py-4 inline-flex items-center"
      >
        {title}
        <svg 
          className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:rotate-180 text-accent/70" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Link>
      
      {/* Dropdown Menu Container */}
      <div className="absolute left-0 mt-0 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50">
        <div className="pt-2"> {/* Bridge to prevent mouseout */}
          <div className="bg-card border border-gray-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden relative">
            {/* Top gold highlight line */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-accent to-yellow-600"></div>
            
            <div className="py-2">
              {items.map((item, index) => (
                <Link
                  key={index}
                  to={item.href}
                  className="block px-5 py-3 text-sm text-gray-300 hover:bg-gray-800/80 hover:text-accent transition-all duration-200 border-b border-gray-800/50 last:border-0 group/item relative"
                >
                  <div className="flex justify-between items-center group-hover/item:translate-x-1 transition-transform duration-200">
                    <span className="font-medium whitespace-nowrap">{item.label}</span>
                    {item.price && <span className="text-accent text-xs font-bold opacity-80">{item.price}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
