import React, { useState, useEffect } from 'react';
import { sendRealOtp, verifyRealOtp } from '../utils/phoneOtp';
import { useApp } from '../context/AppContext';

export default function PhoneOtpBox({
  initialPhone = '',
  onVerified,
  title = 'Mobile Number OTP Verification',
  buttonLabel = 'Verify & Continue'
}) {
  const { saveUserPhone } = useApp();

  const [phone, setPhone] = useState(() =>
    String(initialPhone || '').replace(/\D/g, '').slice(-10)
  );
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [loadingSend, setLoadingSend] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleSendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);

    if (cleanPhone.length !== 10) {
      setErrorMsg('Kripya sahi 10-digit mobile number daalein.');
      return;
    }

    try {
      setLoadingSend(true);
      const result = await sendRealOtp(cleanPhone, 'recaptcha-container');
      setConfirmationResult(result);
      setOtpSent(true);
      setResendTimer(30);
      setSuccessMsg(`+91 ${cleanPhone} par OTP bhej diya gaya hai.`);
    } catch (err) {
      console.error('Send OTP error:', err);
      setErrorMsg(err?.message || 'OTP bhejne mein samasya aayi. Dobara try karein.');
    } finally {
      setLoadingSend(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanPhone = String(phone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg('Pehle sahi 10-digit mobile number daalein.');
      return;
    }

    if (!confirmationResult) {
      setErrorMsg('Pehle "Send OTP" par click karein.');
      return;
    }

    if (String(otp || '').trim().length < 6) {
      setErrorMsg('Kripya 6-digit OTP daalein.');
      return;
    }

    try {
      setLoadingVerify(true);
      const user = await verifyRealOtp(confirmationResult, otp);
      saveUserPhone(cleanPhone);
      setSuccessMsg('Mobile number successfully verify ho gaya!');
      if (typeof onVerified === 'function') {
        onVerified({ phone: cleanPhone, firebaseUser: user });
      }
    } catch (err) {
      console.error('Verify OTP error:', err);
      setErrorMsg(err?.message || 'Galat OTP hai. Kripya sahi OTP daalein.');
    } finally {
      setLoadingVerify(false);
    }
  };

  const handleResetNumber = () => {
    setOtpSent(false);
    setOtp('');
    setConfirmationResult(null);
    setErrorMsg('');
    setSuccessMsg('');
    setResendTimer(0);
  };

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">{title}</h3>
        {otpSent && (
          <button
            type="button"
            onClick={handleResetNumber}
            className="text-xs font-medium text-orange-600 hover:underline"
          >
            Change Number
          </button>
        )}
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">
            Mobile Number (India)
          </label>
          <div className="flex gap-2">
            <div className="flex items-center rounded-xl border border-slate-300 bg-slate-50 px-3 text-sm font-medium text-slate-700">
              +91
            </div>
            <input
              type="tel"
              maxLength={10}
              disabled={otpSent}
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              placeholder="10-digit mobile number"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-orange-500 focus:outline-none disabled:bg-slate-100"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loadingSend || resendTimer > 0}
              className="shrink-0 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loadingSend
                ? 'Sending...'
                : resendTimer > 0
                ? `Resend (${resendTimer}s)`
                : otpSent
                ? 'Resend OTP'
                : 'Send OTP'}
            </button>
          </div>
        </div>

        {otpSent && (
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Enter 6-Digit SMS OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••••"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-center text-base font-semibold tracking-[0.4em] text-slate-900 focus:border-orange-500 focus:outline-none"
            />
          </div>
        )}

        {errorMsg && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
            {errorMsg}
          </p>
        )}

        {successMsg && (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">
            {successMsg}
          </p>
        )}

        {otpSent && (
          <button
            type="submit"
            disabled={loadingVerify}
            className="w-full rounded-xl bg-orange-600 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
          >
            {loadingVerify ? 'Verifying...' : buttonLabel}
          </button>
        )}
      </form>

      {/* Invisible reCAPTCHA container required by Firebase Phone Auth */}
      <div id="recaptcha-container" className="mt-2" />
    </div>
  );
}