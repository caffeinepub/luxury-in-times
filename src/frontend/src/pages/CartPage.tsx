import { useCart } from '@/hooks/useCart';
import { useWatches } from '@/hooks/useWatches';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { imageToUrl } from '@/lib/imageUtils';

export default function CartPage() {
  const navigate = useNavigate();
  const { cart, cartTotal, isLoading, removeFromCart, updateQuantity } = useCart();
  const { allWatches } = useWatches();

  const cartItems = cart?.map((item) => {
    const watch = allWatches?.find((w) => w.id === item.watchId);
    return { ...item, watch };
  }).filter((item) => item.watch);

  const handleRemove = async (watchId: bigint) => {
    try {
      await removeFromCart(watchId);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateQuantity = async (watchId: bigint, newQuantity: bigint) => {
    if (newQuantity < BigInt(1)) return;
    try {
      await updateQuantity(watchId, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-luxury-charcoal py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 font-serif text-4xl font-bold text-luxury-white">Shopping Cart</h1>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-luxury-charcoal py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 font-serif text-4xl font-bold text-luxury-white">Shopping Cart</h1>
          <div className="rounded-lg bg-luxury-black/50 p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-luxury-gold" />
            <p className="mb-6 font-serif text-xl text-luxury-white">Your cart is empty</p>
            <Button
              onClick={() => navigate({ to: '/products' })}
              className="bg-luxury-gold font-serif font-semibold text-luxury-black hover:bg-luxury-champagne"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-charcoal py-12">
      <div className="container mx-auto px-4">
        <h1 className="mb-8 font-serif text-4xl font-bold text-luxury-white">Shopping Cart</h1>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const mainImage = item.watch!.images && item.watch!.images.length > 0 ? item.watch!.images[0] : null;
                return (
                  <div
                    key={item.watchId.toString()}
                    className="flex gap-4 rounded-lg bg-luxury-black/50 p-4"
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-luxury-ivory">
                      {mainImage ? (
                        <img
                          src={imageToUrl(mainImage)}
                          alt={item.watch!.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-luxury-charcoal text-xs text-luxury-white/50">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-luxury-white">
                          {item.watch!.name}
                        </h3>
                        <p className="text-sm text-luxury-champagne">{item.watch!.company}</p>
                        <p className="text-sm text-luxury-white/60">Model: {item.watch!.modelNumber}</p>
                      </div>
                      <p className="font-serif text-lg font-bold text-luxury-gold">
                        ${Number(item.watch!.price).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.watchId)}
                        className="text-luxury-white/60 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.watchId, item.quantity - BigInt(1))}
                          disabled={item.quantity <= BigInt(1)}
                          className="h-8 w-8 border-luxury-gold/30 bg-luxury-black text-luxury-white hover:bg-luxury-gold hover:text-luxury-black"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-serif text-luxury-white">
                          {item.quantity.toString()}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleUpdateQuantity(item.watchId, item.quantity + BigInt(1))}
                          className="h-8 w-8 border-luxury-gold/30 bg-luxury-black text-luxury-white hover:bg-luxury-gold hover:text-luxury-black"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-lg bg-luxury-black/50 p-6">
              <h2 className="mb-6 font-serif text-2xl font-bold text-luxury-white">Order Summary</h2>
              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-luxury-white">
                  <span>Subtotal</span>
                  <span>${Number(cartTotal).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-luxury-white/60">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              <div className="mb-6 border-t border-luxury-gold/20 pt-4">
                <div className="flex justify-between font-serif text-xl font-bold text-luxury-gold">
                  <span>Total</span>
                  <span>${Number(cartTotal).toLocaleString()}</span>
                </div>
              </div>
              <Button
                onClick={() => toast.info('Checkout functionality coming soon')}
                className="w-full bg-luxury-gold py-6 font-serif text-lg font-semibold text-luxury-black hover:bg-luxury-champagne hover:shadow-luxury"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
