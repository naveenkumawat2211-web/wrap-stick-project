import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function WhatsAppButton() {
  const { db } = useApp();

  if (!db.settings.whatsappOrdersEnabled) return null;

  const phoneNumber = db.settings.whatsappNumber || '917597386371';
  const message = encodeURIComponent(
    "Hi Wrap-stick (Gudha Gorji)! I'd like to reserve a table / place a wrap & skewer order."
  );
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 font-semibold text-sm"
      aria-label="Order or Book on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 fill-current" />
      <span className="hidden sm:inline">WhatsApp: 7597386371</span>
    </motion.a>
  );
}
