# 🛒 FreshMart - Modern Grocery Store Platform

A full-stack e-commerce grocery store application built with React.js (Frontend) and Node.js/Express (Backend), featuring modern UI/UX design and comprehensive shopping functionality.

**Live Preview:** https://full-stack-freshmart-grocery-store.vercel.app/

## 📸 Screenshots

![Homepage Screenshot](https://raw.githubusercontent.com/LlaryBett/Full-Stack-Freshmart-Grocery-Store/main/client/src/assets/Screenshot2.png)

![Product Page Screenshot](https://raw.githubusercontent.com/LlaryBett/Full-Stack-Freshmart-Grocery-Store/main/client/src/assets/Screenshot1.png)
## 🚀 Features

### Customer Features
- **🏠 Homepage**: Hero section, featured categories, featured products, promotions, testimonials
- **🛍️ Product Catalog**: Browse products by categories with advanced filtering and sorting
- **🔍 Search & Filter**: Search products, filter by category, price range, availability
- **🛒 Shopping Cart**: Add/remove items, quantity management, cart persistence
- **💳 Checkout Process**: Secure checkout with address management
- **👤 User Authentication**: Register, login, password reset functionality
- **📱 Responsive Design**: Mobile-first design with smooth animations
- **📍 Address Management**: Save multiple delivery addresses
- **📋 Order History**: Track previous orders and order details
- **❤️ Wishlist**: Save favorite products for later
- **🔔 Notifications**: In-app notifications for order updates

### Admin Features
- **📊 Admin Dashboard**: Overview of sales, orders, and inventory
- **📦 Product Management**: CRUD operations for products
- **📂 Category Management**: Manage product categories
- **🎯 Promotion Management**: Create and manage promotional campaigns
- **👥 User Management**: View and manage customer accounts
- **📈 Analytics**: Sales reports and inventory tracking

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Context API** - State management for cart and authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service integration

## 📁 Project Structure

```
grocery-store/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── cart/          # Cart-related components
│   │   │   ├── common/        # Common UI components
│   │   │   ├── context/       # React context providers
│   │   │   ├── data/          # Static data files
│   │   │   ├── home/          # Homepage components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── pages/         # Page components
│   │   │   ├── products/      # Product-related components
│   │   │   └── ui/            # UI components
│   │   ├── App.jsx            # Main App component
│   │   └── main.jsx           # Application entry point
│   ├── package.json
│   └── vite.config.js
└── server/                     # Backend Node.js application
    ├── src/
    │   ├── controllers/        # Route controllers
    │   ├── middleware/         # Custom middleware
    │   ├── models/            # MongoDB models
    │   ├── routes/            # API routes
    │   ├── scripts/           # Utility scripts
    │   └── utils/             # Helper utilities
    ├── package.json
    └── server.js              # Server entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/grocery-store.git
   cd grocery-store
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Configuration**

   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/freshmart
   JWT_SECRET=your_jwt_secret_key
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

   Create `.env` file in the client directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```

5. **Start the Development Servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)
- `PUT /api/categories/:id` - Update category (Admin)
- `DELETE /api/categories/:id` - Delete category (Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/:id` - Remove item from cart

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Promotions
- `GET /api/promos` - Get all promotions
- `POST /api/promos` - Create promotion (Admin)
- `PUT /api/promos/:id` - Update promotion (Admin)
- `DELETE /api/promos/:id` - Delete promotion (Admin)

## 🎨 Features in Detail

### Product Management
- **Advanced Filtering**: Filter by category, price range, availability
- **Smart Search**: Search products by name, description, or category
- **Sorting Options**: Sort by price, popularity, newest, rating
- **Product Images**: High-quality product images with lazy loading
- **Stock Management**: Real-time inventory tracking

### Shopping Cart
- **Persistent Cart**: Cart state maintained across sessions
- **Quantity Controls**: Easy increment/decrement buttons
- **Price Calculation**: Automatic subtotal and total calculations
- **Cart Sidebar**: Quick access cart overlay
- **Remove Items**: One-click item removal

### Checkout Process
- **Address Management**: Multiple saved addresses
- **Order Summary**: Clear breakdown of items and costs
- **Secure Payments**: Integration ready for payment gateways
- **Order Confirmation**: Email notifications for order status

### Admin Dashboard
- **Sales Analytics**: Revenue tracking and reporting
- **Inventory Management**: Stock levels and product management
- **Order Management**: Process and track customer orders
- **User Management**: Customer account overview
- **Promotion Tools**: Create and manage marketing campaigns

## 🔧 Configuration

### Database Models
- **User**: Customer and admin user accounts
- **Product**: Product catalog with categories and inventory
- **Category**: Product categorization system
- **Cart**: Shopping cart items per user
- **Order**: Order history and tracking
- **Address**: Customer delivery addresses
- **Promo**: Promotional campaigns and offers
- **Wishlist**: Saved products per user

### Authentication
- JWT-based authentication system
- Protected routes for user and admin areas
- Password hashing with bcrypt
- Session management and token refresh

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Backend (Railway/Heroku)
1. Create new app on your chosen platform
2. Connect GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Database (MongoDB Atlas)
1. Create MongoDB Atlas cluster
2. Set up database user and network access
3. Update connection string in environment variables

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React community for excellent documentation
- Tailwind CSS for the utility-first approach
- MongoDB for flexible data storage
- Express.js for robust backend framework
- Lucide React for beautiful icons

## 📞 Support

If you have any questions or need help with setup, please open an issue or contact the maintainer.

---

**Happy Shopping! 🛒✨**
