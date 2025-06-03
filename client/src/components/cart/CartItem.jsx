import { Minus, Plus, Trash2 } from 'lucide-react';

const CartItem = ({ item, onRemove, onUpdateQuantity }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (item.quantity < item.stock) {
      onUpdateQuantity(item.quantity + 1);
    }
  };

  return (
    <div className="flex border border-gray-100 rounded-lg overflow-hidden">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Product Details */}
      <div className="flex-1 p-3">
        <div className="flex justify-between">
          <h4 className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</h4>
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          {item.unit && `${item.unit} • `}${item.category}
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-green-600 font-medium">
            ksh{(item.price * item.quantity).toFixed(2)}
          </div>
          
          <div className="flex items-center border border-gray-200 rounded">
            <button 
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus size={14} />
            </button>
            <span className="px-2 py-1 text-sm">{item.quantity}</span>
            <button 
              onClick={handleIncrease}
              disabled={item.quantity >= item.stock}
              className="px-2 py-1 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;