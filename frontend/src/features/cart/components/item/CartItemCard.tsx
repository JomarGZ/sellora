import { Button } from "@/shared/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import type { CartItem } from "../../types";
import { Link } from "@tanstack/react-router";

interface CartItemCardProps {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
  isRemoving?: boolean;
}

export function CartItemCard({
  item,
  onUpdateQuantity,
  onRemove,
  isRemoving = false,
}: CartItemCardProps) {
  const attributeDescription = item.product_item.attribute_values
    .map((av) => `${av.attribute_name}: ${av.value}`)
    .join(", ");
  return (
    <div className="flex gap-4 p-4 bg-white dark:bg-card rounded-2xl border border-border/50 shadow-sm relative group">
      <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted shrink-0">
        <img
          src={item.product_item.images[0]?.url}
          alt={item.product_item.product?.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col flex-1 py-1">
        <div className="flex justify-between items-start pr-8">
          <div>
            <Link
              to="/product/$slug"
              params={{ slug: item.product_item.product?.slug }}
              className="font-semibold text-foreground line-clamp-1 hover:underline"
            >
              {item.product_item.product?.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              {attributeDescription}
            </p>
          </div>
          <p className="font-bold font-display">${item.product_item.price}</p>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-3 bg-muted/50 rounded-lg p-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              <Minus className="w-3 h-3" />
            </Button>
            <motion.span
              key={item.quantity}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-4 text-center text-sm font-medium"
            >
              {item.quantity}
            </motion.span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-md"
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        disabled={isRemoving}
        className="absolute cursor-pointer top-3 right-3 text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all rounded-lg"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
