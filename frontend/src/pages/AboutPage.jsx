import React, { useEffect } from 'react';
import AboutHero from '../components/AboutHero';
import AboutStory from '../components/AboutStory';
import WhyChooseUs from '../components/WhyChooseUs';
import QuoteSection from '../components/QuoteSection';
import AboutBranches from '../components/AboutBranches';
import ScrollToTop from '../components/ScrollToTop';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#0B0B0B] min-h-screen">
      <main>
        {/* HERO BANNER - Now contains the Back button internally */}
        <AboutHero />

        {/* OUR STORY */}
        <AboutStory />

        {/* WHY CHOOSE US */}
        <WhyChooseUs />

        {/* CINEMATIC QUOTE */}
        <QuoteSection />

        {/* BRANCHES (Replaced Gallery) */}
        <AboutBranches />
      </main>
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;

