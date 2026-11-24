import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Award, Star, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ChefsPage() {
  const { db } = useApp();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
          Culinary Craftsmanship
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 mt-1">
          Meet Our Master Chefs
        </h1>
        <p className="text-stone-500 text-sm mt-2">
          Every wrap is hand-rolled and every skewer is flame-seared by our specialist culinary team at Gudha Gorji.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {db.chefs.map((chef, idx) => (
          <motion.div
            key={chef.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.12 }}
            whileHover={{ y: -6 }}
            className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="h-64 overflow-hidden relative">
              <img src={chef.image} alt={chef.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-stone-900/80 text-white text-xs font-semibold flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-orange-400" />
                <span>{chef.experience} Exp</span>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-extrabold text-stone-900">{chef.name}</h3>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-current" /> {chef.rating}
                </span>
              </div>
              <p className="text-xs font-semibold text-orange-600 mb-3">{chef.role}</p>
              <p className="text-sm text-stone-500 leading-relaxed mb-4">{chef.bio}</p>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-700 mb-4 flex items-center gap-2">
                <ChefHat className="w-4 h-4 text-orange-600 shrink-0" />
                <span>
                  <strong>Specialty:</strong> {chef.specialty}
                </span>
              </div>

              <Link
                to={`/book?chef=${chef.id}`}
                className="block w-full text-center py-2.5 rounded-xl bg-stone-900 hover:bg-orange-600 text-white text-xs font-bold transition"
              >
                Request Chef Table / Order
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
