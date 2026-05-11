import { CheckCircle2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-10">
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-125 w-125 rounded-full bg-success/10 blur-3xl" />
      </div>

      <section className="relative z-10 w-full max-w-md text-center">
        {/* Animated check */}
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-success/30 animate-pulse-ring" />
          <span
            className="absolute inset-0 rounded-full bg-success/20 animate-pulse-ring"
            style={{ animationDelay: "0.6s" }}
          />
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-green-500 animate-success-pop animate-success-glow">
            <svg
              viewBox="0 0 52 52"
              className="h-16 w-16 text-success-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M14 27 L23 36 L40 18"
                className="animate-check-draw text-white"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-3 text-3xl font-bold text-foreground sm:text-4xl">
          Payment Successful
        </h1>
        <p className="mb-2 text-base text-muted-foreground">
          Thank you for your purchase! Your payment has been processed
          successfully.
        </p>

        {/* Indicator */}
        <div className="mx-auto mb-8 mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
          </span>
          Payment processed
        </div>

        {/* Order details */}
        {/* <div className="mb-8 rounded-xl border bg-card p-5 text-left shadow-sm">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="flex items-center gap-2 text-sm text-muted-foreground">
              <Receipt className="h-4 w-4" /> Order ID
            </span>
            <span className="font-mono text-sm font-semibold text-foreground">
              {orderId}
            </span>
          </div>
          {typeof state.total === "number" && (
            <div className="flex items-center justify-between pt-3">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" /> Total paid
              </span>
              <span className="text-sm font-semibold text-foreground">
                ${state.total.toFixed(2)}
              </span>
            </div>
          )}
        </div> */}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="flex-1">
            <Link to="/shop">Continue shopping</Link>
          </Button>
          <Button
            className="flex-1 cursor-pointer"
            onClick={() => navigate({ to: "/account/orders" })}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            View orders
          </Button>
        </div>
      </section>
    </main>
  );
}
