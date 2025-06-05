import React, { useState, useEffect } from 'react';
import { 
  Search,
  Filter,
  Plus,
  Download,
  Package,
  AlertTriangle,
  MoreVertical,
  Edit,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import Sidebar from './Sidebar';
import toast, { Toaster } from 'react-hot-toast';

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Dairy & Eggs',
  'Meat & Poultry',
  'Seafood',
  'Bakery',
  'Pantry',
  'Frozen'
];

const DEFAULT_PRODUCT = {
  name: '',
  image: '',
  category: '',
  price: '',
  unit: '',
  discount: 0,
  stock: 0,
  sku: '',
  description: '',
  origin: 'Local Farm',
  delivery: '1-2 Days',
  featured: false,
  nutrition: {
    servingSize: '',
    calories: '',
    totalFat: '',
    saturatedFat: '',
    cholesterol: '',
    sodium: '',
    totalCarbohydrate: '',
    dietaryFiber: '',
    sugars: '',
    protein: ''
  }
};

const Inventory = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState(DEFAULT_PRODUCT);
  const [adding, setAdding] = useState(false);
  const [inventoryItems, setInventoryItems] = useState([]);  // Initialize as empty array
  const [isLoading, setIsLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch(
          `${backendUrl}/api/products?page=${currentPage}&limit=${itemsPerPage}`
        );
        if (!res.ok) throw new Error('Failed to fetch inventory');
        const data = await res.json();
        setInventoryItems(data.products);
        setTotalItems(data.total);
      } catch (error) {
        toast.error(error.message || 'Failed to load inventory');
      } finally {
        setIsLoading(false);
      }
    };
    fetchInventory();
  }, [currentPage, itemsPerPage]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(inventoryItems.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter(id => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const handleAddProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle nested nutrition fields
    if (name.startsWith('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setNewProduct(prev => ({
        ...prev,
        nutrition: {
          ...prev.nutrition,
          [nutritionField]: value
        }
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    setAdding(true);

    // Convert string values to numbers
    const productData = {
      ...newProduct,
      price: parseFloat(newProduct.price) || 0,
      stock: parseInt(newProduct.stock) || 0,
      discount: parseInt(newProduct.discount) || 0,
      nutrition: {
        ...newProduct.nutrition,
        calories: parseInt(newProduct.nutrition.calories) || 0
      }
    };

    try {
      const res = await fetch(`${backendUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to add product');
      }

      const data = await res.json();
      setInventoryItems(prev => [...prev, data]);
      setShowAddModal(false);
      setNewProduct(DEFAULT_PRODUCT);
      toast.success('Product added successfully');
      
    } catch (error) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setAdding(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`${backendUrl}/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Failed to delete product');

      setInventoryItems(prev => prev.filter(item => item._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsEditing(true);

    try {
      const res = await fetch(`${backendUrl}/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct)
      });

      if (!res.ok) throw new Error('Failed to update product');

      const updatedProduct = await res.json();
      setInventoryItems(prev => 
        prev.map(item => item._id === updatedProduct._id ? updatedProduct : item)
      );
      setShowEditModal(false);
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update product');
    } finally {
      setIsEditing(false);
    }
  };

  const getInventoryStats = () => {
    // Add null checks and default to empty array if inventoryItems is undefined
    const items = inventoryItems || [];
    const lowStockThreshold = 10;
    
    return {
      total: items.length,
      lowStock: items.filter(item => item?.stock > 0 && item?.stock <= lowStockThreshold).length,
      outOfStock: items.filter(item => item?.stock === 0).length,
      categories: new Set(items.map(item => item?.category).filter(Boolean)).size
    };
  };

  const stats = getInventoryStats();

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                  <Filter size={20} />
                  <span>Filters</span>
                </button>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                  <Download size={20} />
                  Export
                </button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={20} />
                  Add Product
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.total}</h3>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Package className="w-6 h-6 text-green-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Low Stock Items</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.lowStock}</h3>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Out of Stock</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.outOfStock}</h3>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <Package className="w-6 h-6 text-red-500" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500">Categories</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.categories}</h3>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Package className="w-6 h-6 text-blue-500" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">Loading inventory...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          checked={selectedItems.length === inventoryItems.length}
                          onChange={handleSelectAll}
                          className="rounded text-green-500 focus:ring-green-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        SKU
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {inventoryItems.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedItems.includes(item._id)}
                            onChange={() => handleSelectItem(item._id)}
                            className="rounded text-green-500 focus:ring-green-500"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <img
                                className="h-10 w-10 rounded-lg object-cover"
                                src={item.image || `https://source.unsplash.com/100x100/?${item.name.toLowerCase()}`}
                                alt={item.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-800">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.sku}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="font-medium text-gray-800">{item.stock}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          ksh{item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.stock > 10 
                              ? 'bg-green-100 text-green-800'
                              : item.stock > 0
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.stock > 10 ? 'In Stock' : item.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <button 
                              className="p-1 rounded-full hover:bg-gray-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                const dropdown = e.currentTarget.nextElementSibling;
                                dropdown.classList.toggle('hidden');
                              }}
                            >
                              <MoreVertical size={20} className="text-gray-400" />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden z-10">
                              <div className="py-1">
                                <button 
                                  onClick={() => handleEditProduct(item)}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                >
                                  <Edit size={16} className="mr-2" />
                                  Edit Product
                                </button>
                                <button 
                                  onClick={() => handleDeleteProduct(item._id)}
                                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                >
                                  <Trash2 size={16} className="mr-2" />
                                  Delete Product
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {/* Pagination */}
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex items-center">
                <select 
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <span className="ml-4 text-sm text-gray-500">
                  Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} to{' '}
                  {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage * itemsPerPage >= totalItems}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0,0,0,0.25)'
          }}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative overflow-y-auto"
            style={{
              maxHeight: '90vh',
              minWidth: '320px'
            }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowAddModal(false)}
              aria-label="Close"
              type="button"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6">Add New Product</h2>
            <form onSubmit={handleAddProductSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleAddProductChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={newProduct.category}
                    onChange={handleAddProductChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleAddProductChange}
                    required
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={newProduct.unit}
                    onChange={handleAddProductChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g. 1kg, 500ml"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={newProduct.stock}
                    onChange={handleAddProductChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={newProduct.sku}
                    onChange={handleAddProductChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g. PRD-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={newProduct.discount}
                    onChange={handleAddProductChange}
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={newProduct.image}
                    onChange={handleAddProductChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={newProduct.description}
                  onChange={handleAddProductChange}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={newProduct.origin}
                    onChange={handleAddProductChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery</label>
                  <input
                    type="text"
                    name="delivery"
                    value={newProduct.delivery}
                    onChange={handleAddProductChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={newProduct.featured}
                    onChange={handleAddProductChange}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700 mb-1">Featured</label>
                </div>
              </div>

              {/* Nutrition Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Nutrition Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serving Size</label>
                    <input
                      type="text"
                      name="nutrition.servingSize"
                      value={newProduct.nutrition.servingSize}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                    <input
                      type="number"
                      name="nutrition.calories"
                      value={newProduct.nutrition.calories}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Fat</label>
                    <input
                      type="text"
                      name="nutrition.totalFat"
                      value={newProduct.nutrition.totalFat}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saturated Fat</label>
                    <input
                      type="text"
                      name="nutrition.saturatedFat"
                      value={newProduct.nutrition.saturatedFat}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol</label>
                    <input
                      type="text"
                      name="nutrition.cholesterol"
                      value={newProduct.nutrition.cholesterol}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sodium</label>
                    <input
                      type="text"
                      name="nutrition.sodium"
                      value={newProduct.nutrition.sodium}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Carbohydrate</label>
                    <input
                      type="text"
                      name="nutrition.totalCarbohydrate"
                      value={newProduct.nutrition.totalCarbohydrate}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Fiber</label>
                    <input
                      type="text"
                      name="nutrition.dietaryFiber"
                      value={newProduct.nutrition.dietaryFiber}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sugars</label>
                    <input
                      type="text"
                      name="nutrition.sugars"
                      value={newProduct.nutrition.sugars}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                    <input
                      type="text"
                      name="nutrition.protein"
                      value={newProduct.nutrition.protein}
                      onChange={handleAddProductChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={adding}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  {adding ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto py-4">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setShowEditModal(false)}></div>
          <div 
            className="bg-white rounded-xl shadow-lg w-full max-w-xl p-6 relative z-10 overflow-y-auto mx-4"
            style={{
              maxHeight: 'calc(100vh - 2rem)',
              minWidth: '320px'
            }}
          >
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowEditModal(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required
                    step="0.01"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                  <input
                    type="text"
                    name="unit"
                    value={editingProduct.unit}
                    onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g. 1kg, 500ml"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                  <input
                    type="text"
                    name="sku"
                    value={editingProduct.sku}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="e.g. PRD-1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={editingProduct.discount}
                    onChange={(e) => setEditingProduct({ ...editingProduct, discount: e.target.value })}
                    min="0"
                    max="100"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={editingProduct.image}
                    onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={editingProduct.description}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  rows={2}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origin</label>
                  <input
                    type="text"
                    name="origin"
                    value={editingProduct.origin}
                    onChange={(e) => setEditingProduct({ ...editingProduct, origin: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery</label>
                  <input
                    type="text"
                    name="delivery"
                    value={editingProduct.delivery}
                    onChange={(e) => setEditingProduct({ ...editingProduct, delivery: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex items-center mt-6">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={editingProduct.featured}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700 mb-1">Featured</label>
                </div>
              </div>

              {/* Nutrition Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Nutrition Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Serving Size</label>
                    <input
                      type="text"
                      name="nutrition.servingSize"
                      value={editingProduct.nutrition.servingSize}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, servingSize: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
                    <input
                      type="number"
                      name="nutrition.calories"
                      value={editingProduct.nutrition.calories}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, calories: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Fat</label>
                    <input
                      type="text"
                      name="nutrition.totalFat"
                      value={editingProduct.nutrition.totalFat}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, totalFat: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Saturated Fat</label>
                    <input
                      type="text"
                      name="nutrition.saturatedFat"
                      value={editingProduct.nutrition.saturatedFat}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, saturatedFat: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol</label>
                    <input
                      type="text"
                      name="nutrition.cholesterol"
                      value={editingProduct.nutrition.cholesterol}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, cholesterol: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sodium</label>
                    <input
                      type="text"
                      name="nutrition.sodium"
                      value={editingProduct.nutrition.sodium}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, sodium: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Carbohydrate</label>
                    <input
                      type="text"
                      name="nutrition.totalCarbohydrate"
                      value={editingProduct.nutrition.totalCarbohydrate}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, totalCarbohydrate: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Fiber</label>
                    <input
                      type="text"
                      name="nutrition.dietaryFiber"
                      value={editingProduct.nutrition.dietaryFiber}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, dietaryFiber: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sugars</label>
                    <input
                      type="text"
                      name="nutrition.sugars"
                      value={editingProduct.nutrition.sugars}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, sugars: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Protein</label>
                    <input
                      type="text"
                      name="nutrition.protein"
                      value={editingProduct.nutrition.protein}
                      onChange={(e) => setEditingProduct({ ...editingProduct, nutrition: { ...editingProduct.nutrition, protein: e.target.value } })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isEditing}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
                >
                  {isEditing ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;