import { useState } from "react";
import type { OrderItem } from "@/data/mockProfile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderItems: OrderItem[];
}

export function RatingModal({
  isOpen,
  onClose,
  orderId,
  orderItems,
}: RatingModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setIsSuccess(true);
    setTimeout(() => {
      onClose();
      // Reset state for next time
      setTimeout(() => {
        setIsSuccess(false);
        setRating(0);
        setReview("");
      }, 300);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            Rate Your Order {orderId}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Thank you for your review! ⭐
            </h3>
            <p className="text-muted-foreground mt-2">
              Your feedback helps us improve.
            </p>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                How would you rate these items?
              </p>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`p-1 transition-all ${
                      (hoverRating || rating) >= star
                        ? "text-amber-400"
                        : "text-muted/50"
                    } hover:scale-110`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      className={`w-8 h-8 ${(hoverRating || rating) >= star ? "fill-current" : ""}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Tell us about your experience..."
                className="min-h-[120px] rounded-xl resize-none"
                value={review}
                onChange={(e) => setReview(e.target.value)}
              />
            </div>
          </div>
        )}

        {!isSuccess && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || isSubmitting}
              className="rounded-xl"
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
