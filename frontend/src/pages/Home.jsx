import React from 'react';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Booking from '../components/Booking';
import ZigZagSection from '../components/ZigZagSection';
import ScrollToTop from '../components/ScrollToTop';

const Home = () => {
  return (
    <>
      <Hero />
      <Services />
      <ZigZagSection />
      <Booking />
      <ScrollToTop />
    </>
  );
};

export default Home;
