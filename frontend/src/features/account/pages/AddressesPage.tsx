import { useState } from "react";
import { AddressFormModal } from "@/features/address/components/modals/AddressFormModal";
import { AddressSection } from "@/features/address/components/sections/AddressSection";

export function AddressesPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const handleCreate = () => {
    setSelectedAddressId(null);
    setIsOpen(true);
  };

  return (
    <>
      <AddressSection
        onAdd={handleCreate}
        onEdit={(id) => {
          setSelectedAddressId(id);
          setIsOpen(true);
        }}
      />

      <AddressFormModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        addressId={selectedAddressId}
      />
    </>
  );
}
