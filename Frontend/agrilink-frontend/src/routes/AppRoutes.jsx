import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Security Route Guard
import ProtectedRoute from './ProtectedRoute';

// Layouts
import MainLayout from '../layouts/MainLayout';
import FarmerLayout from '../layouts/FarmerLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import AdminLayout from '../layouts/AdminLayout';
import DeliveryLayout from '../layouts/DeliveryLayout';

// Pages
import Home from '../pages/home/Home';
import Login from '../pages/authentication/Login';
import Register from '../pages/authentication/Register';
import VerifyOTP from '../pages/authentication/VerifyOTP';
import ForgotPassword from '../pages/authentication/ForgotPassword';
import ResetPassword from '../pages/authentication/ResetPassword';
import Unauthorized from '../pages/authentication/Unauthorized';
import PendingVerification from '../pages/authentication/PendingVerification';

// Customer Pages
import CustomerDashboard from '../pages/customer/dashboard/Dashboard';
import ProductList from '../pages/customer/products/ProductList';
import ProductDetails from '../pages/customer/products/ProductDetails';
import Cart from '../pages/customer/cart/Cart';
import Checkout from '../pages/customer/cart/Checkout';
import Payment from '../pages/customer/cart/Payment';
import OrderSuccess from '../pages/customer/cart/OrderSuccess';
import CurrentOrders from '../pages/customer/orders/CurrentOrders';
import OrderHistory from '../pages/customer/orders/OrderHistory';
import Wishlist from '../pages/customer/wishlist/Wishlist';
import Profile from '../pages/customer/profile/Profile';
import NearbyFarmers from '../pages/customer/products/NearbyFarmers';

// Farmer Pages
import FarmerDashboard from '../pages/farmer/dashboard/Dashboard';
import FarmProfile from '../pages/farmer/farm/FarmProfile';
import FarmerProducts from '../pages/farmer/products/ProductList';
import AddProduct from '../pages/farmer/products/AddProduct';
import EditProduct from '../pages/farmer/products/EditProduct';
import Inventory from '../pages/farmer/products/Inventory';
import NewOrders from '../pages/farmer/orders/NewOrders';
import Revenue from '../pages/farmer/earnings/Revenue';

// Delivery Pages
import DeliveryDashboard from '../pages/delivery/Dashboard';
import AssignedOrders from '../pages/delivery/AssignedOrders';
import PickupDetails from '../pages/delivery/PickupDetails';
import DeliveryStatus from '../pages/delivery/DeliveryStatus';
import RouteNavigation from '../pages/delivery/RouteNavigation';
import DeliveryEarnings from '../pages/delivery/Earnings';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminFarmers from '../pages/admin/Farmers';
import AdminDeliveryPartners from '../pages/admin/DeliveryPartners';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminComplaints from '../pages/admin/Complaints';
import AdminReports from '../pages/admin/Reports';
import AdminAnalytics from '../pages/admin/Analytics';
import AdminSettings from '../pages/admin/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>

      {/* Verification Status Guarded Route */}
      <Route
        path="/pending-verification"
        element={
          <ProtectedRoute>
            <PendingVerification />
          </ProtectedRoute>
        }
      />

      {/* Customer Routes */}
      <Route
        path="/customer"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER']}>
            <CustomerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<CustomerDashboard />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="payment" element={<Payment />} />
        <Route path="order-success" element={<OrderSuccess />} />
        <Route path="orders" element={<CurrentOrders />} />
        <Route path="order-history" element={<OrderHistory />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="profile" element={<Profile />} />
        <Route path="nearby-farmers" element={<NearbyFarmers />} />
      </Route>

      {/* Farmer Routes */}
      <Route
        path="/farmer"
        element={
          <ProtectedRoute allowedRoles={['FARMER']}>
            <FarmerLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<FarmerDashboard />} />
        <Route path="farm" element={<FarmProfile />} />
        <Route path="products" element={<FarmerProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<NewOrders />} />
        <Route path="earnings" element={<Revenue />} />
      </Route>

      {/* Delivery Routes */}
      <Route
        path="/delivery"
        element={
          <ProtectedRoute allowedRoles={['DELIVERY']}>
            <DeliveryLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DeliveryDashboard />} />
        <Route path="assigned-orders" element={<AssignedOrders />} />
        <Route path="pickup-details/:id" element={<PickupDetails />} />
        <Route path="delivery-status/:id" element={<DeliveryStatus />} />
        <Route path="route-navigation/:id" element={<RouteNavigation />} />
        <Route path="earnings" element={<DeliveryEarnings />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="farmers" element={<AdminFarmers />} />
        <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="complaints" element={<AdminComplaints />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>
      
      {/* Fallback */}
      <Route path="*" element={<div className="p-8 text-center text-xl font-bold">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
