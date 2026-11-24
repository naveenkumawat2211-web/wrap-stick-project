import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CreditCard,
  CheckCircle2,
  MessageCircle,
  ClipboardList,
  Trash2
} from 'lucide-react';
import { canCustomerCancelOrder } from '../../constants/orderConfig';

export function BookingStepReview({
  form,
  cleanPhone,
  selectedChef,
  orderSummaryTitle,
  totalAmount,
  submitting,
  onBack,
  onProceedPay
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Guest:</span>
          <span className="font-bold text-stone-900">
            {form.customerName} (+91 {cleanPhone})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Booking Type:</span>
          <span className="font-semibold text-stone-900">{form.bookingType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Schedule:</span>
          <span className="font-semibold text-stone-900">
            {form.date} • {form.time} ({form.guests} Guests)
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Chef:</span>
          <span className="font-semibold text-stone-900">{selectedChef?.name}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-stone-500 shrink-0">Order Items:</span>
          <span className="font-semibold text-stone-900 text-right">{orderSummaryTitle}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-stone-200 text-base">
          <span className="font-bold text-stone-900">Total Payable:</span>
          <span className="font-extrabold text-orange-600">₹{totalAmount}</span>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          disabled={submitting}
          onClick={onProceedPay}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition cursor-pointer disabled:opacity-50"
        >
          <CreditCard className="w-4 h-4" />
          <span>{submitting ? 'Saving...' : `Proceed to Pay ₹${totalAmount}`}</span>
        </button>
      </div>
    </motion.div>
  );
}

export function BookingStepConfirmed({
  confirmedBooking,
  whatsappUrl,
  remainingMs,
  formatCountdown,
  onDeleteBooking
}) {
  const canRemove = canCustomerCancelOrder(confirmedBooking) && remainingMs > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center space-y-5"
    >
      <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-8 h-8" />
      </div>
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900">Booking Confirmed!</h2>
        <p className="text-sm text-stone-500 mt-1">
          Booking ID: <strong className="text-orange-600">{confirmedBooking.id}</strong>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Send on WhatsApp</span>
        </a>

        <Link
          to="/my-bookings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-bold"
        >
          <ClipboardList className="w-4 h-4" />
          <span>View My Bookings</span>
        </Link>

        {canRemove && (
          <button
            type="button"
            onClick={() => onDeleteBooking(confirmedBooking.id)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Order ({formatCountdown(remainingMs)})</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
