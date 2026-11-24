import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminPayments() {
  const { db } = useApp();

  const totalCollected = db.payments
    .filter((p) => p.status === 'Success')
    .reduce((acc, p) => acc + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Payment Transactions</h1>
        <p className="text-sm text-stone-500">Checkout logs and daily revenue split.</p>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold uppercase text-stone-400">Net Settled Volume</p>
            <p className="text-3xl font-extrabold text-stone-900">₹{totalCollected.toLocaleString()}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-3 pt-2">
          {[
            { label: 'Signature Wraps', pct: 68 },
            { label: 'Flame Skewers & Platters', pct: 56 },
            { label: 'Loaded Sides, Drinks & Desserts', pct: 42 }
          ].map((bar) => (
            <div key={bar.label}>
              <div className="flex justify-between text-xs font-semibold text-stone-600 mb-1">
                <span>{bar.label}</span>
                <span>{bar.pct}%</span>
              </div>
              <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${bar.pct}%` }}
                  transition={{ duration: 0.7 }}
                  className="h-full bg-orange-600 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500">
              <tr>
                <th className="p-4">Payment ID</th>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Method</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {db.payments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-stone-400 text-sm">
                    No transactions recorded yet.
                  </td>
                </tr>
              ) : (
                db.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-4 font-bold text-stone-900">{p.id}</td>
                    <td className="p-4 text-orange-600 font-semibold">{p.bookingId}</td>
                    <td className="p-4">{p.customerName}</td>
                    <td className="p-4 text-xs text-stone-500">{p.method}</td>
                    <td className="p-4 font-extrabold">₹{p.amount}</td>
                    <td className="p-4">
                      {p.status === 'Success' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" /> Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                          <XCircle className="w-4 h-4" /> {p.status}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
