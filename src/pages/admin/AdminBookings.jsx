import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminBookings() {
  const { db, updateBookingStatus, deleteBooking } = useApp();
  const [filter, setFilter] = useState('All');

  const filtered =
    filter === 'All' ? db.bookings : db.bookings.filter((b) => b.status === filter);

  const handleDelete = (id) => {
    if (window.confirm(`Permanently delete booking ${id}?`)) {
      deleteBooking(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">Table & Order Bookings</h1>
          <p className="text-sm text-stone-500">
            Manage customer reservations, status, or permanently delete bookings.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled', 'Order Removed'].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  filter === status
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Guest Details</th>
                <th className="p-4">Dish & Chef</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-stone-400 text-sm">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const isRemovedByUser = b.removedByUser || b.status === 'Order Removed';
                  return (
                    <motion.tr
                      layout
                      key={b.id}
                      className={isRemovedByUser ? 'bg-red-50/30' : ''}
                    >
                      <td className="p-4 font-extrabold text-orange-600">{b.id}</td>
                      <td className="p-4">
                        <p className="font-bold text-stone-900">{b.customerName}</p>
                        <p className="text-xs text-stone-400">
                          {b.phone} • {b.guests} Guests
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="font-medium text-stone-800">{b.dishName}</p>
                        <p className="text-xs text-stone-400">{b.chefName}</p>
                      </td>
                      <td className="p-4 text-xs text-stone-600">
                        {b.date} <br /> {b.time}
                      </td>
                      <td className="p-4 font-bold">
                        ₹{b.amount}
                        <span className="block text-[10px] text-emerald-600">
                          {b.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        {isRemovedByUser ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                            <ArrowRight className="w-3.5 h-3.5" />
                            <span>Order Removed</span>
                          </span>
                        ) : (
                          <select
                            value={b.status}
                            onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                            className="p-2 rounded-lg border border-stone-200 text-xs font-bold bg-stone-50"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}