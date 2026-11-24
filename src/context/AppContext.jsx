import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_DATA } from '../data/initialData';
import { STORAGE_KEYS, normalizePhone } from '../constants/orderConfig';
import {
  subscribeMenuItems,
  subscribeBookings,
  subscribePayments,
  subscribeSettings,
  createMenuItemDoc,
  updateMenuItemDoc,
  deleteMenuItemDoc,
  createBookingAndPayment,
  updateBookingStatusDoc,
  cancelBookingByCustomerDoc,
  deleteBookingCascadeDoc,
  updateSettingsDoc,
  resetStorefrontDefaults
} from '../services/firestoreService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState(INITIAL_DATA.menuItems);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [settings, setSettings] = useState(INITIAL_DATA.settings);
  const [chefs] = useState(INITIAL_DATA.chefs);
  const [admin] = useState(INITIAL_DATA.admin);
  const [cloudConnected, setCloudConnected] = useState(false);

  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [myBookingIds, setMyBookingIds] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_BOOKING_IDS);
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const [userPhone, setUserPhone] = useState(() =>
    normalizePhone(localStorage.getItem(STORAGE_KEYS.USER_PHONE) || '')
  );

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true'
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_BOOKING_IDS, JSON.stringify(myBookingIds));
    } catch (e) {
      console.error('Failed to save user booking IDs:', e);
    }
  }, [myBookingIds]);

  const addToCart = useCallback((item) => {
    if (!item?.id) return;
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: Number(item.price),
          category: item.category || 'Wrap',
          image: item.image || '',
          qty: 1
        }
      ];
    });
  }, []);

  const updateCartQty = useCallback((id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.removeItem(STORAGE_KEYS.CART);
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  // Real-Time Firestore Subscriptions
  useEffect(() => {
    const unsubMenu = subscribeMenuItems(
      (liveMenu) => {
        setCloudConnected(true);
        setMenuItems(liveMenu);
      },
      (err) => {
        console.error('Firestore menu sync error:', err);
        setCloudConnected(false);
      }
    );

    const unsubBookings = subscribeBookings(setBookings, (err) =>
      console.error('Firestore bookings sync error:', err)
    );

    const unsubPayments = subscribePayments(setPayments, (err) =>
      console.error('Firestore payments sync error:', err)
    );

    const unsubSettings = subscribeSettings(setSettings, (err) =>
      console.error('Firestore settings sync error:', err)
    );

    return () => {
      unsubMenu();
      unsubBookings();
      unsubPayments();
      unsubSettings();
    };
  }, []);

  const saveUserPhone = useCallback((phone) => {
    const cleanPhone = normalizePhone(phone);
    setUserPhone(cleanPhone);
    if (cleanPhone.length === 10) {
      localStorage.setItem(STORAGE_KEYS.USER_PHONE, cleanPhone);
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    }
  }, []);

  // Admin Session
  const loginAdmin = useCallback(
    (email, password) => {
      if (email === admin.email && password === admin.password) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
        return true;
      }
      return false;
    },
    [admin.email, admin.password]
  );

  const logoutAdmin = useCallback(() => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  }, []);

  // Menu CRUD
  const addMenuItem = useCallback(async (item) => {
    try {
      await createMenuItemDoc(item);
    } catch (err) {
      console.error('Error adding menu item:', err);
      alert('Menu item add nahi ho saka: ' + err.message);
    }
  }, []);

  const updateMenuItem = useCallback(async (updatedItem) => {
    try {
      await updateMenuItemDoc(updatedItem);
    } catch (err) {
      console.error('Error updating menu item:', err);
      alert('Menu item update nahi ho saka: ' + err.message);
    }
  }, []);

  const deleteMenuItem = useCallback(async (id) => {
    try {
      await deleteMenuItemDoc(id);
    } catch (err) {
      console.error('Error deleting menu item:', err);
      alert('Menu item delete nahi ho saka: ' + err.message);
    }
  }, []);

  // Bookings & Payments
  const createBooking = useCallback(
    async (bookingData, paymentInfo) => {
      try {
        const created = await createBookingAndPayment(bookingData, paymentInfo);
        setMyBookingIds((prev) => [created.id, ...prev]);
        if (created.phone?.length === 10) {
          saveUserPhone(created.phone);
        }
        return created;
      } catch (err) {
        console.error('Error creating booking in Firestore:', err);
        alert('Booking cloud mein save nahi ho saki: ' + err.message);
        return null;
      }
    },
    [saveUserPhone]
  );

  const updateBookingStatus = useCallback(async (id, status) => {
    try {
      await updateBookingStatusDoc(id, status);
    } catch (err) {
      console.error('Error updating booking status:', err);
      alert('Status update nahi ho saka: ' + err.message);
    }
  }, []);

  const removeBookingByUser = useCallback(
    async (id) => {
      try {
        const target = bookings.find((b) => b.id === id) || { id };
        await cancelBookingByCustomerDoc(target);
        setMyBookingIds((prev) => prev.filter((bId) => bId !== id));
      } catch (err) {
        console.error('Error removing booking by user:', err);
        alert(err.message || 'Order remove karne mein error aaya.');
      }
    },
    [bookings]
  );

  const deleteBooking = useCallback(
    async (id) => {
      try {
        await deleteBookingCascadeDoc(id, payments);
        setMyBookingIds((prev) => prev.filter((bId) => bId !== id));
      } catch (err) {
        console.error('Error deleting booking:', err);
        alert('Booking delete nahi ho saki: ' + err.message);
      }
    },
    [payments]
  );

  const updateSettings = useCallback(
    async (newSettings) => {
      try {
        await updateSettingsDoc(settings, newSettings);
      } catch (err) {
        console.error('Error updating settings:', err);
        alert('Settings save nahi ho saki: ' + err.message);
      }
    },
    [settings]
  );

  const resetDemoData = useCallback(async () => {
    try {
      await resetStorefrontDefaults();
      setMyBookingIds([]);
      setUserPhone('');
      clearCart();
      localStorage.removeItem(STORAGE_KEYS.USER_BOOKING_IDS);
      localStorage.removeItem(STORAGE_KEYS.USER_PHONE);
    } catch (err) {
      console.error('Error resetting demo data:', err);
      alert('Reset karne mein error aaya: ' + err.message);
    }
  }, [clearCart]);

  const db = useMemo(
    () => ({
      menuItems,
      chefs,
      bookings,
      payments,
      settings,
      admin
    }),
    [menuItems, chefs, bookings, payments, settings, admin]
  );

  return (
    <AppContext.Provider
      value={{
        db,
        cloudConnected,
        cart,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartTotal,
        myBookingIds,
        userPhone,
        saveUserPhone,
        isAdminAuthenticated,
        loginAdmin,
        logoutAdmin,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        createBooking,
        updateBookingStatus,
        removeBookingByUser,
        deleteBooking,
        updateSettings,
        resetDemoData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
