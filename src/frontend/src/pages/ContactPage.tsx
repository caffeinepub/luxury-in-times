import { Phone, Mail } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-luxury-charcoal py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 font-serif text-5xl font-bold text-luxury-white md:text-6xl">
              Contact Us
            </h1>
            <p className="text-lg text-luxury-champagne">
              Get in touch with Luxury In Times
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-8 rounded-lg bg-luxury-black/50 p-8 md:p-12">
            <div className="space-y-6">
              <h2 className="font-serif text-2xl font-semibold text-luxury-gold">
                Get In Touch
              </h2>
              <p className="text-luxury-white/80">
                We're here to help you find the perfect timepiece. Reach out to us through any of the following channels:
              </p>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 rounded-lg bg-luxury-black/30 p-6 transition-all hover:bg-luxury-black/50">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-luxury-gold/10">
                <Phone className="h-6 w-6 text-luxury-gold" />
              </div>
              <div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-luxury-white">
                  Phone
                </h3>
                <a
                  href="tel:+917572939000"
                  className="text-xl text-luxury-gold transition-colors hover:text-luxury-champagne"
                >
                  +91 7572939000
                </a>
                <p className="mt-2 text-sm text-luxury-white/60">
                  Call us for inquiries about our collection
                </p>
              </div>
            </div>

            {/* Instagram */}
            <div className="flex items-start gap-4 rounded-lg bg-luxury-black/30 p-6 transition-all hover:bg-luxury-black/50">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-luxury-gold/10">
                <SiInstagram className="h-6 w-6 text-luxury-gold" />
              </div>
              <div>
                <h3 className="mb-2 font-serif text-lg font-semibold text-luxury-white">
                  Instagram
                </h3>
                <a
                  href="https://instagram.com/luxury_in_times_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl text-luxury-gold transition-colors hover:text-luxury-champagne"
                >
                  @luxury_in_times_
                </a>
                <p className="mt-2 text-sm text-luxury-white/60">
                  Follow us for the latest collections and updates
                </p>
              </div>
            </div>

            {/* Business Hours */}
            <div className="mt-8 border-t border-luxury-gold/20 pt-8">
              <h3 className="mb-4 font-serif text-lg font-semibold text-luxury-gold">
                Business Hours
              </h3>
              <p className="text-luxury-white/80">
                We're available to assist you with your luxury timepiece needs. Contact us during business hours for the best service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
