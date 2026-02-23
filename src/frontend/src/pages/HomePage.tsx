import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import FeaturedWatches from '@/components/FeaturedWatches';
import InstagramSection from '@/components/InstagramSection';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/generated/hero-background.dim_1920x1080.png)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/40 to-luxury-black" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-6 font-serif text-5xl font-bold text-luxury-white md:text-7xl lg:text-8xl">
            Luxury In Times
          </h1>
          <p className="mb-8 font-serif text-xl text-luxury-champagne md:text-2xl lg:text-3xl">
            Timeless Elegance. Defined.
          </p>
          <Button
            onClick={() => navigate({ to: '/products' })}
            size="lg"
            className="group relative overflow-hidden bg-black px-8 py-6 font-serif text-lg font-semibold text-luxury-gold transition-all hover:bg-luxury-gold hover:text-black hover:shadow-luxury"
          >
            <span className="relative z-10">Shop Now</span>
          </Button>
        </div>
      </section>

      {/* Featured Watches */}
      <FeaturedWatches />

      {/* Instagram Section */}
      <InstagramSection />
    </div>
  );
}
