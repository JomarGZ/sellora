import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getErrorMessage, type FallbackProps } from "react-error-boundary";

interface CartErrorFallbackProps extends FallbackProps {}

const CartErrorFallback = ({
  error,
  resetErrorBoundary,
}: CartErrorFallbackProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <AlertCircle className="text-destructive mb-4" size={48} />
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Unable to load cart
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {getErrorMessage(error) ||
          "Something went wrong while loading your cart. Please try again."}
      </p>
      <Button onClick={resetErrorBoundary} size="lg">
        Try Again
      </Button>
    </div>
  );
};

export default CartErrorFallback;
