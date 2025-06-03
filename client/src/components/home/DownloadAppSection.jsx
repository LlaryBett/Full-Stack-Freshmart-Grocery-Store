import { Link } from 'react-router-dom';
import { Phone, Check } from 'lucide-react';

const DownloadAppSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-green-500 to-green-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-8 md:mb-0 md:mr-8 max-w-xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Download Our App For The Best Experience</h2>
            <p className="text-white/90 mb-6">
              Get the FreshMart app for a faster, more personalized shopping experience.
              Track your deliveries in real-time and access exclusive mobile offers.
            </p>
            
            <ul className="space-y-2 mb-6">
              {['Exclusive app-only offers', 'Live order tracking', 'Faster checkout', 'Personalized recommendations'].map((item, index) => (
                <li key={index} className="flex items-center">
                  <Check size={18} className="mr-2 text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            
            <div className="flex flex-wrap gap-4">
              <a href="#" className="block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                  alt="App Store" 
                  className="h-12"
                />
              </a>
              <a href="#" className="block">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                  alt="Google Play" 
                  className="h-12"
                />
              </a>
            </div>
          </div>
          
          <div className="relative">
            <div className="bg-white/20 backdrop-blur-sm rounded-3xl overflow-hidden p-2 shadow-lg">
              <img 
                src="https://images.pexels.com/photos/1092644/pexels-photo-1092644.jpeg" 
                alt="App Screenshot" 
                className="w-64 h-auto rounded-2xl"
              />
            </div>
            
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 bg-orange-500 rounded-full w-12 h-12 flex items-center justify-center">
              <Phone size={24} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DownloadAppSection;