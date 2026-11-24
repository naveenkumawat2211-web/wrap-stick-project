export const ORDER_CANCEL_WINDOW_MS = 5 * 60 * 1000;

export const BOOKING_TYPES = [
  'Dine-In Table + Pre-Order',
  'Express Takeaway'
];

export const TIME_SLOTS = [
  '12:30 PM',
  '01:30 PM',
  '07:00 PM',
  '08:00 PM',
  '09:15 PM'
];

export const BOOKING_STATUSES = [
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled'
];

export const STORAGE_KEYS = {
  USER_BOOKING_IDS: 'wrapstick_my_booking_ids_v3',
  USER_PHONE: 'wrapstick_user_phone_v3',
  ADMIN_SESSION: 'wrapstick_admin_auth_v1',
  CART: 'wrapstick_cart_v1'
};

export const normalizePhone = (phone) =>
  String(phone || '').replace(/\D/g, '').slice(-10);

export const canCustomerCancelOrder = (booking, nowMs = Date.now()) => {
  if (!booking || booking.removedByUser) return false;
  if (['Completed', 'Cancelled', 'Order Removed'].includes(booking.status)) return false;
  const created = Number(booking.createdAt || 0);
  if (!created) return false;
  return nowMs - created <= ORDER_CANCEL_WINDOW_MS;
};
