import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminMenu() {
  const { db, addMenuItem, updateMenuItem, deleteMenuItem } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Signature Wraps',
    veg: true,
    price: 229,
    prepTime: '15 mins',
    description: '',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    popular: true
  });

  const openAdd = () => {
    setEditingItem(null);
    setForm({
      name: '',
      category: 'Signature Wraps',
      veg: true,
      price: 229,
      prepTime: '15 mins',
      description: '',
      image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
      popular: true
    });
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(item);
    setModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMenuItem(form);
    } else {
      addMenuItem(form);
    }
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-900">
            Menu Management ({db.menuItems.length} Items)
          </h1>
          <p className="text-sm text-stone-500">Add, edit, or remove wraps, skewers, platters, sides & drinks.</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-sm font-bold"
        >
          <Plus className="w-4 h-4" /> Add Dish
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 border-b border-stone-200 text-xs uppercase text-stone-500">
              <tr>
                <th className="p-4">Dish</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {db.menuItems.map((item) => (
                <motion.tr layout key={item.id} className="hover:bg-stone-50/60">
                  <td className="p-4 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-11 h-11 rounded-lg object-cover" />
                    <div>
                      <p className="font-bold text-stone-900">{item.name}</p>
                      <p className="text-xs text-stone-400 line-clamp-1">{item.description}</p>
                    </div>
                  </td>
                  <td className="p-4 text-stone-600">{item.category}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.veg ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      {item.veg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="p-4 font-extrabold text-orange-600">₹{item.price}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-2 rounded-lg text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-stone-950/50 backdrop-blur-sm flex justify-end">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 260 }}
              className="bg-white w-full max-w-md h-full p-6 overflow-y-auto shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-5">
                <h2 className="text-lg font-extrabold text-stone-900">
                  {editingItem ? 'Edit Menu Dish' : 'Add New Dish'}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1 text-stone-400 hover:text-stone-900">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Dish Name</label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                    >
                      <option>Signature Wraps</option>
                      <option>Flame Skewers</option>
                      <option>Grill Platters</option>
                      <option>Loaded Sides</option>
                      <option>Craft Drinks</option>
                      <option>Desserts</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Dietary Type</label>
                    <select
                      value={form.veg ? 'veg' : 'nonveg'}
                      onChange={(e) => setForm({ ...form, veg: e.target.value === 'veg' })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                    >
                      <option value="veg">Veg</option>
                      <option value="nonveg">Non-Veg</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-600 mb-1">Prep Time</label>
                    <input
                      value={form.prepTime}
                      onChange={(e) => setForm({ ...form, prepTime: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Image URL</label>
                  <input
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 mb-1">Description</label>
                  <textarea
                    rows="3"
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-200 text-sm"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-semibold text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.popular}
                    onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  />
                  Feature on Home Page Bestsellers
                </label>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm"
                >
                  {editingItem ? 'Update Dish' : 'Save Dish'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
