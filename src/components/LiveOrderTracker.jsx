import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const normalizePhone = (phone) => String(phone || '').replace(/\D/g, '').slice(-10);

export default function LiveOrderTracker() {
  const { db, userPhone, myBookingIds } = useApp();
  const { pathname } = useLocation();
  const bookings = Array.isArray(db?.bookings) ? db.bookings : [];
  const cleanPhone = normalizePhone(userPhone);

  const activeOrders = bookings.filter((b) => {
    if (!b || b.removedByUser) return false;
    if (['Completed', 'Cancelled', 'Order Removed'].includes(b.status)) return false;
    const matchesPhone = cleanPhone.length === 10 && normalizePhone(b.phone) === cleanPhone;
    const matchesId = Array.isArray(myBookingIds) && myBookingIds.includes(b.id);
    return matchesPhone || matchesId;
  });

  if (activeOrders.length === 0 || pathname === '/my-bookings') return null;

  const latest = activeOrders[0];

  return (
    <div className="fixed bottom-4 left-4 right-20 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-40 sm:w-[92%] sm:max-w-xl">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-orange-500/30 bg-stone-900/95 backdrop-blur-md px-4 py-3 text-white shadow-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-600 text-white">
            {latest.status === 'Confirmed' ? (
              <Flame className="h-4 w-4 animate-pulse" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400">
                Live Order • {latest.id}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                <CheckCircle2 className="h-3 w-3" /> {latest.status}
              </span>
            </div>
            <p className="truncate text-xs text-stone-300">
              {latest.dishName} • ₹{latest.amount} ({latest.time})
            </p>
          </div>
        </div>

        <Link
          to="/my-bookings"
          className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-orange-600 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-orange-500"
        >
          <span>Track</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
