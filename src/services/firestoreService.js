import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db as firestore } from '../firebase';
import { INITIAL_DATA } from '../data/initialData';
import { ORDER_CANCEL_WINDOW_MS, normalizePhone } from '../constants/orderConfig';

export const subscribeMenuItems = (onData, onError) => {
  const menuRef = collection(firestore, 'menuItems');
  return onSnapshot(
    menuRef,
    async (snapshot) => {
      if (snapshot.empty) {
        try {
          const batch = writeBatch(firestore);
          INITIAL_DATA.menuItems.forEach((item) => {
            batch.set(doc(firestore, 'menuItems', item.id), item);
          });
          await batch.commit();
        } catch (err) {
          console.error('Failed to seed menuItems:', err);
        }
      } else {
        onData(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      }
    },
    onError
  );
};

export const subscribeBookings = (onData, onError) => {
  const bookingsRef = collection(firestore, 'bookings');
  return onSnapshot(
    bookingsRef,
    (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onData(list);
    },
    onError
  );
};

export const subscribePayments = (onData, onError) => {
  const paymentsRef = collection(firestore, 'payments');
  return onSnapshot(
    paymentsRef,
    (snapshot) => {
      const list = snapshot.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      onData(list);
    },
    onError
  );
};

export const subscribeSettings = (onData, onError) => {
  const settingsDoc = doc(firestore, 'config', 'settings');
  return onSnapshot(
    settingsDoc,
    async (docSnap) => {
      if (!docSnap.exists()) {
        try {
          await setDoc(settingsDoc, INITIAL_DATA.settings);
        } catch (err) {
          console.error('Failed to initialize settings:', err);
        }
      } else {
        onData({ ...INITIAL_DATA.settings, ...docSnap.data() });
      }
    },
    onError
  );
};

export const createMenuItemDoc = async (item) => {
  const id = 'm' + Date.now();
  const newItem = {
    ...item,
    id,
    price: Number(item.price),
    rating: Number(item.rating || 4.8)
  };
  await setDoc(doc(firestore, 'menuItems', id), newItem);
  return newItem;
};

export const updateMenuItemDoc = async (updatedItem) => {
  await updateDoc(doc(firestore, 'menuItems', updatedItem.id), {
    ...updatedItem,
    price: Number(updatedItem.price)
  });
};

export const deleteMenuItemDoc = async (id) => {
  await deleteDoc(doc(firestore, 'menuItems', id));
};

export const createBookingAndPayment = async (bookingData, paymentInfo) => {
  const bookingId = 'WS-' + Math.floor(1000 + Math.random() * 9000);
  const paymentId = 'PAY-' + Math.floor(1000 + Math.random() * 9000);
  const cleanPhone = normalizePhone(bookingData.phone);
  const timestamp = Date.now();

  const newBooking = {
    ...bookingData,
    phone: cleanPhone,
    id: bookingId,
    paymentStatus: paymentInfo?.status === 'Success' ? 'Paid' : 'Pending',
    status: paymentInfo?.status === 'Success' ? 'Confirmed' : 'Pending',
    removedByUser: false,
    createdAt: timestamp,
    serverCreatedAt: serverTimestamp()
  };

  const newPayment = {
    id: paymentId,
    bookingId,
    customerName: bookingData.customerName,
    amount: bookingData.amount,
    method: paymentInfo?.method || 'Online',
    status: paymentInfo?.status || 'Success',
    date: new Date().toISOString().split('T')[0],
    createdAt: timestamp,
    serverCreatedAt: serverTimestamp()
  };

  const batch = writeBatch(firestore);
  batch.set(doc(firestore, 'bookings', bookingId), newBooking);
  batch.set(doc(firestore, 'payments', paymentId), newPayment);
  await batch.commit();

  return newBooking;
};

export const updateBookingStatusDoc = async (id, status) => {
  await updateDoc(doc(firestore, 'bookings', id), { status });
};

export const cancelBookingByCustomerDoc = async (booking) => {
  if (!booking?.id) throw new Error('Invalid booking ID');
  if (booking.createdAt && Date.now() - Number(booking.createdAt) > ORDER_CANCEL_WINDOW_MS) {
    throw new Error('5 minutes ho chuke hain, ab customer is order ko cancel ya remove nahi kar sakta.');
  }
  await updateDoc(doc(firestore, 'bookings', booking.id), {
    status: 'Order Removed',
    removedByUser: true,
    removedAt: Date.now()
  });
};

export const deleteBookingCascadeDoc = async (id, payments = []) => {
  const batch = writeBatch(firestore);
  batch.delete(doc(firestore, 'bookings', id));
  payments
    .filter((p) => p.bookingId === id)
    .forEach((pay) => {
      batch.delete(doc(firestore, 'payments', pay.id));
    });
  await batch.commit();
};

export const updateSettingsDoc = async (currentSettings, newSettings) => {
  await setDoc(doc(firestore, 'config', 'settings'), {
    ...currentSettings,
    ...newSettings
  });
};

export const resetStorefrontDefaults = async () => {
  const batch = writeBatch(firestore);
  INITIAL_DATA.menuItems.forEach((item) => {
    batch.set(doc(firestore, 'menuItems', item.id), item);
  });
  batch.set(doc(firestore, 'config', 'settings'), INITIAL_DATA.settings);
  await batch.commit();
};
