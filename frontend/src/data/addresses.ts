import type { Address } from "@/shared/types";

export const mockAddresses: Address[] = [
  {
    id: "ADDR-1",
    label: "Home",
    street: "1234 Blossom Hill Rd, Apt 4B",
    city: "San Jose",
    state: "CA",
    zip: "95123",
    country: "United States",
    isDefault: true,
  },
  {
    id: "ADDR-2",
    label: "Work",
    street: "900 Tech Innovation Blvd, Floor 12",
    city: "San Francisco",
    state: "CA",
    zip: "94107",
    country: "United States",
    isDefault: false,
  },
  {
    id: "ADDR-3",
    label: "Other",
    street: "442 Alpine Way",
    city: "Lake Tahoe",
    state: "CA",
    zip: "96150",
    country: "United States",
    isDefault: false,
  },
];
