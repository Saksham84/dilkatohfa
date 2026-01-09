"use client";

import Link from "next/link";
import {
  Heart,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50 border-t border-pink-100">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                Dilkatohfa
              </span>
            </div>

            <p className="text-gray-600 mb-4">
              Turn moments into memories with the perfect gift for every
              occasion.
            </p>

            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-white rounded-full hover:bg-pink-100 transition-colors"
              >
                <Facebook className="w-5 h-5 text-pink-600" />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-full hover:bg-pink-100 transition-colors"
              >
                <Instagram className="w-5 h-5 text-pink-600" />
              </a>
              <a
                href="#"
                className="p-2 bg-white rounded-full hover:bg-pink-100 transition-colors"
              >
                <Twitter className="w-5 h-5 text-pink-600" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products/birthday"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Birthday Gifts
                </Link>
              </li>
              <li>
                <Link
                  href="/products/anniversary"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Anniversary Gifts
                </Link>
              </li>
              <li>
                <Link
                  href="/products/customized"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Customized Gifts
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Track Order
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Shipping Info
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  Returns & Refunds
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600">
                <Phone className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <Mail className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>support@Dilkatohfa.com</span>
              </li>
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
                <span>Mumbai, Maharashtra, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-pink-200 pt-8 text-center text-gray-600">
          <p>
            &copy; 2026 Dilkatohfa. All rights reserved. Made with love for special
            moments.
          </p>
        </div>
      </div>
    </footer>
  );
}
