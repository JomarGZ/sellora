import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '../ui/button'
import { getErrorMessage, type FallbackProps } from 'react-error-boundary'

interface ProductGridFallbackProps extends FallbackProps {
}
export function ProductGridFallback({error, resetErrorBoundary}: ProductGridFallbackProps) {
   return (
    <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.2 }}
    className="flex items-center justify-center rounded-lg bg-muted/40 px-6 py-20"
  >
    <div className="flex max-w-sm flex-col items-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold text-foreground">
          Unable to load products
        </h3>
        <p className="text-sm text-muted-foreground">
          {getErrorMessage(error)}
        </p>
      </div>
        <Button onClick={resetErrorBoundary} className="mt-2 gap-2">
          <RefreshCw className="h-4 w-4" />
          Try Again
        </Button>
    </div>
  </motion.div>
   )
}