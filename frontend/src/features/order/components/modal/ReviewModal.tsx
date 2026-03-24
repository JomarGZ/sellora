import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";

import { Button } from "@/shared/components/ui/button";
import {
  InputGroup,
  InputGroupTextarea,
} from "@/shared/components/ui/input-group";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";

import { Star } from "lucide-react";
import type { CreateReviewPayload } from "../../types";
import {
  reviewSchema,
  type ReviewFormValues,
} from "../../validation/review.schema";
import { useAppToast } from "@/shared/components/feedback/AppToast";

interface ReviewModalProps {
  orderItemId: string;
  productName: string;
  productImage: string;
  existingReview?: {
    rating: number;
    comment?: string | null;
  } | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReviewPayload) => void;
}

export function ReviewModal({
  orderItemId,
  productName,
  productImage,
  existingReview,
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { showToast } = useAppToast();
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: existingReview?.rating ?? 0,
      comment: existingReview?.comment ?? "",
    },
  });

  const handleSubmit = async (data: ReviewFormValues) => {
    setIsPending(true);
    try {
      await new Promise((r) => setTimeout(r, 400));

      await onSubmit({
        orderItemId,
        rating: data.rating,
        comment: data.comment,
      });
      showToast({
        severity: "success",
        summary: "Review submitted",
        detail: "Thank you for your feedback",
      });
      form.reset();
      onClose();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {existingReview ? "Edit Review" : "Write a Review"}
          </DialogTitle>
          <DialogDescription>
            Share your experience with this product.
          </DialogDescription>
        </DialogHeader>

        {/* Product Info */}
        <div className="flex items-center gap-3 border rounded-xl p-3 bg-muted/40">
          <img
            src={productImage}
            alt={productName}
            className="w-14 h-14 object-cover rounded-lg"
          />
          <div>
            <p className="font-medium">{productName}</p>
            <p className="text-sm text-muted-foreground">Purchased item</p>
          </div>
        </div>

        <form
          id="review-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            {/* Rating */}
            <Controller
              name="rating"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Overall Rating</FieldLabel>

                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHoveredStar(star)}
                        onMouseLeave={() => setHoveredStar(0)}
                        onClick={() => field.onChange(star)}
                        className="p-1 rounded-full transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoveredStar || field.value)
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Comment */}
            <Controller
              name="comment"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Comment (Optional)</FieldLabel>

                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      placeholder="What did you like or dislike?"
                      className="min-h-25 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                  </InputGroup>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
