// Product Types
export const ProductShape = {
  id: null,
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  stock: 0,
  unit: '',
  rating: 0,
  reviews: 0,
  discount: 0,
  featured: false,
  sku: ''
};

// Cart Types
export const CartItemShape = {
  ...ProductShape,
  quantity: 0
};

// User Types
export const UserShape = {
  id: '',
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: ''
};