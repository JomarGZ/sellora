import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  message = "Something went wrong",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 py-8">
      <AlertTriangle className="h-8 w-8 text-destructive" />
      <p className="mt-3 font-medium text-card-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Try Again
        </Button>
      )}
    </div>
  );
}
