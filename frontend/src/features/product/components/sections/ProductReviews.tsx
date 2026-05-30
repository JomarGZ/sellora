import { format } from "date-fns";
import { Star, MessageSquare } from "lucide-react";
import { Progress } from "@/shared/components/ui/progress";
import { Separator } from "@/shared/components/ui/separator";
import { EmptyState } from "../../states/EmptyState";
import type { ProductReview, ProductReviewResponse } from "@/shared/types";
import { formatAttributeDescription } from "@/shared/lib/utils";
import { Pagination } from "../ui/Pagination";
import UserAvatar from "@/shared/components/ui/user-avatar";

interface ProductReviewsProps {
  reviewSummary: ProductReview;
  commentListPage: number;
  onPageChange: (page: number) => void;
  productReviews: ProductReviewResponse | undefined;
}

export function ProductReviews({
  reviewSummary,
  onPageChange,
  productReviews,
  commentListPage,
}: ProductReviewsProps) {
  console.log(productReviews);
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
              {reviewSummary.average}
            </span>
          </div>
          <p className="text-muted-foreground text-sm mb-6">
            Based on {reviewSummary.count} review
            {reviewSummary.count !== 1 && "s"}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="lg:col-span-8 flex flex-col justify-center h-full space-y-3 py-4">
          {reviewSummary.ratings.map(({ stars, count, percentage }) => (
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
        {productReviews?.data.length === 0 ? (
          <EmptyState
            icon={<MessageSquare className="w-8 h-8" />}
            title="No reviews yet"
            description="Be the first to review this product and share your experience with others."
          />
        ) : (
          <div className="space-y-6">
            {productReviews?.data.map((review) => (
              <div
                key={review.id}
                className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <UserAvatar
                      src={review.user?.avatar}
                      firstName={review.user.first_name}
                      lastName={review.user.last_name}
                    />
                    <div>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        {`${review.user.first_name} ${review.user.last_name}`}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(review.created_at), "MMMM d, yyyy")}
                        </span>
                        {!!review.user.email_verified_at && (
                          <span className="text-[10px] uppercase tracking-wider font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded-sm">
                            Verified
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatAttributeDescription(
                          review.product_item.attribute_values,
                        )}
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
        <Pagination
          currentPage={commentListPage}
          totalPages={productReviews?.meta.last_page ?? 1}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}
