import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useActor } from '@/hooks/useActor';
import { useCart } from '@/hooks/useCart';
import { type Watch } from '@/backend';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { imageToUrl } from '@/lib/imageUtils';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/products/$id' });
  const navigate = useNavigate();
  const { actor, isFetching: isActorFetching } = useActor();
  const { addToCart, isAdding } = useCart();
  const [watch, setWatch] = useState<Watch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchWatch = async () => {
      if (!actor || isActorFetching) return;

      setIsLoading(true);
      setError(null);

      try {
        const watchId = BigInt(id);
        const result = await actor.getWatch(watchId);
        
        if (result) {
          setWatch(result);
        } else {
          setError('Watch not found');
        }
      } catch (err) {
        console.error('Error fetching watch:', err);
        setError('Failed to load watch details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWatch();
  }, [actor, isActorFetching, id]);

  const handleAddToCart = async () => {
    if (!watch) return;
    
    setIsAddingToCart(true);
    try {
      await addToCart(watch.id, BigInt(1));
      toast.success(`${watch.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const nextImage = () => {
    if (watch && watch.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % watch.images.length);
    }
  };

  const prevImage = () => {
    if (watch && watch.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + watch.images.length) % watch.images.length);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-6">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !watch) {
    return (
      <div className="min-h-screen bg-luxury-black py-12">
        <div className="container mx-auto px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error || 'Watch not found'}</AlertDescription>
          </Alert>
          <Button
            onClick={() => navigate({ to: '/products' })}
            className="mt-4 bg-luxury-gold text-luxury-black hover:bg-luxury-gold/80"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const hasMultipleImages = watch.images && watch.images.length > 1;

  return (
    <div className="min-h-screen bg-luxury-black py-12">
      <div className="container mx-auto px-4">
        <Button
          onClick={() => navigate({ to: '/products' })}
          variant="outline"
          className="mb-6 border-luxury-gold/30 bg-luxury-charcoal text-luxury-white hover:bg-luxury-gold/10"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Image Carousel */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-lg bg-luxury-ivory">
              {watch.images && watch.images.length > 0 ? (
                <img
                  src={imageToUrl(watch.images[currentImageIndex])}
                  alt={`${watch.name} - Image ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-luxury-charcoal text-luxury-white/50">
                  No Image Available
                </div>
              )}
            </div>

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-luxury-black/80 p-2 text-luxury-gold transition-all hover:bg-luxury-gold hover:text-luxury-black"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-luxury-black/80 p-2 text-luxury-gold transition-all hover:bg-luxury-gold hover:text-luxury-black"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Dot Indicators */}
            {hasMultipleImages && (
              <div className="mt-4 flex justify-center gap-2">
                {watch.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'w-8 bg-luxury-gold'
                        : 'bg-luxury-gold/30 hover:bg-luxury-gold/50'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Thumbnail Gallery */}
            {hasMultipleImages && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {watch.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                      index === currentImageIndex
                        ? 'border-luxury-gold'
                        : 'border-luxury-gold/20 hover:border-luxury-gold/50'
                    }`}
                  >
                    <img
                      src={imageToUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="mb-2 font-serif text-4xl font-bold text-luxury-white">
                {watch.name}
              </h1>
              <p className="text-xl text-luxury-champagne">{watch.company}</p>
            </div>

            <div className="space-y-2 border-b border-luxury-gold/20 pb-6">
              <p className="text-luxury-white/80">
                <span className="font-semibold text-luxury-white">Model:</span> {watch.modelNumber}
              </p>
              <p className="text-luxury-white/80">
                <span className="font-semibold text-luxury-white">Gender:</span> {watch.gender}
              </p>
            </div>

            <div>
              <p className="font-serif text-5xl font-bold text-luxury-gold">
                ${Number(watch.price).toLocaleString()}
              </p>
            </div>

            <div className="space-y-2">
              <h2 className="font-serif text-2xl font-semibold text-luxury-white">Description</h2>
              <p className="leading-relaxed text-luxury-champagne">{watch.description}</p>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isAddingToCart}
              className="w-full bg-black py-6 font-serif text-lg font-semibold text-luxury-gold transition-all hover:bg-luxury-gold hover:text-black hover:shadow-luxury disabled:opacity-50"
            >
              {isAddingToCart ? (
                'Adding to Cart...'
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            {watch.isFeatured && (
              <div className="rounded-lg border border-luxury-gold/30 bg-luxury-gold/10 p-4">
                <p className="text-center font-serif text-luxury-gold">
                  ✨ Featured in our exclusive collection
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
