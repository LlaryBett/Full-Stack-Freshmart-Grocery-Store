import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import { CartProvider } from './components/context/CartContext';
import Layout from './components/layout/Layout';
import DocsLayout from './components/layout/DocsLayout';
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
import About from './components/pages/About';
import Blog from './components/pages/Blog';
import Help from './components/pages/Help';
import Faq from './components/pages/Faq';
import Shipping from './components/pages/Shipping';
import Returns from './components/pages/Returns';
import Privacy from './components/pages/Privacy';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/pages/admin/Dashboard';
import Analytics from './components/pages/admin/Analytics';
import Customers from './components/pages/admin/Customers';
import Inventory from './components/pages/admin/Inventory';
import Orders from './components/pages/admin/Orders';
import Settings from './components/pages/admin/Settings';
import CreatePromoEvent from './components/pages/admin/CreatePromoEvent';
import PromoCrudPage from './components/pages/admin/PromoCrudPage';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Admin routes */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/analytics" element={<Analytics />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/inventory" element={<Inventory />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/promo-events" element={<CreatePromoEvent />} />
            <Route path="/admin/promos" element={<PromoCrudPage />} />

            {/* Documentation pages with DocsLayout */}
            <Route path="/about" element={<DocsLayout><About /></DocsLayout>} />
            <Route path="/blog" element={<DocsLayout><Blog /></DocsLayout>} />
            <Route path="/help" element={<DocsLayout><Help /></DocsLayout>} />
            <Route path="/faq" element={<DocsLayout><Faq /></DocsLayout>} />
            <Route path="/shipping" element={<DocsLayout><Shipping /></DocsLayout>} />
            <Route path="/returns" element={<DocsLayout><Returns /></DocsLayout>} />
            <Route path="/privacy" element={<DocsLayout><Privacy /></DocsLayout>} />

            {/* Main app routes */}
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