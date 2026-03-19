import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FallbackProps } from "react-error-boundary";

interface ErrorFallbackProps extends FallbackProps {}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="flex flex-col items-center justify-center py-20 text-center px-4">
    <AlertTriangle className="h-14 w-14 text-destructive/60 mb-4" />
    <h3 className="text-lg font-semibold text-foreground mb-1">
      Something went wrong
    </h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-sm">
      {error.message ||
        "An unexpected error occurred while loading your orders."}
    </p>
    <Button variant="outline" onClick={resetErrorBoundary}>
      Try Again
    </Button>
  </div>
);

export default ErrorFallback;
