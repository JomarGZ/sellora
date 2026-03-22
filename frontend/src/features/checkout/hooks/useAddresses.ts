import { useState, useEffect, useCallback } from "react";
import type { Address } from "@/types/checkout";
import { MOCK_ADDRESSES } from "@/data/mock-data";

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAddresses = useCallback(() => {
    setLoading(true);
    setError(null);
    // Simulate API call
    setTimeout(() => {
      try {
        setAddresses(MOCK_ADDRESSES);
        setLoading(false);
      } catch (e) {
        setError(e as Error);
        setLoading(false);
      }
    }, 800);
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const deleteAddress = useCallback(
    (id: number) => {
      const addr = addresses.find((a) => a.id === id);
      if (addr?.is_default && addresses.length === 1) return false;
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      return true;
    },
    [addresses],
  );

  return { addresses, loading, error, retry: fetchAddresses, deleteAddress };
}
