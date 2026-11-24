import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Flame, Menu, X, CalendarCheck, ShieldCheck, Phone, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { db, cartCount } = useApp();
  const phoneNumber = db.settings.whatsappNumber || '917597386371';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu (40+)', path: '/menu' },
    { name: 'Our Chefs', path: '/chefs' },
    { name: 'My Bookings', path: '/my-bookings' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span className="truncate">
            📍 Manoj Kulhari Thekedar Farmhouse, Gudha Gorji, Jhunjhunu, Rajasthan
          </span>
          <a
            href={`tel:+${phoneNumber}`}
            className="inline-flex items-center gap-1 text-orange-400 font-semibold hover:text-orange-300"
          >
            <Phone className="w-3 h-3" /> +91 7597386371
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-stone-900">
              Wrap<span className="text-orange-600">-stick</span>
            </span>
            <p className="text-[10px] font-medium uppercase tracking-widest text-stone-400 -mt-1">
              Gudha Gorji • Wraps & Skewers
            </p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-colors ${
                  isActive ? 'text-orange-600' : 'text-stone-600 hover:text-orange-600'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
          >
            <ShieldCheck className="w-4 h-4 text-orange-600" />
            Admin
          </Link>
          <Link
            to="/book"
            className="relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-xl shadow-sm shadow-orange-600/20 transition"
          >
            {cartCount > 0 ? <ShoppingBag className="w-4 h-4" /> : <CalendarCheck className="w-4 h-4" />}
            <span>{cartCount > 0 ? `Cart (${cartCount}) • Checkout` : 'Book Table / Order'}</span>
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          {cartCount > 0 && (
            <Link
              to="/book"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{cartCount}</span>
            </Link>
          )}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-white border-b border-stone-200"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                      isActive ? 'bg-orange-50 text-orange-600' : 'text-stone-700 hover:bg-stone-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
                <Link
                  to="/book"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-orange-600 text-white text-sm font-semibold"
                >
                  {cartCount > 0 ? `Proceed to Checkout (${cartCount} Items)` : 'Book Table / Pre-Order'}
                </Link>
                <Link
                  to="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="w-full text-center py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-semibold"
                >
                  Admin Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
