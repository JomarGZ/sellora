import { useState, useEffect, useCallback } from "react";
import type { ShippingMethod } from "@/types/checkout";
import { MOCK_SHIPPING_METHODS } from "@/data/mock-data";

export function useShippingMethods() {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMethods = useCallback(() => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      try {
        setMethods(MOCK_SHIPPING_METHODS);
        setLoading(false);
      } catch (e) {
        setError(e as Error);
        setLoading(false);
      }
    }, 600);
  }, []);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  return { methods, loading, error, retry: fetchMethods };
}
