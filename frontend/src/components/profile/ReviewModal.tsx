import { useState } from "react";
import type { OrderItem } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewModalProps {
  orderId: string | null;
  item: OrderItem | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (
    orderId: string,
    itemId: string,
    rating: number,
    comment: string,
  ) => void;
}

const ReviewModal = ({
  orderId,
  item,
  open,
  onClose,
  onSubmit,
}: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!orderId || !item) return;
    onSubmit(orderId, item.id, rating, comment);
    setRating(0);
    setComment("");
    onClose();
  };

  const handleOpenChange = (o: boolean) => {
    if (!o) {
      setRating(0);
      setComment("");
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Rate Product</DialogTitle>
        </DialogHeader>

        {item && (
          <div className="flex items-center gap-3 py-2 border-b border-border">
            <img
              src={item.image}
              alt={item.name}
              className="h-10 w-10 rounded object-cover"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">{item.variant}</p>
            </div>
          </div>
        )}

        <div className="space-y-4 py-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="p-0.5"
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition-colors duration-150",
                    star <= rating
                      ? "fill-status-pending text-status-pending"
                      : "text-border",
                  )}
                />
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Tell us about your experience (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={rating === 0}>
            Submit Review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
