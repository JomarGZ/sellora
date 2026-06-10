import { EditProfileForm } from "@/features/account/form/EditProfileForm";
import { PasswordSecurityForm } from "../../form/PasswordSecurityForm";
import { useAuth } from "@/providers/AuthProvider";

export function SettingsSection() {
  const { user } = useAuth();
  return (
    <div className="space-y-8 max-w-3xl">
      <EditProfileForm />
      {user?.can_change_password && <PasswordSecurityForm />}
    </div>
  );
}
