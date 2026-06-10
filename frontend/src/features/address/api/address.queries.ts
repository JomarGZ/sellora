import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { UserAddressesResponse, UserAddressResponse } from "../types";
import { useAppToast } from "@/shared/components/feedback/AppToast";
import {
  createUserAddress,
  deleteUserAddress,
  getDefaultAddress,
  getUserAddress,
  getUserAddresses,
  setDefaultUserAddress,
  updateUserAddress,
} from "./address.api";
import type { AddressFormValues } from "../validation/address.schema";

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

export function useUserAddresses() {
  return useQuery({
    queryKey: ["user", "addresses"],
    queryFn: getUserAddresses,
  });
}

export function useUserAddress(id: number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["user", "address", id], // ← scope by id, not just ["user", "addresses"]
    queryFn: () => getUserAddress(id),
    enabled: options?.enabled ?? true,
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
      queryClient.invalidateQueries({
        queryKey: ["default-address"],
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

export function useUserDefaultAddress() {
  return useQuery({
    queryKey: ["default-address"],
    queryFn: getDefaultAddress,
  });
}
