import { useWatches } from '@/hooks/useWatches';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { imageToUrl } from '@/lib/imageUtils';
import { Link } from '@tanstack/react-router';

export default function FeaturedWatches() {
  const { featuredWatches, isLoading, error } = useWatches();

  if (isLoading) {
    return (
      <section className="bg-luxury-charcoal py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center font-serif text-4xl font-bold text-luxury-white">
            Featured Collection
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-luxury-charcoal py-20">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Failed to load featured watches. Please try again later.</AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (!featuredWatches || featuredWatches.length === 0) {
    return null;
  }

  return (
    <section className="bg-luxury-charcoal py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center font-serif text-4xl font-bold text-luxury-white">
          Featured Collection
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredWatches.map((watch) => {
            const mainImage = watch.images && watch.images.length > 0 ? watch.images[0] : null;
            return (
              <Link
                key={watch.id.toString()}
                to="/products/$id"
                params={{ id: watch.id.toString() }}
                className="group overflow-hidden rounded-lg bg-luxury-black/50 transition-all hover:bg-luxury-black hover:shadow-luxury"
              >
                <div className="aspect-square overflow-hidden bg-luxury-ivory">
                  {mainImage ? (
                    <img
                      src={imageToUrl(mainImage)}
                      alt={watch.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-luxury-charcoal text-luxury-white/50">
                      No Image
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 font-serif text-2xl font-semibold text-luxury-white">
                    {watch.name}
                  </h3>
                  <p className="mb-1 text-luxury-champagne">{watch.company}</p>
                  <p className="font-serif text-xl font-bold text-luxury-gold">
                    ${Number(watch.price).toLocaleString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
