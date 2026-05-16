import { useState } from "react";
import { Bell, Smartphone, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { useUpdateSettings } from "../../api/account.queries";
import { EditProfileForm } from "@/features/account/form/EditProfileForm";
import { PasswordSecurityForm } from "../../form/PasswordSecurityForm";

export function SettingsSection() {
  const mutation = useUpdateSettings();

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);

  const handleSave = () => {
    mutation.mutate(
      { emailNotifs, smsNotifs },
      {
        onSuccess: () => {
          //   toast({ title: "Settings updated successfully" });
        },
      },
    );
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <EditProfileForm />
      <PasswordSecurityForm />
    </div>
  );
}
