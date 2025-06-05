import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import { CartProvider } from './components/context/CartContext';
import Layout from './components/layout/Layout';
import HomePage from './components/pages/HomePage';
import ProductsPage from './components/pages/ProductsPage';
import ProductDetailPage from './components/pages/ProductDetailPage';
import CartPage from './components/pages/CartPage';
import CheckoutPage from './components/pages/CheckoutPage';
import AccountPage from './components/pages/AccountPage';
import DealsPage from './components/pages/DealsPage';
import RegisterPage from './components/pages/RegisterPage';
import ForgotPassword from './components/pages/ForgotPassword';
import ResetPassword from './components/pages/ResetPassword';
import OrderDetailPage from './components/pages/OrderDetailPage';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/pages/admin/Dashboard';
import Analytics from './components/pages/admin/Analytics';
import Customers from './components/pages/admin/Customers';
import Inventory from './components/pages/admin/Inventory';
import Orders from './components/pages/admin/Orders';
import Settings from './components/pages/admin/Settings';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin routes without Layout */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/settings" element={<Settings />} />
            {/* All other routes with Layout */}
            <Route
              path="*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/products/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/deals" element={<DealsPage />} />
                    <Route path="/account/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/orders/:orderId" element={<OrderDetailPage />} />
                  </Routes>
                  <Toaster position="top-right" />
                </Layout>
              }
            />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

// No changes are needed here for admin/customer role-based redirects.
// Role-based redirects should be handled in route protection components (e.g., PrivateRoute, RequireAdmin) or inside the relevant page components, not in App.jsx itself.