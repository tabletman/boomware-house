'use client';

/**
 * Shopping Cart Drawer
 * Slides in from the right with cart contents
 */

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatPrice } from '@/lib/shopify/client';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, updateQuantity, removeItem, itemCount, subtotal } = useCart();

  if (!isOpen) return null;

  const cartLines = cart?.lines.edges || [];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background shadow-2xl z-50 flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <span className="text-sm text-muted-foreground">({itemCount} items)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cartLines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg font-semibold mb-2">Your cart is empty</p>
              <p className="text-muted-foreground mb-6">
                Add some products to get started!
              </p>
              <Button onClick={onClose} asChild>
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartLines.map(({ node: line }) => {
                const product = line.merchandise.product;
                const image = product.images.edges[0]?.node;

                return (
                  <div
                    key={line.id}
                    className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    {/* Image */}
                    <div className="w-20 h-20 bg-muted rounded-md flex-shrink-0">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.url}
                          alt={image.altText || product.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${product.handle}`}
                        className="font-semibold hover:text-primary line-clamp-2"
                        onClick={onClose}
                      >
                        {product.title}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {line.merchandise.title !== 'Default Title' && line.merchandise.title}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border rounded-md">
                          <button
                            onClick={() => {
                              if (line.quantity > 1) {
                                updateQuantity(line.id, line.quantity - 1);
                              }
                            }}
                            className="p-1.5 hover:bg-muted transition-colors"
                            disabled={line.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 font-semibold">{line.quantity}</span>
                          <button
                            onClick={() => updateQuantity(line.id, line.quantity + 1)}
                            className="p-1.5 hover:bg-muted transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(line.id)}
                          className="p-1.5 hover:bg-destructive/10 text-destructive rounded-md transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-bold">
                        {formatPrice(
                          parseFloat(line.merchandise.price.amount) * line.quantity
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(line.merchandise.price.amount)} each
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartLines.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between text-lg">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-bold text-2xl">{formatPrice(subtotal)}</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>

            {/* Checkout Button */}
            <Button
              asChild
              size="lg"
              className="w-full text-lg"
            >
              <a href={cart?.checkoutUrl || '#'} target="_blank" rel="noopener noreferrer">
                Proceed to Checkout
              </a>
            </Button>

            {/* Continue Shopping */}
            <Button
              onClick={onClose}
              variant="outline"
              size="lg"
              className="w-full"
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
