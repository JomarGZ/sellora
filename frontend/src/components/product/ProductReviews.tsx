import { useState } from "react";
import type { Review, ReviewsResponse } from "@/types";
import { MOCK_REVIEWS } from "@/data/mock-data";
import { format } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ReviewModal } from "./ReviewModal";
import { EmptyState } from "./EmptyState";

interface ProductReviewsProps {
  productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  // ─────────────────────────────────────────────────────────────────────────────
  // When you have your real API ready, replace the mock data source below with
  // a real fetch / React Query hook:
  //   const { data, isLoading, error } = useGetProductReviews(productId);
  // ─────────────────────────────────────────────────────────────────────────────
  const initialData: ReviewsResponse = MOCK_REVIEWS[productId] ?? {
    reviews: [],
    averageRating: 0,
    totalReviews: 0,
  };

  const [reviewsData, setReviewsData] = useState<ReviewsResponse>(initialData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { reviews, averageRating, totalReviews } = reviewsData;

  const distribution = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    };
  });

  // Called by ReviewModal after a new review is submitted
  const handleReviewSubmit = (newReview: Review) => {
    const updatedReviews = [newReview, ...reviews];
    const newTotal = updatedReviews.length;
    const newAvg =
      Math.round(
        (updatedReviews.reduce((s, r) => s + r.rating, 0) / newTotal) * 10,
      ) / 10;
    setReviewsData({
      reviews: updatedReviews,
      averageRating: newAvg,
      totalReviews: newTotal,
    });
  };

  return (
    <div className="space-y-10">
      {/* Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Overall Rating */}
        <div className="lg:col-span-4 bg-muted/30 p-8 rounded-3xl border border-border/50 flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-display font-semibold mb-2">
            Customer Reviews
          </h3>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Star className="w-8 h-8 fill-amber-400 text-amber-400" />
            <span className="text-5xl font-display font-bold">
              {averageRating.toFixed(1)}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Based on {totalReviews} review{totalReviews !== 1 && "s"}
          </p>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="w-full rounded-xl"
          >
            Write a Review
          </Button>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-8 flex flex-col justify-center h-full space-y-3 py-4">
          {distribution.map(({ stars, count, percentage }) => (
            <div key={stars} className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 w-12 shrink-0">
                <span className="font-medium">{stars}</span>
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>
              <Progress value={percentage} className="h-2.5 bg-muted" />
              <span className="w-12 text-right text-muted-foreground shrink-0">
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-border/60" />

      {/* Reviews List */}
      <div>
        <h4 className="text-xl font-display font-semibold mb-6">
          Recent Reviews
        </h4>
        {reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-8 h-8" />}
            title="No reviews yet"
            description="Be the first to review this product and share your experience with others."
            action={
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                className="rounded-xl"
              >
                Write the first review
              </Button>
            }
          />
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold">
                      {review.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        {review.userName}
                        {review.verified && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
                            Verified
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(review.createdAt), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-muted-foreground/20 fill-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-foreground/80 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal
        productId={productId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReviewSubmit}
      />
    </div>
  );
}
