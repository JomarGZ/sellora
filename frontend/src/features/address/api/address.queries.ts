import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Address,
  UserAddressesResponse,
  UserAddressResponse,
} from "../types";
import { mockAddresses } from "@/data";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import {
  createUserAddress,
  deleteUserAddress,
  getUserAddress,
  getUserAddresses,
  setDefaultUserAddress,
  updateUserAddress,
} from "./address.api";
import type { AddressFormValues } from "../validation/address.schema";
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

export function useCreateUserAddress() {
  const { showToast } = useAppToast();
  const queryClient = useQueryClient();

  return useMutation<UserAddressResponse, Error, AddressFormValues>({
    mutationFn: createUserAddress,
    onSuccess(response) {
      showToast({
        severity: "success",
        summary: "Address Created",
        detail: response.message ?? "New Address added successfully.",
      });

      queryClient.invalidateQueries({
        queryKey: ["user", "addresses"],
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

export function useUserAddress1(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "address", id],
    queryFn: () => getUserAddress(id),
    enabled: !!id && (options?.enabled ?? true),
  });
}

export function useUserAddresses() {
  return useQuery({
    queryKey: ["user", "addresses"],
    queryFn: getUserAddresses,
  });
}

export function useSetDefaultUserAddress() {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();
  return useMutation({
    mutationFn: setDefaultUserAddress,
    onSuccess() {
      showToast({
        severity: "success",
        summary: "Set Default",
        detail: "Address set as default successfully.",
      });

      queryClient.invalidateQueries({
        queryKey: ["user", "addresses"],
      });
    },
    onError(error: any) {
      showToast({
        severity: "error",
        summary: "Failed",
        detail: error?.message ?? "Unable to set default address.",
      });
    },
  });
}

export function useUpdateUserAddress() {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();

  return useMutation<
    UserAddressResponse,
    Error,
    AddressFormValues & { id: number },
    { previous?: UserAddressesResponse }
  >({
    mutationFn: updateUserAddress,

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (updatedAddress) => {
      await queryClient.cancelQueries({ queryKey: ["user", "addresses"] });

      const previous = queryClient.getQueryData<UserAddressesResponse>([
        "user",
        "addresses",
      ]);

      queryClient.setQueryData<UserAddressesResponse>(
        ["user", "addresses"],
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((addr) =>
              addr.id === updatedAddress.id
                ? {
                    ...addr,
                    first_name: updatedAddress.first_name,
                    last_name: updatedAddress.last_name,
                    phone: updatedAddress.phone,
                    street_address: updatedAddress.street_address,
                    is_default: updatedAddress.is_default,
                  }
                : addr,
            ),
          };
        },
      );

      return { previous };
    },

    // ❌ ROLLBACK IF ERROR
    onError(error, _, context) {
      if (context?.previous) {
        queryClient.setQueryData(["user", "addresses"], context.previous);
      }

      showToast({
        severity: "error",
        summary: "Update Failed",
        detail: error.message ?? "Unable to update address.",
      });
    },

    // ✅ SUCCESS FEEDBACK
    onSuccess(response) {
      showToast({
        severity: "success",
        summary: "Updated",
        detail: response.message ?? "Address updated successfully.",
      });
    },

    // 🔄 FINAL SYNC
    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["user", "addresses"],
      });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  const { showToast } = useAppToast();

  return useMutation({
    mutationFn: deleteUserAddress,

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: ["user", "addresses"] });

      const previous = queryClient.getQueryData(["user", "addresses"]);

      queryClient.setQueryData(["user", "addresses"], (old: any) => ({
        ...old,
        data: old.data.filter((addr: any) => addr.id !== id),
      }));

      return { previous };
    },

    onError(error, _, context) {
      queryClient.setQueryData(["user", "addresses"], context?.previous);

      showToast({
        severity: "error",
        summary: "Failed",
        detail: error?.message ?? "Unable to delete address.",
      });
    },

    onSuccess() {
      showToast({
        severity: "success",
        summary: "Deleted",
        detail: "Address deleted successfully.",
      });
    },

    onSettled() {
      queryClient.invalidateQueries({
        queryKey: ["user", "addresses"],
      });
    },
  });
}
