import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-start">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1920&q=80")',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-primary via-primary/80 to-transparent"></div>
      <div className="absolute inset-0 z-10 bg-black/30"></div>
      
      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl animate-fade-in-up mt-20 md:mt-0">
          <h1 className="text-5xl sm:text-6xl md:text-[5.5rem] font-black font-heading text-white mb-6 leading-[1.1] uppercase tracking-[0.15em] drop-shadow-2xl">
            HORNET <br className="sm:hidden" />
            <span className="text-accent drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]">
              ROYALE
            </span>
          </h1>
          
          <div className="w-16 md:w-24 h-1 bg-accent mb-6"></div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 font-light tracking-wide">
            Đỉnh cao phong cách dành cho phái mạnh
          </p>
          
          <Link 
            to="/booking"
            className="inline-block w-full sm:w-auto text-center px-8 py-4 border-2 border-accent text-accent hover:bg-accent hover:text-primary transition-all duration-300 font-medium uppercase tracking-widest text-sm"
          >
            Đặt lịch ngay
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
