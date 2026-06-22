"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { X, ShoppingCart, Star, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice, getImageUrl, getDiscountPercent } from "@/lib/utils";
import { useCart } from "@/hooks/useCart";
import { useSession } from "@/lib/auth-client";
import { useGuestCartStore } from "@/store";
import { RatingStars } from "@/components/common/rating-stars";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  shortDescription?: string;
  category?: { name: string; slug: string };
}

export function QuickViewModal({
  product,
  isOpen,
  onClose,
}: {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { data: session } = useSession();
  const [quantity, setQuantity] = useState(1);
  const { addToCartAsync, items } = useCart();
  const { add: addToGuestCart } = useGuestCartStore();
  const [adding, setAdding] = useState(false);

  const cartItem = items.find((i) => i.product.id === product.id);
  const discount = getDiscountPercent(product.price, product.comparePrice);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      if (session?.user) {
        await addToCartAsync({
          productId: product.id,
          quantity,
          branchId: undefined,
        });
      } else {
        addToGuestCart({
          productId: product.id,
          quantity,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            comparePrice: product.comparePrice,
            images: product.images,
            stock: product.stock,
          },
        });
      }
      onClose();
    } finally {
      setAdding(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-4 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl z-50 bg-card rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row max-h-[90vh]">
              {/* Image */}
              <div className="relative w-full sm:w-1/2 h-64 sm:h-auto bg-muted">
                <Image
                  src={getImageUrl(product.images[0])}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {discount && discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>

                {product.category && (
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                    {product.category.name}
                  </p>
                )}

                <h2 className="text-xl font-bold mb-3 pr-8">{product.name}</h2>

                <div className="flex items-center gap-3 mb-4">
                  <RatingStars rating={product.rating} />
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount})
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(product.price)}
                  </span>
                  {product.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(product.comparePrice)}
                    </span>
                  )}
                </div>

                {product.shortDescription && (
                  <p className="text-sm text-muted-foreground mb-6">
                    {product.shortDescription}
                  </p>
                )}

                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stock, quantity + 1))
                      }
                      className="p-2 hover:bg-muted transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding || product.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    {adding ? "Adding..." : cartItem ? "Update Cart" : "Add to Cart"}
                  </button>
                  <Link
                    href={`/${locale}/product/${product.slug}`}
                    onClick={onClose}
                    className="px-6 py-3 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
