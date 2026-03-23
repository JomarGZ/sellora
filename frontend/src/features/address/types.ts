export interface Address {
  id: string;
  label: "Home" | "Work" | "Other";
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}
