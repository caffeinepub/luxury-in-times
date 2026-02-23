import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Header() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-luxury-gold/20 bg-luxury-black/95 backdrop-blur supports-[backdrop-filter]:bg-luxury-black/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center transition-opacity hover:opacity-80">
          <img
            src="/assets/generated/logo.dim_200x80.png"
            alt="Luxury In Times"
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-serif text-sm font-medium text-luxury-white transition-colors hover:text-luxury-gold"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="font-serif text-sm font-medium text-luxury-white transition-colors hover:text-luxury-gold"
          >
            Products
          </Link>
          <Link
            to="/contact"
            className="font-serif text-sm font-medium text-luxury-white transition-colors hover:text-luxury-gold"
          >
            Contact
          </Link>
          <button
            onClick={() => navigate({ to: '/cart' })}
            className="relative flex items-center gap-2 font-serif text-sm font-medium text-luxury-white transition-colors hover:text-luxury-gold"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-luxury-gold text-xs font-bold text-luxury-black">
                {cartCount}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-luxury-white">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-luxury-black border-luxury-gold/20">
            <nav className="flex flex-col gap-6 mt-8">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-lg font-medium text-luxury-white transition-colors hover:text-luxury-gold"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-lg font-medium text-luxury-white transition-colors hover:text-luxury-gold"
              >
                Products
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="font-serif text-lg font-medium text-luxury-white transition-colors hover:text-luxury-gold"
              >
                Contact
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate({ to: '/cart' });
                }}
                className="flex items-center gap-2 font-serif text-lg font-medium text-luxury-white transition-colors hover:text-luxury-gold"
              >
                <ShoppingCart className="h-5 w-5" />
                Cart {cartCount > 0 && `(${cartCount})`}
              </button>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
