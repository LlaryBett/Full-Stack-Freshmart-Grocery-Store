import { Truck, Clock, ShieldCheck, RefreshCw } from 'lucide-react';

const DeliveryFeatures = () => {
  const features = [
    {
      icon: <Truck className="w-7 h-7 text-green-500" />,
      title: 'Free Delivery',
      description: 'On orders over $50'
    },
    {
      icon: <Clock className="w-7 h-7 text-green-500" />,
      title: 'Express Delivery',
      description: '30 minute delivery available'
    },
    {
      icon: <ShieldCheck className="w-7 h-7 text-green-500" />,
      title: 'Quality Guarantee',
      description: '100% satisfaction or refund'
    },
    {
      icon: <RefreshCw className="w-7 h-7 text-green-500" />,
      title: 'Easy Returns',
      description: '14-day return policy'
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center text-center transition-transform hover:translate-y-[-5px]"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DeliveryFeatures;