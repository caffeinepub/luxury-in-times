import { SiInstagram } from 'react-icons/si';
import { Heart, Phone } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'luxury-in-times';

  return (
    <footer className="border-t border-luxury-gold/20 bg-luxury-black text-luxury-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">About</h3>
            <p className="text-sm leading-relaxed text-luxury-white/80">
              Luxury In Times offers the finest collection of luxury timepieces from the world's most prestigious brands. Timeless elegance, defined.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">Contact</h3>
            <div className="space-y-3">
              <a
                href="tel:+917572939000"
                className="flex items-center gap-2 text-sm text-luxury-white/80 transition-colors hover:text-luxury-gold"
              >
                <Phone className="h-4 w-4" />
                +91 7572939000
              </a>
              <p className="text-sm leading-relaxed text-luxury-white/80">
                For inquiries about our collection or services, please reach out.
              </p>
            </div>
          </div>

          {/* Instagram */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">Follow Us</h3>
            <a
              href="https://instagram.com/luxury_in_times_"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-luxury-white/80 transition-colors hover:text-luxury-gold"
            >
              <SiInstagram className="h-5 w-5" />
              @luxury_in_times_
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-luxury-white/80">
              <li>
                <a href="/" className="transition-colors hover:text-luxury-gold">
                  Home
                </a>
              </li>
              <li>
                <a href="/products" className="transition-colors hover:text-luxury-gold">
                  Products
                </a>
              </li>
              <li>
                <a href="/cart" className="transition-colors hover:text-luxury-gold">
                  Cart
                </a>
              </li>
              <li>
                <a href="/contact" className="transition-colors hover:text-luxury-gold">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-luxury-gold/20 pt-8 text-center">
          <p className="text-sm text-luxury-white/60">
            © {currentYear} Luxury In Times. All rights reserved.
          </p>
          <p className="mt-2 flex items-center justify-center gap-1 text-sm text-luxury-white/60">
            Built with <Heart className="h-4 w-4 fill-luxury-gold text-luxury-gold" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-luxury-gold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
