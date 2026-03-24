// account/components/sections/ProfileSection.tsx
import { ProfileHeader } from "@/features/account/components/ui/ProfileHeader";
import { ProfileOverviewCard } from "./ProfileOverviewCard";

const ProfileSection = () => {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <ProfileOverviewCard />
    </div>
  );
};

export default ProfileSection;
