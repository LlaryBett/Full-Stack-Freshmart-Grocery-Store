import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart2,
  Users,
  Home,
  ClipboardList,
  Settings as SettingsIcon,
  Box,
  Menu,
  X,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const navLinks = [
    { label: 'Dashboard', icon: Home, to: '/admin' },
    { label: 'Analytics', icon: BarChart2, to: '/admin/analytics' },
    { label: 'Customers', icon: Users, to: '/admin/customers' },
    { label: 'Inventory', icon: Box, to: '/admin/inventory' },
    { label: 'Orders', icon: ClipboardList, to: '/admin/orders' },
    { label: 'Promo Events', icon: SettingsIcon, to: '/admin/promo-events' }, // Add this line
    { label: 'Settings', icon: SettingsIcon, to: '/admin/settings' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Sidebar content
  const sidebarContent = (
    <aside className="w-40 bg-white border-r border-gray-100 min-h-screen py-8 px-1 flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-2xl font-bold text-green-600">Admin Panel</span>
        {/* Close button for mobile */}
        <button
          className="md:hidden ml-2 p-1 rounded hover:bg-gray-100"
          onClick={() => setOpen(false)}
        >
          <X size={22} />
        </button>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center px-2 py-2 rounded-lg transition-colors ${
                  location.pathname === link.to
                    ? 'bg-green-50 text-green-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setOpen(false)}
              >
                <link.icon className="w-5 h-5 mr-2" />
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Add divider and logout button */}
        <div className="mt-auto pt-4 border-t border-gray-100 mt-8">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );

  return (
    <>
      {/* Hamburger menu for small screens */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-white border border-gray-200 rounded-full p-2 shadow"
        onClick={() => setOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={24} />
      </button>
      {/* Sidebar for desktop */}
      <div className="hidden md:block h-screen sticky top-0 flex-shrink-0">
        {sidebarContent}
      </div>
      {/* Overlay sidebar for mobile */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative z-50">{sidebarContent}</div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
