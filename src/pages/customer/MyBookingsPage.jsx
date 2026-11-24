import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Timer,
  XCircle,
  Trash2,
  Phone,
  ShieldCheck,
  KeyRound,
  LogOut,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { usePhoneOtp } from '../../hooks/usePhoneOtp';
import { useOrderCountdown } from '../../hooks/useOrderCountdown';
import { normalizePhone, canCustomerCancelOrder } from '../../constants/orderConfig';

export default function MyBookingsPage() {
  const appContext = useApp() || {};
  const db = appContext.db || { bookings: [] };
  const contextPhone = normalizePhone(appContext.userPhone);
  const saveUserPhone = appContext.saveUserPhone;
  const removeBookingByUser = appContext.removeBookingByUser || appContext.deleteBooking;

  const [phoneInput, setPhoneInput] = useState(contextPhone);
  const [verifiedPhone, setVerifiedPhone] = useState(contextPhone);

  const { getRemainingMs, formatCountdown } = useOrderCountdown();

  const otpState = usePhoneOtp({
    containerId: 'my-bookings-recaptcha',
    onVerified: (verifiedNum) => {
      setVerifiedPhone(verifiedNum);
      if (typeof saveUserPhone === 'function') {
        saveUserPhone(verifiedNum);
      }
    }
  });

  const bookingsList = Array.isArray(db.bookings) ? db.bookings : [];

  const myBookings = useMemo(() => {
    if (verifiedPhone.length !== 10) return [];
    return bookingsList.filter(
      (b) =>
        b &&
        !b.removedByUser &&
        b.status !== 'Order Removed' &&
        normalizePhone(b.phone) === verifiedPhone
    );
  }, [bookingsList, verifiedPhone]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    const ok = await otpState.requestOtp(phoneInput);
    if (ok) setVerifiedPhone('');
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    await otpState.confirmOtp();
  };

  const handleLogoutPhone = () => {
    setPhoneInput('');
    setVerifiedPhone('');
    otpState.resetOtpState();
    if (typeof saveUserPhone === 'function') {
      saveUserPhone('');
    }
  };

  const handleRemove = (id) => {
    if (window.confirm('Are you sure you want to remove this order?')) {
      if (typeof removeBookingByUser === 'function') {
        removeBookingByUser(id);
      }
    }
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Completed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-stone-900">My Bookings & Orders</h1>
          <p className="text-sm text-stone-500 mt-1">
            Protected with SMS OTP verification so only you can view or remove your orders.
          </p>
        </div>
        <Link
          to="/book"
          className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold self-start"
        >
          + New Booking
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6 shadow-sm space-y-4">
        {verifiedPhone.length === 10 ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-stone-400">Verified Mobile Number</p>
                <p className="text-sm font-extrabold text-stone-900">+91 {verifiedPhone}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogoutPhone}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-bold self-start sm:self-center cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Change / Logout Number</span>
            </button>
          </div>
        ) : !otpState.otpSent ? (
          <form onSubmit={handleSendOtp} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                maxLength={10}
                value={phoneInput}
                onChange={(e) => setPhoneInput(normalizePhone(e.target.value))}
                placeholder="Enter your 10-digit mobile number to receive SMS OTP..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm focus:outline-none focus:border-orange-500"
              />
            </div>
            <button
              type="submit"
              disabled={otpState.sendingOtp}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4 text-orange-400" />
              <span>{otpState.sendingOtp ? 'Sending...' : 'Send OTP'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-medium">
                6-digit OTP sent via SMS to <strong>+91 {otpState.otpTargetPhone}</strong>
              </span>
              <button
                type="button"
                onClick={otpState.resetOtpState}
                className="text-orange-700 font-bold hover:underline cursor-pointer"
              >
                Change Number
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <KeyRound className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpState.otpInput}
                  onChange={(e) =>
                    otpState.setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm tracking-widest font-bold focus:outline-none focus:border-orange-500"
                />
              </div>

              <button
                type="submit"
                disabled={otpState.verifyingOtp}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition cursor-pointer disabled:opacity-50"
              >
                {otpState.verifyingOtp ? 'Verifying...' : 'Verify & View Bookings'}
              </button>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpState.sendingOtp || otpState.resendTimer > 0}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-600 text-xs font-bold hover:bg-stone-50 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>
                  {otpState.resendTimer > 0 ? `Resend (${otpState.resendTimer}s)` : 'Resend'}
                </span>
              </button>
            </div>
          </form>
        )}

        {otpState.otpInfo && (
          <p className="text-xs font-semibold text-emerald-700">{otpState.otpInfo}</p>
        )}
        {otpState.otpError && (
          <p className="text-xs font-semibold text-red-600">{otpState.otpError}</p>
        )}
        <div id="my-bookings-recaptcha" />
      </div>

      {verifiedPhone.length < 10 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-stone-500 mb-4">
            Verify your <strong>10-digit mobile number with SMS OTP</strong> above to unlock and
            view your bookings.
          </p>
          <Link
            to="/book"
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold"
          >
            Book a Table Now
          </Link>
        </div>
      ) : myBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
          <p className="text-stone-600 font-medium mb-4">
            No active bookings found for verified number <strong>+91 {verifiedPhone}</strong>.
          </p>
          <Link
            to="/book"
            className="px-5 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold"
          >
            Make a New Booking
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {myBookings.map((booking, idx) => {
              const remainingMs = getRemainingMs(booking.createdAt);
              const isCancelable = canCustomerCancelOrder(booking) && remainingMs > 0;

              return (
                <motion.div
                  layout
                  key={booking.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xs font-extrabold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md">
                        {booking.id}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        {booking.bookingType}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-stone-900">{booking.dishName}</h3>
                    <p className="text-xs text-stone-500">
                      Guest: <strong>{booking.customerName}</strong> ({booking.phone}) • Chef:{' '}
                      {booking.chefName}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-stone-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-orange-500" /> {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-orange-500" /> {booking.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-orange-500" /> {booking.guests} Guests
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between gap-2.5">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${statusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status === 'Confirmed' && (
                        <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                      )}
                      {booking.status === 'Pending' && <Timer className="w-3.5 h-3.5 inline mr-1" />}
                      {booking.status === 'Cancelled' && (
                        <XCircle className="w-3.5 h-3.5 inline mr-1" />
                      )}
                      {booking.status}
                    </span>

                    <div className="text-right">
                      <p className="text-lg font-extrabold text-stone-900">₹{booking.amount}</p>
                      <p className="text-[11px] font-semibold text-stone-400">
                        Payment: {booking.paymentStatus}
                      </p>
                    </div>

                    {isCancelable ? (
                      <div className="flex flex-col items-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleRemove(booking.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                        <span className="text-[10px] font-semibold text-amber-700">
                          Cancel/Remove window: {formatCountdown(remainingMs)} left
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-semibold text-stone-400">
                        Cancel/Remove locked (&gt;5 min)
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
