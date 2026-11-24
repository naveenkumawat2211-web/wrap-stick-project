import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Smartphone, CreditCard, CheckCircle2, XCircle, Loader2, Flame } from 'lucide-react';

export default function PaymentModal({
  isOpen,
  onClose,
  amount,
  customerName,
  onPaymentComplete,
  onSuccess
}) {
  const [method, setMethod] = useState('UPI (Google Pay / PhonePe)');
  const [status, setStatus] = useState('idle');

  if (!isOpen) return null;

  const triggerCallback = (payload) => {
    if (typeof onPaymentComplete === 'function') {
      onPaymentComplete(payload);
    }
    if (typeof onSuccess === 'function') {
      onSuccess(payload);
    }
  };

  const simulatePayment = (outcome) => {
    setStatus('processing');
    setTimeout(() => {
      setStatus(outcome);
      if (outcome === 'success') {
        setTimeout(() => {
          triggerCallback({ status: 'Success', method });
          setStatus('idle');
        }, 1000);
      }
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-stone-200"
        >
          <div className="bg-gradient-to-r from-stone-900 to-stone-800 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-base">Wrap-stick Pay</h3>
                <p className="text-xs text-stone-300">Instant Checkout • {customerName || 'Guest'}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {status === 'idle' && (
              <>
                <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-5 flex items-center justify-between">
                  <span className="text-sm font-medium text-stone-600">Payable Amount</span>
                  <span className="text-2xl font-extrabold text-orange-600">₹{amount}</span>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
                  Select Payment Method
                </p>
                <div className="space-y-2.5 mb-6">
                  {[
                    { label: 'UPI (Google Pay / PhonePe)', icon: Smartphone },
                    { label: 'Credit / Debit Card', icon: CreditCard }
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setMethod(item.label)}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition ${
                          method === item.label
                            ? 'border-orange-500 bg-orange-50/60 text-stone-900 font-semibold'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 text-orange-600" />
                        <span className="text-sm">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => simulatePayment('failed')}
                    className="py-3 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition"
                  >
                    Simulate Failure
                  </button>
                  <button
                    type="button"
                    onClick={() => simulatePayment('success')}
                    className="py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold shadow-md shadow-orange-600/20 transition"
                  >
                    Pay ₹{amount}
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-stone-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>256-bit Encrypted Payment Gateway</span>
                </div>
              </>
            )}

            {status === 'processing' && (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-12 h-12 text-orange-600 animate-spin mx-auto" />
                <h4 className="font-bold text-stone-900">Processing Payment...</h4>
                <p className="text-xs text-stone-500">Verifying transaction, please wait</p>
              </div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-10 text-center space-y-3"
              >
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h4 className="text-xl font-extrabold text-stone-900">Payment Successful!</h4>
                <p className="text-sm text-stone-500">Confirming your Wrap-stick reservation...</p>
              </motion.div>
            )}

            {status === 'failed' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-8 text-center space-y-4"
              >
                <XCircle className="w-14 h-14 text-red-500 mx-auto" />
                <div>
                  <h4 className="text-lg font-extrabold text-stone-900">Payment Declined</h4>
                  <p className="text-xs text-stone-500 mt-1">Simulated bank timeout. Please try again.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 rounded-xl bg-stone-900 text-white text-sm font-semibold"
                >
                  Retry Payment
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
