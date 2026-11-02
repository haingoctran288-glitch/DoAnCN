import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set the top scroll position
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className={`fixed bottom-28 right-8 z-50 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
      <button
        onClick={scrollToTop}
        className="w-14 h-14 bg-accent text-primary rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(0,0,0,0.4)] hover:bg-white transition-all duration-300 group hover:-translate-y-2"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-8 h-8 group-hover:scale-125 transition-transform" />
      </button>
    </div>
  );
};

export default ScrollToTop;
