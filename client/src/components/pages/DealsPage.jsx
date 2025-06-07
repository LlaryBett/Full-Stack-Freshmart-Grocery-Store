import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import ProductCard from '../products/ProductCard';
import Loader from '../common/Loader';

const DealsPage = () => {
  const [dealsProducts, setDealsProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Deals & Discounts - FreshMart';

    const fetchDeals = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
        const res = await fetch(`${backendUrl}/api/products?onSale=true`);
        if (!res.ok) throw new Error('Failed to fetch deals');
        const data = await res.json();
        setDealsProducts(data.products || []);
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Tag className="text-green-500 mr-3" size={24} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Deals & Discounts</h1>
        </div>

        {loading ? (
          <Loader />
        ) : dealsProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No deals available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dealsProducts.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
