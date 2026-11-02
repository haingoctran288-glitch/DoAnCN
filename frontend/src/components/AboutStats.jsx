import React, { useState, useEffect } from 'react';

const StatCard = ({ value, label, suffix = "", delay = 0 }) => {
  const [count, setCount] = useState(0);
  const numericValue = parseInt(value.replace(/\D/g, ''));

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    const duration = 2000;
    const increment = end / (duration / 16);
    
    const timer = setTimeout(() => {
      const handle = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(handle);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(handle);
    }, delay);

    return () => clearTimeout(timer);
  }, [numericValue, delay]);

  return (
    <div className="relative group p-10 bg-[#0a0a0a] border border-gray-800/50 rounded-[32px] overflow-hidden transition-all duration-500 hover:border-accent/40 hover:shadow-[0_20px_40px_rgba(212,175,55,0.08)] flex flex-col items-center text-center">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <span className="text-5xl md:text-6xl font-heading font-black text-accent mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="text-gray-500 uppercase tracking-[3px] text-xs font-black group-hover:text-white transition-colors duration-300">
        {label}
      </span>
    </div>
  );
};

const AboutStats = () => {
  return (
    <section className="py-24 bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div data-aos="zoom-in" data-aos-delay="0">
            <StatCard value="5000" label="Khách hàng" suffix="+" delay={200} />
          </div>
          <div data-aos="zoom-in" data-aos-delay="100">
            <StatCard value="8" label="Năm kinh nghiệm" suffix="+" delay={400} />
          </div>
          <div data-aos="zoom-in" data-aos-delay="200">
            <StatCard value="15" label="Barber chuyên nghiệp" suffix="" delay={600} />
          </div>
          <div data-aos="zoom-in" data-aos-delay="300">
            <StatCard value="98" label="Khách hàng quay lại" suffix="%" delay={800} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutStats;
