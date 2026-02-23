import { useState } from 'react';
import { type Watch } from '@/backend';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';
import { imageToUrl } from '@/lib/imageUtils';
import { Link } from '@tanstack/react-router';

interface ProductCardProps {
  watch: Watch;
}

export default function ProductCard({ watch }: ProductCardProps) {
  const { addToCart, isAdding } = useCart();
  const [isAddingThis, setIsAddingThis] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAddingThis(true);
    try {
      await addToCart(watch.id, BigInt(1));
      toast.success(`${watch.name} added to cart`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsAddingThis(false);
    }
  };

  const mainImage = watch.images && watch.images.length > 0 ? watch.images[0] : null;

  return (
    <Link
      to="/products/$id"
      params={{ id: watch.id.toString() }}
      className="group block overflow-hidden rounded-lg bg-luxury-black/50 transition-all hover:bg-luxury-black hover:shadow-luxury"
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
      <div className="p-4">
        <h3 className="mb-1 font-serif text-lg font-semibold text-luxury-white line-clamp-1">
          {watch.name}
        </h3>
        <p className="mb-1 text-sm text-luxury-champagne">{watch.company}</p>
        <p className="mb-1 text-xs text-luxury-white/60">Model: {watch.modelNumber}</p>
        <p className="mb-2 text-xs text-luxury-white/60">{watch.gender}</p>
        <p className="mb-4 font-serif text-xl font-bold text-luxury-gold">
          ${Number(watch.price).toLocaleString()}
        </p>
        <Button
          onClick={handleAddToCart}
          disabled={isAdding || isAddingThis}
          className="w-full bg-black font-serif font-semibold text-luxury-gold transition-all hover:bg-luxury-gold hover:text-black hover:shadow-luxury disabled:opacity-50"
        >
          {isAddingThis ? (
            'Adding...'
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </Link>
  );
}
