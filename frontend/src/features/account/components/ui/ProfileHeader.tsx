import { useState } from "react";
import Skeleton from "react-loading-skeleton";
import { format } from "date-fns";
import { Edit2, Mail, Calendar } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import type { User } from "@/shared/types";

type ProfileHeaderProps = {
  user: User | null;
  isLoading?: boolean;
};
export function ProfileHeader({ user, isLoading }: ProfileHeaderProps) {
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [avatarUploadOpen, setAvatarUploadOpen] = useState(false);

  const fullName = user
    ? `${user.first_name} ${user.last_name}`
    : "Customer Name";
  if (!user) {
    return (
      <div className="bg-destructive/10 text-destructive p-6 rounded-2xl flex items-center justify-center">
        Failed to load profile header.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border/50 relative overflow-hidden flex flex-col md:flex-row items-center md:items-start gap-6">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

      {isLoading ? (
        <Skeleton circle width={120} height={120} />
      ) : (
        <div className="relative group">
          <img
            src={"https://i.pravatar.cc/150?img=2"}
            alt={fullName}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-background shadow-md"
          />
          <button
            className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full shadow-lg hover:scale-105 transition-transform hover-elevate"
            onClick={() => setAvatarUploadOpen(true)}
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left z-10">
        {isLoading ? (
          <>
            <Skeleton width={200} height={32} className="mb-2" />
            <Skeleton width={300} height={20} />
          </>
        ) : (
          <>
            <h1 className="text-2xl capitalize md:text-3xl font-bold text-foreground mb-1">
              {fullName}
            </h1>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6 mt-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-primary/70" />
                {user?.email}
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-primary/70" />
                Member since{" "}
                {user?.created_at &&
                  format(new Date(user.created_at), "MMM yyyy")}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="z-10 mt-4 md:mt-0">
        {isLoading ? (
          <Skeleton width={120} height={40} borderRadius={12} />
        ) : (
          <Button
            variant="outline"
            className="rounded-xl px-6 font-medium shadow-sm hover-elevate bg-background border-border/60"
            onClick={() => setEditProfileOpen(true)}
          >
            Edit Profile
          </Button>
        )}
      </div>

      {/* {displayCustomer && (
        <EditProfileModal
          isOpen={editProfileOpen}
          onClose={() => setEditProfileOpen(false)}
          customer={displayCustomer}
          onSave={handleSaveProfile}
        />
      )}

      {displayCustomer && (
        <AvatarUploadModal
          isOpen={avatarUploadOpen}
          onClose={() => setAvatarUploadOpen(false)}
          currentAvatar={displayCustomer.avatar}
          onSave={handleSaveAvatar}
        />
      )} */}
    </div>
  );
}
