import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Search, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function MenuPage() {
  const { db, cart, addToCart, updateCartQty, cartCount, cartTotal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dietFilter, setDietFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...new Set(db.menuItems.map((item) => item.category))];

  const filteredItems = db.menuItems.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesDiet =
      dietFilter === 'All' ||
      (dietFilter === 'Veg' && item.veg === true) ||
      (dietFilter === 'Non-Veg' && item.veg === false);
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesDiet && matchesSearch;
  });

  const getItemQty = (id) => {
    const found = cart.find((c) => c.id === id);
    return found ? found.qty : 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-28"
    >
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Wrap-stick Kitchen • {db.menuItems.length} Signature Dishes
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
          Our Complete Gourmet Menu
        </h1>
        <p className="text-stone-500 text-sm mt-2">
          Add multiple wraps, skewers, sides & drinks to your cart or book instantly.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                selectedCategory === cat
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 w-full lg:w-auto">
          <div className="flex rounded-xl border border-stone-200 bg-white p-1">
            {['All', 'Veg', 'Non-Veg'].map((diet) => (
              <button
                key={diet}
                onClick={() => setDietFilter(diet)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  dietFilter === diet
                    ? diet === 'Veg'
                      ? 'bg-emerald-600 text-white'
                      : diet === 'Non-Veg'
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-900 text-white'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {diet}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 40+ dishes..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 bg-white text-sm focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      <p className="text-xs font-semibold text-stone-400 mb-4">
        Showing {filteredItems.length} of {db.menuItems.length} items
      </p>

      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredItems.map((item) => {
            const qty = getItemQty(item.id);
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-950/75 text-white text-[11px] font-semibold">
                    {item.category}
                  </span>
                  <span
                    className={`absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase ${
                      item.veg ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}
                  >
                    {item.veg ? 'Veg' : 'Non-Veg'}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-stone-900">{item.name}</h3>
                      <span className="font-extrabold text-orange-600 shrink-0">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-stone-500 leading-relaxed mb-4">{item.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      <span className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {item.prepTime}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {qty > 0 ? (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, -1)}
                            className="p-0.5 text-orange-700 hover:text-orange-900"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-extrabold text-stone-900 min-w-[16px] text-center">
                            {qty}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateCartQty(item.id, 1)}
                            className="p-0.5 text-orange-700 hover:text-orange-900"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-orange-200 bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      )}

                      <Link
                        to={`/book?dish=${item.id}`}
                        className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition"
                      >
                        Order
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {cartCount > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl">
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-orange-600 px-5 py-3.5 text-white shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-orange-100">
                  {cartCount} {cartCount === 1 ? 'Item' : 'Items'} in Cart
                </p>
                <p className="text-base font-extrabold">Total: ₹{cartTotal}</p>
              </div>
            </div>

            <Link
              to="/book"
              className="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-stone-800 transition"
            >
              <span>Checkout Now</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
