import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminSettings() {
  const { db, updateSettings, resetDemoData } = useApp();
  const [form, setForm] = useState(db.settings);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(form);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const Toggle = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-stone-100">
      <span className="text-sm font-semibold text-stone-800">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${
          checked ? 'bg-orange-600' : 'bg-stone-300'
        }`}
      >
        <motion.div
          layout
          className={`w-4 h-4 rounded-full bg-white shadow ${checked ? 'ml-6' : 'ml-0'}`}
        />
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-stone-900">Restaurant Settings</h1>
        <p className="text-sm text-stone-500">Configure Wrap-stick location, phone, and ordering channels.</p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-sm space-y-5">
        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Restaurant Address</label>
          <input
            value={form.address || ''}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">WhatsApp / Contact Number</label>
          <input
            value={form.whatsappNumber}
            onChange={(e) => setForm({ ...form, whatsappNumber: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-600 mb-1">Operating Hours</label>
          <input
            value={form.openingHours}
            onChange={(e) => setForm({ ...form, openingHours: e.target.value })}
            className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
          />
        </div>

        <div className="pt-2">
          <Toggle
            label="Enable Online Table & Pre-Order Bookings"
            checked={form.onlineBookingEnabled}
            onChange={(val) => setForm({ ...form, onlineBookingEnabled: val })}
          />
          <Toggle
            label="Enable Floating WhatsApp Quick Order"
            checked={form.whatsappOrdersEnabled}
            onChange={(val) => setForm({ ...form, whatsappOrdersEnabled: val })}
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Data
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold"
          >
            <Save className="w-4 h-4" />
            <span>{savedToast ? 'Saved!' : 'Save Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
