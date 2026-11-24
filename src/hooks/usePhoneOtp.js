import { useState, useEffect, useCallback } from 'react';
import { sendRealOtp, verifyRealOtp } from '../utils/phoneOtp';
import { normalizePhone } from '../constants/orderConfig';

export function usePhoneOtp({ containerId = 'recaptcha-container', onVerified } = {}) {
  const [otpSent, setOtpSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otpTargetPhone, setOtpTargetPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [otpError, setOtpError] = useState('');
  const [otpInfo, setOtpInfo] = useState('');

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [resendTimer]);

  const resetOtpState = useCallback(() => {
    setOtpSent(false);
    setConfirmationResult(null);
    setOtpTargetPhone('');
    setOtpInput('');
    setResendTimer(0);
    setOtpError('');
    setOtpInfo('');
  }, []);

  const requestOtp = useCallback(
    async (rawPhone) => {
      setOtpError('');
      setOtpInfo('');
      const cleanPhone = normalizePhone(rawPhone);
      if (cleanPhone.length !== 10) {
        setOtpError('Please enter a valid 10-digit mobile number.');
        return false;
      }

      try {
        setSendingOtp(true);
        const result = await sendRealOtp(cleanPhone, containerId);
        setConfirmationResult(result);
        setOtpTargetPhone(cleanPhone);
        setOtpInput('');
        setOtpSent(true);
        setResendTimer(30);
        setOtpInfo(`6-digit SMS OTP sent to +91 ${cleanPhone}.`);
        return true;
      } catch (err) {
        console.error('Send OTP error:', err);
        setOtpError(err?.message || 'Failed to send SMS OTP. Please try again.');
        return false;
      } finally {
        setSendingOtp(false);
      }
    },
    [containerId]
  );

  const confirmOtp = useCallback(async () => {
    setOtpError('');
    setOtpInfo('');
    if (!confirmationResult) {
      setOtpError('Please send OTP first.');
      return null;
    }
    if (otpInput.trim().length < 6) {
      setOtpError('Please enter the 6-digit OTP sent to your number.');
      return null;
    }

    try {
      setVerifyingOtp(true);
      const user = await verifyRealOtp(confirmationResult, otpInput.trim());
      const verifiedPhone = otpTargetPhone;
      setOtpSent(false);
      setConfirmationResult(null);
      setOtpInput('');
      setOtpInfo('Mobile number verified successfully!');
      if (typeof onVerified === 'function') {
        onVerified(verifiedPhone, user);
      }
      return verifiedPhone;
    } catch (err) {
      console.error('Verify OTP error:', err);
      setOtpError(err?.message || 'Invalid OTP. Please enter the 6-digit OTP sent to your number.');
      return null;
    } finally {
      setVerifyingOtp(false);
    }
  }, [confirmationResult, otpInput, otpTargetPhone, onVerified]);

  return {
    otpSent,
    otpTargetPhone,
    otpInput,
    setOtpInput,
    sendingOtp,
    verifyingOtp,
    resendTimer,
    otpError,
    setOtpError,
    otpInfo,
    setOtpInfo,
    requestOtp,
    confirmOtp,
    resetOtpState
  };
}
