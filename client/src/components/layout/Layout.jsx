import { useState } from 'react';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from '../cart/CartSidebar';
import MobileMenu from './MobileMenu';
import ChatButton from '../ui/ChatButton';

const Layout = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(!isCartOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          <Header 
            toggleCart={toggleCart} 
            toggleMobileMenu={toggleMobileMenu}
          />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
          <ChatButton />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default Layout;