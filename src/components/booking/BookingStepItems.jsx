import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Utensils, ChefHat, Plus, Minus, ShoppingBag } from 'lucide-react';
import { BOOKING_TYPES } from '../../constants/orderConfig';

export default function BookingStepItems({
  form,
  setForm,
  cart,
  hasCartItems,
  cartTotal,
  updateCartQty,
  menuItems,
  chefs,
  onNext
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
      <div>
        <label className="block text-xs font-bold uppercase text-stone-500 mb-2">
          Booking Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {BOOKING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setForm({ ...form, bookingType: type })}
              className={`p-3.5 rounded-xl border text-sm font-semibold text-left transition ${
                form.bookingType === type
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {hasCartItems ? (
        <div className="rounded-xl border border-orange-200 bg-orange-50/40 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase text-orange-700">
              <ShoppingBag className="w-4 h-4" /> Your Multi-Item Order ({cart.length})
            </span>
            <Link to="/menu" className="text-xs font-bold text-orange-600 hover:underline">
              + Add More Items
            </Link>
          </div>

          <div className="divide-y divide-orange-100">
            {cart.map((item) => (
              <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-stone-900">{item.name}</p>
                  <p className="text-xs text-stone-500">₹{item.price} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-2.5 py-1">
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, -1)}
                      className="text-stone-600 hover:text-orange-600"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-extrabold text-stone-900 min-w-[16px] text-center">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQty(item.id, 1)}
                      className="text-stone-600 hover:text-orange-600"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-extrabold text-stone-900 min-w-[54px] text-right">
                    ₹{item.price * item.qty}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-orange-200 flex items-center justify-between text-sm">
            <span className="font-bold text-stone-700">Cart Subtotal</span>
            <span className="text-base font-extrabold text-orange-600">₹{cartTotal}</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-bold uppercase text-stone-500">
              <Utensils className="w-3.5 h-3.5 inline mr-1" /> Select Dish ({menuItems.length} Available)
            </label>
            <Link to="/menu" className="text-xs font-bold text-orange-600 hover:underline">
              Build Multi-Item Cart →
            </Link>
          </div>
          <select
            value={form.dishId}
            onChange={(e) => setForm({ ...form, dishId: e.target.value })}
            className="w-full p-3 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:border-orange-500"
          >
            {menuItems.map((item) => (
              <option key={item.id} value={item.id}>
                [{item.category}] {item.name} — ₹{item.price}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold uppercase text-stone-500 mb-2">
          <ChefHat className="w-3.5 h-3.5 inline mr-1" /> Preferred Chef
        </label>
        <select
          value={form.chefId}
          onChange={(e) => setForm({ ...form, chefId: e.target.value })}
          className="w-full p-3 rounded-xl border border-stone-200 text-sm font-medium focus:outline-none focus:border-orange-500"
        >
          {chefs.map((chef) => (
            <option key={chef.id} value={chef.id}>
              {chef.name} ({chef.specialty})
            </option>
          ))}
        </select>
      </div>

      <div className="pt-3 flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold transition"
        >
          Continue to Schedule
        </button>
      </div>
    </motion.div>
  );
}
