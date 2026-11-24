import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame, ArrowRight, Star, Clock, UtensilsCrossed, MessageCircle, MapPin, Phone } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HomePage() {
  const { db } = useApp();
  const featuredItems = db.menuItems.filter((item) => item.popular).slice(0, 6);
  const phoneNumber = db.settings.whatsappNumber || '917597386371';
  const address =
    db.settings.address ||
    'Manoj Kulhari Thekedar Farmhouse, Gudha Gorji, Jhunjhunu, Rajasthan';

  const whatsappQuickUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    'Hi Wrap-stick (Gudha Gorji)! I want to book a table or order from your menu.'
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <section className="relative overflow-hidden bg-stone-900 text-white py-20 lg:py-28">
        <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-900/90 to-stone-900/60" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold">
              <Flame className="w-4 h-4 text-orange-400" />
              <span>Gudha Gorji’s Premier Farmhouse Grill & Wrap Lounge</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Bold Flavors, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Wrapped & Skewered
              </span>{' '}
              to Perfection.
            </h1>

            <p className="text-stone-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Experience 40+ handcrafted gourmet wraps, live open-fire skewers, sizzling platters, and refreshing coolers at <strong>Manoj Kulhari Thekedar Farmhouse, Gudha Gorji</strong>.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/book"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition"
              >
                <span>Reserve Table / Pre-Order</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold text-sm border border-white/15 transition"
              >
                <UtensilsCrossed className="w-4 h-4" />
                <span>Explore 40+ Menu Items</span>
              </Link>
              <a
                href={whatsappQuickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-semibold text-sm transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Instant Book</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=80"
                alt="Wrap-stick Signature Platter"
                className="w-full h-[430px] object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-stone-950/85 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-400 font-semibold">Farmhouse Bestseller</p>
                  <p className="font-bold text-white">Peri-Peri Flame Chicken Wrap</p>
                </div>
                <span className="px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-sm">
                  ₹249
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Crowd Favorites ({db.menuItems.length} Dishes Available)
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1">
              Signature Wraps, Skewers & Platters
            </h2>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-600 hover:text-orange-700"
          >
            <span>View Full 40-Item Menu</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {featuredItems.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-stone-900/80 text-white text-xs font-semibold">
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="font-bold text-lg text-stone-900">{item.name}</h3>
                    <span className="font-extrabold text-orange-600 text-lg">₹{item.price}</span>
                  </div>
                  <p className="text-sm text-stone-500 line-clamp-2 mb-4">{item.description}</p>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {item.prepTime}
                    </span>
                  </div>
                  <Link
                    to={`/book?dish=${item.id}`}
                    className="px-3.5 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-600 text-orange-600 hover:text-white text-xs font-bold transition"
                  >
                    Order / Book
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Location & Contact Highlight Banner */}
        <div className="mt-16 bg-stone-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Visit Our Farmhouse Dining Lounge
            </span>
            <h3 className="text-2xl font-extrabold flex items-start gap-2">
              <MapPin className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
              <span>{address}</span>
            </h3>
            <p className="text-sm text-stone-400 flex items-center gap-2 pt-1">
              <Phone className="w-4 h-4 text-orange-400" />
              <span>Direct Table & Takeaway Desk: +91 7597386371 • Open {db.settings.openingHours}</span>
            </p>
          </div>
          <Link
            to="/book"
            className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shrink-0 transition"
          >
            Book Your Table Now
          </Link>
        </div>
      </section>
    </motion.div>
  );
}
