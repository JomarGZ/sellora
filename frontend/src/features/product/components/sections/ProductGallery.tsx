import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ProductImage } from "../../types";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset active index if images array changes significantly
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full rounded-2xl bg-muted flex items-center justify-center border border-border/50">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  const activeImage = images[activeIndex] || images[0];

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted border border-border/50 shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage.id}
            src={activeImage.imageUrl}
            alt={activeImage.altText || productName}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x scrollbar-hide">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative shrink-0 w-20 h-20 rounded-xl overflow-hidden snap-start transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                activeIndex === idx
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-95"
                  : "border border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100",
              )}
            >
              <img
                src={img.imageUrl}
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
