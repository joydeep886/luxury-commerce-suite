
import React from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturedProducts from '@/components/FeaturedProducts';
import CategoryShowcase from '@/components/CategoryShowcase';
import Newsletter from '@/components/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <Newsletter />
    </div>
  );
};

export default Home;
