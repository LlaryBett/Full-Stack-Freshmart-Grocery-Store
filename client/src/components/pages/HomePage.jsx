import { useEffect } from "react";
import HeroSection from '../home/HeroSection';
import FeaturedCategories from '../home/FeaturedCategories';
import FeaturedProducts from '../home/FeaturedProducts';
import PromoSection from '../home/PromoSection';
import DeliveryFeatures from '../home/DeliveryFeatures';
import Testimonials from '../home/Testimonials';
import DownloadAppSection from '../home/DownloadAppSection';

const HomePage = () => {
  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);
    
    // Update page title
    document.title = 'FreshMart - Fresh Groceries Delivered to Your Doorstep';
  }, []);

  return (
    <div>
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <PromoSection />
      <DeliveryFeatures />
      <Testimonials />
      <DownloadAppSection />
    </div>
  );
};

export default HomePage;