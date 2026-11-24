import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import PaymentModal from '../../components/PaymentModal';
import BookingStepItems from '../../components/booking/BookingStepItems';
import BookingStepSchedule from '../../components/booking/BookingStepSchedule';
import {
  BookingStepReview,
  BookingStepConfirmed
} from '../../components/booking/BookingStepReview';
import { usePhoneOtp } from '../../hooks/usePhoneOtp';
import { useOrderCountdown } from '../../hooks/useOrderCountdown';
import { normalizePhone } from '../../constants/orderConfig';

export default function BookingPage() {
  const appContext = useApp() || {};
  const db = appContext.db || { menuItems: [], chefs: [], bookings: [], settings: {} };
  const userPhone = normalizePhone(appContext.userPhone);
  const saveUserPhone = appContext.saveUserPhone;
  const createBooking = appContext.createBooking;
  const removeBookingByUser = appContext.removeBookingByUser || appContext.deleteBooking;

  const cart = Array.isArray(appContext.cart) ? appContext.cart : [];
  const addToCart = appContext.addToCart;
  const updateCartQty = appContext.updateCartQty;
  const clearCart = appContext.clearCart;
  const cartTotal = Number(appContext.cartTotal || 0);

  const [searchParams] = useSearchParams();
  const phoneNumber = db.settings?.whatsappNumber || '917597386371';

  const menuItems = Array.isArray(db.menuItems) ? db.menuItems : [];
  const chefs = Array.isArray(db.chefs) ? db.chefs : [];
  const bookingsList = Array.isArray(db.bookings) ? db.bookings : [];

  const dishParam = searchParams.get('dish');
  const initialDish = dishParam || menuItems[0]?.id || '';
  const initialChef = searchParams.get('chef') || chefs[0]?.id || '';

  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [verifiedPhoneForOrder, setVerifiedPhoneForOrder] = useState(
    userPhone.length === 10 ? userPhone : ''
  );

  const [form, setForm] = useState({
    bookingType: 'Dine-In Table + Pre-Order',
    dishId: initialDish,
    chefId: initialChef,
    date: new Date().toISOString().split('T')[0],
    time: '08:00 PM',
    guests: 2,
    customerName: '',
    phone: userPhone,
    notes: ''
  });

  const { getRemainingMs, formatCountdown } = useOrderCountdown();

  const otpState = usePhoneOtp({
    containerId: 'booking-otp-recaptcha',
    onVerified: (verifiedNum) => {
      setVerifiedPhoneForOrder(verifiedNum);
      if (typeof saveUserPhone === 'function') {
        saveUserPhone(verifiedNum);
      }
    }
  });

  useEffect(() => {
    if (dishParam && menuItems.length > 0 && cart.length === 0 && typeof addToCart === 'function') {
      const targetItem = menuItems.find((m) => m.id === dishParam);
      if (targetItem) addToCart(targetItem);
    }
  }, [dishParam, menuItems.length]);

  const cleanFormPhone = normalizePhone(form.phone);
  const isCurrentPhoneVerified =
    cleanFormPhone.length === 10 && verifiedPhoneForOrder === cleanFormPhone;

  const myOwnBookings = useMemo(() => {
    if (userPhone.length !== 10) return [];
    return bookingsList.filter(
      (b) =>
        b &&
        !b.removedByUser &&
        b.status !== 'Order Removed' &&
        normalizePhone(b.phone) === userPhone
    );
  }, [bookingsList, userPhone]);

  const selectedDish = menuItems.find((m) => m.id === form.dishId) || menuItems[0];
  const selectedChef = chefs.find((c) => c.id === form.chefId) || chefs[0];

  const hasCartItems = cart.length > 0;
  const orderSummaryTitle = hasCartItems
    ? cart.map((i) => `${i.name} x${i.qty}`).join(', ')
    : selectedDish?.name || 'Signature Combo';
  const totalAmount = hasCartItems ? cartTotal : selectedDish ? Number(selectedDish.price) : 249;

  const handlePhoneChange = (e) => {
    const digits = normalizePhone(e.target.value);
    setForm({ ...form, phone: digits });
    setError('');
    if (digits !== verifiedPhoneForOrder) {
      otpState.resetOtpState();
    }
  };

  const handleNextStep = () => {
    setError('');
    otpState.setOtpError('');
    if (step === 2) {
      if (!form.customerName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (cleanFormPhone.length < 10) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (!isCurrentPhoneVerified) {
        setError('Please verify your mobile number with OTP before continuing.');
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const handleFinalizeBooking = async (paymentInfo) => {
    setPaymentModalOpen(false);
    if (typeof createBooking !== 'function') return;

    setSubmitting(true);
    try {
      const created = await createBooking(
        {
          ...form,
          phone: cleanFormPhone,
          dishName: orderSummaryTitle,
          items: hasCartItems
            ? cart
            : selectedDish
            ? [{ id: selectedDish.id, name: selectedDish.name, price: selectedDish.price, qty: 1 }]
            : [],
          chefName: selectedChef?.name || 'Any Available Chef',
          amount: totalAmount
        },
        paymentInfo
      );
      if (created) {
        if (hasCartItems && typeof clearCart === 'function') clearCart();
        setConfirmedBooking(created);
        setStep(4);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOwnBooking = (id) => {
    if (window.confirm('Do you want to remove this order?')) {
      if (typeof removeBookingByUser === 'function') removeBookingByUser(id);
      if (confirmedBooking?.id === id) {
        setConfirmedBooking(null);
        setStep(1);
      }
    }
  };

  const whatsappConfirmUrl = confirmedBooking
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        `Hi Wrap-stick (Gudha Gorji)! Booking Confirmed (${confirmedBooking.id})
Name: ${confirmedBooking.customerName}
Type: ${confirmedBooking.bookingType}
Order: ${confirmedBooking.dishName}
Amount: ₹${confirmedBooking.amount}
Date/Time: ${confirmedBooking.date} at ${confirmedBooking.time}`
      )}`
    : '#';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 py-12"
    >
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Instant Table & Pre-Order • Gudha Gorji
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 mt-1">Reserve at Wrap-stick</h1>
      </div>

      {step < 4 && (
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  step >= num ? 'bg-orange-600 text-white' : 'bg-stone-200 text-stone-500'
                }`}
              >
                {num}
              </div>
              <span className="text-xs font-semibold text-stone-600 hidden sm:inline">
                {num === 1 ? 'Items & Chef' : num === 2 ? 'Schedule & OTP' : 'Review & Pay'}
              </span>
              {num < 3 && <div className="w-8 h-0.5 bg-stone-200" />}
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        {step === 1 && (
          <BookingStepItems
            form={form}
            setForm={setForm}
            cart={cart}
            hasCartItems={hasCartItems}
            cartTotal={cartTotal}
            updateCartQty={updateCartQty}
            menuItems={menuItems}
            chefs={chefs}
            onNext={handleNextStep}
          />
        )}

        {step === 2 && (
          <BookingStepSchedule
            form={form}
            setForm={setForm}
            error={error || otpState.otpError}
            infoMsg={otpState.otpInfo}
            isCurrentPhoneVerified={isCurrentPhoneVerified}
            onPhoneChange={handlePhoneChange}
            otpState={otpState}
            onBack={() => setStep(1)}
            onNext={handleNextStep}
          />
        )}

        {step === 3 && (
          <BookingStepReview
            form={form}
            cleanPhone={cleanFormPhone}
            selectedChef={selectedChef}
            orderSummaryTitle={orderSummaryTitle}
            totalAmount={totalAmount}
            submitting={submitting}
            onBack={() => setStep(2)}
            onProceedPay={() => setPaymentModalOpen(true)}
          />
        )}

        {step === 4 && confirmedBooking && (
          <BookingStepConfirmed
            confirmedBooking={confirmedBooking}
            whatsappUrl={whatsappConfirmUrl}
            remainingMs={getRemainingMs(confirmedBooking.createdAt)}
            formatCountdown={formatCountdown}
            onDeleteBooking={handleDeleteOwnBooking}
          />
        )}

        <div id="booking-otp-recaptcha" />
      </div>

      {myOwnBookings.length > 0 && step < 4 && (
        <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-stone-800">
              Active Orders for +91 {userPhone} ({myOwnBookings.length})
            </h3>
            <Link to="/my-bookings" className="text-xs font-bold text-orange-600 hover:underline">
              Manage All →
            </Link>
          </div>
          <div className="space-y-2">
            {myOwnBookings.slice(0, 3).map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-stone-50"
              >
                <span className="font-bold text-stone-800">
                  {b.id} • {b.dishName}
                </span>
                <span className="font-semibold text-orange-600">
                  ₹{b.amount} ({b.status})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <PaymentModal
        isOpen={paymentModalOpen}
        amount={totalAmount}
        customerName={form.customerName}
        onClose={() => setPaymentModalOpen(false)}
        onPaymentComplete={handleFinalizeBooking}
      />
    </motion.div>
  );
}
