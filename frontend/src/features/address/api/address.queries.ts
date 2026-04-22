import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Address,
  UserAddressPayload,
  UserAddressResponse,
} from "../types";
import { mockAddresses } from "@/data";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import { createUserAddress } from "./address.api";
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useAddresses() {
  return useQuery({
    queryKey: ["profile", "addresses"],
    queryFn: async (): Promise<Address[]> => {
      await delay(1000);
      return mockAddresses;
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await delay(600);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", "addresses"] });
    },
  });
}

export function useCreateUserAddress() {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();

  return useMutation<UserAddressResponse, Error, UserAddressPayload>({
    mutationFn: createUserAddress,
    onSuccess(response) {
      showToast({
        severity: "success",
        summary: "Address Created",
        detail: response.message ?? "New Address added successfully.",
      });

      queryClient.invalidateQueries({
        queryKey: ["user-address"],
      });
    },
    onError(error) {
      showToast({
        severity: "error",
        summary: "Failed",
        detail: error.message ?? "Unable to create address.",
      });
    },
  });
}
