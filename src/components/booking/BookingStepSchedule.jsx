import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, KeyRound, ShieldCheck, RefreshCw } from 'lucide-react';
import { TIME_SLOTS } from '../../constants/orderConfig';

export default function BookingStepSchedule({
  form,
  setForm,
  error,
  infoMsg,
  isCurrentPhoneVerified,
  onPhoneChange,
  otpState,
  onBack,
  onNext
}) {
  const {
    otpSent,
    otpTargetPhone,
    otpInput,
    setOtpInput,
    sendingOtp,
    verifyingOtp,
    resendTimer,
    requestOtp,
    confirmOtp,
    resetOtpState
  } = otpState;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      {error && (
        <motion.div
          initial={{ x: -10 }}
          animate={{ x: 0 }}
          className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold"
        >
          {error}
        </motion.div>
      )}

      {infoMsg && (
        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
          {infoMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">
            <Calendar className="w-3.5 h-3.5 inline mr-1" /> Date
          </label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">
            <Clock className="w-3.5 h-3.5 inline mr-1" /> Time Slot
          </label>
          <select
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">
            <Users className="w-3.5 h-3.5 inline mr-1" /> Guests
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={form.guests}
            onChange={(e) => setForm({ ...form, guests: Number(e.target.value) })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">Your Name *</label>
          <input
            type="text"
            placeholder="e.g. Aman Prince"
            value={form.customerName}
            onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1.5">
            Mobile Number (OTP Required) *
          </label>
          <div className="flex gap-2">
            <input
              type="tel"
              maxLength={10}
              placeholder="10-digit mobile number"
              value={form.phone}
              onChange={onPhoneChange}
              className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
            />
            {isCurrentPhoneVerified ? (
              <span className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" /> Verified
              </span>
            ) : (
              <button
                type="button"
                onClick={() => requestOtp(form.phone)}
                disabled={sendingOtp || resendTimer > 0}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold shrink-0 cursor-pointer disabled:opacity-50"
              >
                <KeyRound className="w-3.5 h-3.5 text-orange-400" />
                <span>
                  {sendingOtp
                    ? 'Sending...'
                    : resendTimer > 0
                    ? `Resend (${resendTimer}s)`
                    : otpSent
                    ? 'Resend'
                    : 'Send OTP'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {otpSent && !isCurrentPhoneVerified && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-amber-900 font-medium">
              6-digit OTP sent to <strong>+91 {otpTargetPhone}</strong>
            </span>
            <button
              type="button"
              onClick={resetOtpState}
              className="text-orange-700 font-bold hover:underline cursor-pointer"
            >
              Change Number
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="flex-1 p-2.5 rounded-xl border border-amber-300 bg-white text-sm font-bold tracking-widest"
            />
            <button
              type="button"
              onClick={confirmOtp}
              disabled={verifyingOtp}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              {verifyingOtp ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={() => requestOtp(form.phone)}
              disabled={sendingOtp || resendTimer > 0}
              className="inline-flex items-center justify-center gap-1 px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-stone-700 text-xs font-bold cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{resendTimer > 0 ? `${resendTimer}s` : 'Resend'}</span>
            </button>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-stone-500 mb-1.5">
          Spice Level / Special Requests
        </label>
        <input
          type="text"
          placeholder="Extra garlic aioli, mild spice, farmhouse garden table..."
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
        />
      </div>

      <div className="pt-3 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-stone-100 text-stone-700 text-sm font-semibold"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold"
        >
          Review Order
        </button>
      </div>
    </motion.div>
  );
}
