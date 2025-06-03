import { useEffect } from 'react';
import { Tag } from 'lucide-react';
import { products } from '../data/products';
import ProductCard from '../products/ProductCard';

const DealsPage = () => {
  const dealsProducts = products.filter(product => product.discount > 0);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Deals & Discounts - FreshMart';
  }, []);

  return (
    <div className="pt-20 md:pt-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-8">
          <Tag className="text-green-500 mr-3" size={24} />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Deals & Discounts</h1>
        </div>

        {dealsProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No deals available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dealsProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
