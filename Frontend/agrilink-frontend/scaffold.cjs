const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const filesToCreate = {
  // Components - Common
  'components/common/Button.jsx': true,
  'components/common/InputField.jsx': true,
  'components/common/SelectBox.jsx': true,
  'components/common/Loader.jsx': true,
  'components/common/Spinner.jsx': true,
  'components/common/SearchBar.jsx': true,
  'components/common/Modal.jsx': true,
  'components/common/Pagination.jsx': true,
  'components/common/Breadcrumb.jsx': true,
  'components/common/Notification.jsx': true,
  'components/common/EmptyState.jsx': true,
  'components/common/ErrorPage.jsx': true,

  // Components - Navbar
  'components/navbar/Navbar.jsx': true,
  'components/navbar/Sidebar.jsx': true,
  'components/navbar/MobileMenu.jsx': true,
  'components/navbar/ProfileDropdown.jsx': true,
  'components/navbar/NotificationBell.jsx': true,

  // Components - Footer
  'components/footer/Footer.jsx': true,

  // Components - Cards
  'components/cards/ProductCard.jsx': true,
  'components/cards/FarmerCard.jsx': true,
  'components/cards/OrderCard.jsx': true,
  'components/cards/DeliveryCard.jsx': true,
  'components/cards/ReviewCard.jsx': true,

  // Components - Dashboard
  'components/dashboard/DashboardHeader.jsx': true,
  'components/dashboard/DashboardSidebar.jsx': true,
  'components/dashboard/DashboardStats.jsx': true,
  'components/dashboard/RevenueChart.jsx': true,
  'components/dashboard/SalesChart.jsx': true,
  'components/dashboard/RecentOrders.jsx': true,
  'components/dashboard/QuickActions.jsx': true,

  // Components - Forms
  'components/forms/LoginForm.jsx': true,
  'components/forms/RegisterForm.jsx': true,
  'components/forms/ProductForm.jsx': true,
  'components/forms/AddressForm.jsx': true,
  'components/forms/PaymentForm.jsx': true,
  'components/forms/ProfileForm.jsx': true,

  // Components - Maps
  'components/maps/FarmerMap.jsx': true,
  'components/maps/DeliveryMap.jsx': true,
  'components/maps/RouteMap.jsx': true,

  // Layouts
  'layouts/MainLayout.jsx': true,
  'layouts/FarmerLayout.jsx': true,
  'layouts/CustomerLayout.jsx': true,
  'layouts/AdminLayout.jsx': true,
  'layouts/DeliveryLayout.jsx': true,

  // Pages - Authentication
  'pages/authentication/Login.jsx': true,
  'pages/authentication/Register.jsx': true,
  'pages/authentication/ForgotPassword.jsx': true,
  'pages/authentication/ResetPassword.jsx': true,
  'pages/authentication/VerifyOTP.jsx': true,
  'pages/authentication/Unauthorized.jsx': true,

  // Pages - Home
  'pages/home/Home.jsx': true,
  'pages/home/About.jsx': true,
  'pages/home/Contact.jsx': true,
  'pages/home/FAQ.jsx': true,
  'pages/home/Privacy.jsx': true,
  'pages/home/Terms.jsx': true,

  // Pages - Customer
  'pages/customer/dashboard/Dashboard.jsx': true,
  'pages/customer/dashboard/Statistics.jsx': true,
  'pages/customer/dashboard/Recommendations.jsx': true,
  'pages/customer/products/ProductList.jsx': true,
  'pages/customer/products/ProductDetails.jsx': true,
  'pages/customer/products/Categories.jsx': true,
  'pages/customer/products/OrganicProducts.jsx': true,
  'pages/customer/products/NearbyFarmers.jsx': true,
  'pages/customer/products/SearchResults.jsx': true,
  'pages/customer/cart/Cart.jsx': true,
  'pages/customer/cart/Checkout.jsx': true,
  'pages/customer/cart/Payment.jsx': true,
  'pages/customer/cart/OrderSuccess.jsx': true,
  'pages/customer/orders/CurrentOrders.jsx': true,
  'pages/customer/orders/OrderHistory.jsx': true,
  'pages/customer/orders/OrderTracking.jsx': true,
  'pages/customer/orders/Invoice.jsx': true,
  'pages/customer/wishlist/Wishlist.jsx': true,
  'pages/customer/profile/Profile.jsx': true,
  'pages/customer/profile/EditProfile.jsx': true,
  'pages/customer/profile/AddressBook.jsx': true,
  'pages/customer/profile/ChangePassword.jsx': true,
  'pages/customer/reviews/AddReview.jsx': true,
  'pages/customer/reviews/MyReviews.jsx': true,

  // Pages - Farmer
  'pages/farmer/dashboard/Dashboard.jsx': true,
  'pages/farmer/dashboard/SalesAnalytics.jsx': true,
  'pages/farmer/dashboard/Earnings.jsx': true,
  'pages/farmer/dashboard/Notifications.jsx': true,
  'pages/farmer/farm/FarmProfile.jsx': true,
  'pages/farmer/farm/EditFarm.jsx': true,
  'pages/farmer/farm/Certificates.jsx': true,
  'pages/farmer/farm/Gallery.jsx': true,
  'pages/farmer/products/AddProduct.jsx': true,
  'pages/farmer/products/EditProduct.jsx': true,
  'pages/farmer/products/ProductList.jsx': true,
  'pages/farmer/products/Inventory.jsx': true,
  'pages/farmer/products/ProductDetails.jsx': true,
  'pages/farmer/orders/NewOrders.jsx': true,
  'pages/farmer/orders/AcceptedOrders.jsx': true,
  'pages/farmer/orders/CompletedOrders.jsx': true,
  'pages/farmer/orders/CancelledOrders.jsx': true,
  'pages/farmer/earnings/Revenue.jsx': true,
  'pages/farmer/earnings/Transactions.jsx': true,
  'pages/farmer/earnings/Withdraw.jsx': true,
  'pages/farmer/reviews/CustomerReviews.jsx': true,

  // Pages - Delivery
  'pages/delivery/Dashboard.jsx': true,
  'pages/delivery/AssignedOrders.jsx': true,
  'pages/delivery/PickupDetails.jsx': true,
  'pages/delivery/DeliveryStatus.jsx': true,
  'pages/delivery/Earnings.jsx': true,
  'pages/delivery/RouteNavigation.jsx': true,

  // Pages - Admin
  'pages/admin/Dashboard.jsx': true,
  'pages/admin/Users.jsx': true,
  'pages/admin/Farmers.jsx': true,
  'pages/admin/Customers.jsx': true,
  'pages/admin/DeliveryPartners.jsx': true,
  'pages/admin/Products.jsx': true,
  'pages/admin/Orders.jsx': true,
  'pages/admin/Reports.jsx': true,
  'pages/admin/Complaints.jsx': true,
  'pages/admin/Analytics.jsx': true,
  'pages/admin/Settings.jsx': true,

  // Pages - Errors
  'pages/errors/404.jsx': true,
  'pages/errors/500.jsx': true,

  // Routes
  'routes/AppRoutes.jsx': true,
  'routes/FarmerRoutes.jsx': true,
  'routes/CustomerRoutes.jsx': true,
  'routes/AdminRoutes.jsx': true,
  'routes/DeliveryRoutes.jsx': true,
  'routes/ProtectedRoute.jsx': true,

  // Services
  'services/authService.js': 'service',
  'services/customerService.js': 'service',
  'services/farmerService.js': 'service',
  'services/productService.js': 'service',
  'services/orderService.js': 'service',
  'services/paymentService.js': 'service',
  'services/deliveryService.js': 'service',
  'services/reviewService.js': 'service',
  'services/notificationService.js': 'service',
  'services/adminService.js': 'service',

  // API
  'api/axiosConfig.js': 'api',
  'api/endpoints.js': 'api',
  'api/interceptor.js': 'api',

  // Hooks
  'hooks/useAuth.js': 'hook',
  'hooks/useProducts.js': 'hook',
  'hooks/useOrders.js': 'hook',
  'hooks/usePagination.js': 'hook',
  'hooks/useSearch.js': 'hook',
  'hooks/useNotifications.js': 'hook',

  // Context
  'context/AuthContext.jsx': 'context',
  'context/CartContext.jsx': 'context',
  'context/UserContext.jsx': 'context',
  'context/ThemeContext.jsx': 'context',
  'context/NotificationContext.jsx': 'context',

  // Redux
  'redux/store.js': 'store',
  'redux/authSlice.js': 'slice',
  'redux/productSlice.js': 'slice',
  'redux/cartSlice.js': 'slice',
  'redux/orderSlice.js': 'slice',
  'redux/farmerSlice.js': 'slice',
  'redux/adminSlice.js': 'slice',

  // Utils
  'utils/validators.js': 'util',
  'utils/constants.js': 'util',
  'utils/helpers.js': 'util',
  'utils/formatDate.js': 'util',
  'utils/calculatePrice.js': 'util',
  'utils/storage.js': 'util',

  // Styles
  'styles/variables.css': 'css',
  'styles/dashboard.css': 'css',
  'styles/responsive.css': 'css',
};

const getBoilerplate = (filePath, type) => {
  const basename = path.basename(filePath, path.extname(filePath));
  const safeName = basename.replace(/[^a-zA-Z0-9]/g, '');

  if (type === 'service' || type === 'util' || type === 'api') {
    return `// ${basename}\nexport const ${safeName} = {};\n`;
  }

  if (type === 'hook') {
    return `import { useState, useEffect } from 'react';\n\nexport const ${safeName} = () => {\n  return {};\n};\n`;
  }

  if (type === 'slice') {
    return `import { createSlice } from '@reduxjs/toolkit';\n\nconst initialState = {};\n\nconst ${safeName} = createSlice({\n  name: '${safeName}',\n  initialState,\n  reducers: {}\n});\n\nexport const {} = ${safeName}.actions;\nexport default ${safeName}.reducer;\n`;
  }

  if (type === 'store') {
    return `import { configureStore } from '@reduxjs/toolkit';\n\nexport const store = configureStore({\n  reducer: {}\n});\n`;
  }

  if (type === 'context') {
    return `import React, { createContext, useContext } from 'react';\n\nconst ${safeName} = createContext();\n\nexport const use${safeName.replace('Context', '')} = () => useContext(${safeName});\n\nexport const ${safeName}Provider = ({ children }) => {\n  return (\n    <${safeName}.Provider value={{}}>\n      {children}\n    </${safeName}.Provider>\n  );\n};\n`;
  }

  if (type === 'css') {
    return `/* ${basename} */\n`;
  }

  // Default to React Component
  if (basename === 'AppRoutes' || basename === 'MainLayout' || basename === 'Home' || basename === 'Login' || basename === 'FarmerLayout' || basename === 'CustomerLayout' || basename === 'AdminLayout' || basename === 'DeliveryLayout') {
    // Keep existing if already created, but scaffold script uses fs.existsSync
    return null; 
  }

  return `import React from 'react';\n\nconst ${safeName} = () => {\n  return (\n    <div className="p-4">\n      <h2 className="text-xl font-bold">${basename} Component</h2>\n    </div>\n  );\n};\n\nexport default ${safeName};\n`;
};

Object.entries(filesToCreate).forEach(([file, type]) => {
  const fullPath = path.join(srcDir, file);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(fullPath)) {
    const content = getBoilerplate(file, type);
    if (content !== null) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Created: ${file}`);
    }
  }
});

console.log('Scaffolding complete!');
