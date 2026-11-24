import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, CalendarCheck, UtensilsCrossed, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard() {
  const { db } = useApp();

  const totalRevenue = db.payments
    .filter((p) => p.status === 'Success')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const [displayRevenue, setDisplayRevenue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 600;
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = totalRevenue / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= totalRevenue) {
        setDisplayRevenue(totalRevenue);
        clearInterval(timer);
      } else {
        setDisplayRevenue(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalRevenue]);

  const stats = [
    {
      label: 'Total Revenue',
      value: `₹${displayRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      label: 'Total Bookings',
      value: db.bookings.length,
      icon: CalendarCheck,
      color: 'bg-orange-50 text-orange-600'
    },
    {
      label: 'Active Menu Dishes',
      value: db.menuItems.length,
      icon: UtensilsCrossed,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      label: 'Master Chefs',
      value: db.chefs.length,
      icon: ChefHat,
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Dashboard Overview</h1>
        <p className="text-sm text-stone-500">
          Wrap-stick • Manoj Kulhari Thekedar Farmhouse, Gudha Gorji
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-500">{stat.label}</p>
                <p className="text-2xl font-extrabold text-stone-900">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <h2 className="text-base font-bold text-stone-900 mb-4">Recent Table & Pre-Order Activity</h2>
        {db.bookings.length === 0 ? (
          <p className="text-sm text-stone-400 py-4">No bookings placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-xs uppercase text-stone-400">
                  <th className="py-3">ID</th>
                  <th className="py-3">Customer</th>
                  <th className="py-3">Dish</th>
                  <th className="py-3">Schedule</th>
                  <th className="py-3">Amount</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {db.bookings.slice(0, 8).map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 font-bold text-orange-600">{b.id}</td>
                    <td className="py-3 font-medium text-stone-900">{b.customerName}</td>
                    <td className="py-3 text-stone-600">{b.dishName}</td>
                    <td className="py-3 text-stone-500 text-xs">{b.date} • {b.time}</td>
                    <td className="py-3 font-bold">₹{b.amount}</td>
                    <td className="py-3">
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
