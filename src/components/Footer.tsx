
import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="mt-12 bg-gradient-to-r from-rose-900 via-rose-800 to-amber-700 text-rose-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.25em] text-rose-100">Shastik Fashions</p>
            <p className="text-xl font-semibold text-white">Drape luxury, crafted for every celebration.</p>
            <p className="text-sm text-rose-100/90 max-w-sm">
              Premium sarees in pastel weaves, artisanal zari, and timeless silhouettes for weddings, festivals, and joyous moments.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-amber-200 transition-colors">All Sarees</Link></li>
              <li><Link href="/new-arrivals" className="hover:text-amber-200 transition-colors">New Arrivals</Link></li>
              <li><Link href="/best-seller" className="hover:text-amber-200 transition-colors">Best Sellers</Link></li>
              <li><Link href="/categories" className="hover:text-amber-200 transition-colors">Shop by Category</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-white">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/contact" className="hover:text-amber-200 transition-colors">Contact</Link></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-amber-200 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-white">Stay in touch</h3>
            <div className="flex items-center gap-2 text-sm text-rose-100">
              <Mail size={16} />
              <span>hello@shastikfashions.com</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-rose-100">
              <Phone size={16} />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-rose-100">
              <MapPin size={16} />
              <span>Chennai & Mumbai, India</span>
            </div>

            <div className="pt-3">
              <div className="flex items-center gap-3">
                <a href="#" aria-label="Facebook" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="Twitter" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" aria-label="Instagram" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="LinkedIn" className="h-9 w-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <Linkedin size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-rose-100">
          <p>© {new Date().getFullYear()} Shastik Fashions. Crafted for celebrations.</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse"></span>
            <span>Festive-ready dispatch across India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
