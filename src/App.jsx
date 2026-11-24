import React, { useEffect, Suspense, lazy } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useApp } from './context/AppContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import LiveOrderTracker from './components/LiveOrderTracker';

import HomePage from './pages/customer/HomePage';
import MenuPage from './pages/customer/MenuPage';
import ChefsPage from './pages/customer/ChefsPage';
import BookingPage from './pages/customer/BookingPage';
import MyBookingsPage from './pages/customer/MyBookingsPage';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));
const AdminBookings = lazy(() => import('./pages/admin/AdminBookings'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center text-sm font-semibold text-stone-500">
    Loading Wrap-stick...
  </div>
);

const CustomerLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <LiveOrderTracker />
    <WhatsAppButton />
  </div>
);

const ProtectedAdminRoute = ({ children }) => {
  const { isAdminAuthenticated } = useApp();
  if (!isAdminAuthenticated) return <Navigate to="/admin" replace />;
  return children;
};

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<CustomerLayout><HomePage /></CustomerLayout>} />
          <Route path="/menu" element={<CustomerLayout><MenuPage /></CustomerLayout>} />
          <Route path="/chefs" element={<CustomerLayout><ChefsPage /></CustomerLayout>} />
          <Route path="/book" element={<CustomerLayout><BookingPage /></CustomerLayout>} />
          <Route path="/my-bookings" element={<CustomerLayout><MyBookingsPage /></CustomerLayout>} />

          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/*"
            element={
              <ProtectedAdminRoute>
                <AdminLayout />
              </ProtectedAdminRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="menu" element={<AdminMenu />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
