import { useState } from 'react';
import { ArrowRight, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [address, setAddress] = useState('');

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-green-800/90" />

      <div className="w-full px-4 relative z-10 py-20">
        <div className="max-w-5xl ml-4">
          <h1 className="max-w-3xl text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
            Fresh Groceries,
            <br />
            <span className="text-green-400">Delivered Daily</span>
          </h1>
          
          <p className="max-w-2xl text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Get farm-fresh products delivered to your doorstep in as little as 30 minutes. Quality guaranteed.
          </p>

          {/* Address Input and Shop Button */}
          <div className="max-w-2xl bg-white p-2 rounded-lg shadow-xl flex flex-col sm:flex-row gap-2 mb-8 backdrop-blur-sm bg-white/95">
            <div className="flex items-center flex-1 bg-gray-50 rounded-md p-3">
              <MapPin size={24} className="text-green-500 mr-3" />
              <input
                type="text"
                placeholder="Enter your delivery address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700 text-lg placeholder:text-gray-400"
              />
            </div>
            <Link 
              to="/products" 
              className="bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-md font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center text-lg"
            >
              Shop Now <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          {/* Stats */}
          <div className="max-w-2xl grid grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">30k+</div>
              <div className="text-green-300">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">2k+</div>
              <div className="text-green-300">Products</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">98%</div>
              <div className="text-green-300">Satisfaction</div>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="max-w-3xl flex flex-wrap gap-3">
            {['Fruits', 'Vegetables', 'Meat', 'Dairy', 'Bakery'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category.toLowerCase()}`}
                className="px-6 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Floating Features Cards */}
        <div className="absolute bottom-64 right-0 space-y-3 hidden lg:block w-72 mr-8">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mr-4">
                <img src="https://cdn-icons-png.flaticon.com/512/2203/2203145.png" alt="Express Delivery" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Express Delivery</h3>
                <p className="text-green-300 text-sm">30 minute delivery</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mr-4">
                <img src="https://cdn-icons-png.flaticon.com/512/1147/1147805.png" alt="Fresh Products" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold">100% Fresh</h3>
                <p className="text-green-300 text-sm">Farm to door</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                <img src="https://cdn-icons-png.flaticon.com/512/1180/1180260.png" alt="Best Prices" className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Best Prices</h3>
                <p className="text-green-300 text-sm">Price match guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;