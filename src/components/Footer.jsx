import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, MapPin, Phone, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Footer() {
  const { db } = useApp();
  const phoneNumber = db.settings.whatsappNumber || '917597386371';
  const address =
    db.settings.address ||
    'Manoj Kulhari Thekedar Farmhouse, Gudha Gorji, Jhunjhunu, Rajasthan';

  return (
    <footer className="bg-stone-900 text-stone-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 text-white mb-3">
            <Flame className="w-6 h-6 text-orange-500" />
            <span className="text-xl font-extrabold">Wrap-stick</span>
          </div>
          <p className="text-sm text-stone-400 leading-relaxed">
            Hand-rolled gourmet wraps, flame-kissed skewers, sizzlers, and craft coolers in Gudha Gorji. Freshly grilled to order every single time.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/menu" className="hover:text-orange-400 transition">Explore Full Menu (40 Items)</Link></li>
            <li><Link to="/chefs" className="hover:text-orange-400 transition">Meet Our Chefs</Link></li>
            <li><Link to="/book" className="hover:text-orange-400 transition">Reserve a Table</Link></li>
            <li><Link to="/my-bookings" className="hover:text-orange-400 transition">My Bookings & Status</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Visit & Contact</h4>
          <ul className="space-y-2.5 text-sm text-stone-400">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-500 shrink-0" />
              <a href={`tel:+${phoneNumber}`} className="hover:text-orange-400 transition font-semibold text-stone-200">
                +91 7597386371
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500 shrink-0" />
              <span>{db.settings.openingHours}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        © {new Date().getFullYear()} Wrap-stick • Manoj Kulhari Thekedar Farmhouse, Gudha Gorji, Jhunjhunu, Rajasthan.
      </div>
    </footer>
  );
}
