import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Flame,
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck,
  CreditCard,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminLayout() {
  const { logoutAdmin } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin');
  };

  const links = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/menu', label: 'Menu Items', icon: UtensilsCrossed },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/payments', label: 'Payments', icon: CreditCard },
    { to: '/admin/settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-white">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-base block leading-none">Wrap-stick</span>
                <span className="text-[10px] text-orange-400 uppercase tracking-wider font-semibold">
                  Gudha Gorji Admin
                </span>
              </div>
            </div>
          </div>

          <nav className="p-3 space-y-1 flex md:block overflow-x-auto">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                      isActive
                        ? 'bg-orange-600 text-white'
                        : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-stone-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-white transition"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View Live Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/50 transition"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-5 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
