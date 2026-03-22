"use client";

import { useState } from "react";
import { z } from "zod";
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
import { Input } from "@/shared/components/ui/input";
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
import type { Review } from "@/features/product/types";

// ✅ Schema
const reviewSchema = z.object({
  userName: z.string().min(2, "Name must be at least 2 characters"),
  rating: z.number().min(1, "Please select a rating").max(5),
  comment: z.string().optional(),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewModalProps {
  productId: number;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: Review) => void;
}

export function ReviewModal({
  productId: _productId,
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      userName: "",
      rating: 0,
      comment: "",
    },
  });

  const handleSubmit = async (data: ReviewFormValues) => {
    setIsPending(true);
    try {
      await new Promise((r) => setTimeout(r, 400));

      const newReview: Review = {
        id: Date.now(),
        userName: data.userName,
        rating: data.rating,
        comment: data.comment ?? null,
        createdAt: new Date().toISOString(),
        verified: false,
      };

      onSubmit(newReview);
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
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your thoughts about this product.
          </DialogDescription>
        </DialogHeader>

        <form
          id="review-form"
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            {/* ⭐ Rating */}
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

            {/* 👤 Name */}
            <Controller
              name="userName"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Your Name</FieldLabel>

                  <Input
                    {...field}
                    placeholder="John Doe"
                    aria-invalid={fieldState.invalid}
                  />

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* 💬 Comment */}
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
                      className="min-h-[100px] resize-none"
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
