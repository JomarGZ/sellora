import { cn } from "@/shared/lib/utils";

const sizes = {
  sm: "h-9 w-9 text-xs",
  m: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-24 w-24 text-xl",
  "2xl": "h-32 w-32 text-2xl",
} as const;

type AvatarSize = keyof typeof sizes;

const statusSizes = {
  sm: "h-2.5 w-2.5 border-[1.5px]",
  m: "h-3 w-3 border-2",
  lg: "h-3.5 w-3.5 border-2",
  xl: "h-4 w-4 border-2",
  "2xl": "h-5 w-5 border-2",
} as const;

const avatarColors = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
] as const;

interface UserAvatarProps {
  src?: string | null;
  firstName?: string;
  lastName?: string;
  size?: AvatarSize;
  className?: string;
  isOnline?: boolean;
}

function getColorFromInitials(initials: string) {
  let hash = 0;

  for (let i = 0; i < initials.length; i++) {
    hash = initials.charCodeAt(i) + ((hash << 5) - hash);
  }

  return Math.abs(hash) % avatarColors.length;
}

export default function UserAvatar({
  src,
  firstName,
  lastName,
  size = "sm",
  className,
  isOnline = false,
}: UserAvatarProps) {
  const initials =
    `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const colorIndex = getColorFromInitials(initials);
  const bgColor = avatarColors[colorIndex];

  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 rounded-full bg-muted ring-2 ring-background",
        sizes[size],
        className,
      )}
    >
      {src ? (
        <img
          src={src}
          alt={`${firstName} ${lastName ?? ""}`}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full font-medium",
            bgColor,
          )}
        >
          {initials}
        </div>
      )}

      {isOnline && (
        <span
          className={cn(
            "absolute top-0 right-0 rounded-full border-background bg-green-500",
            statusSizes[size],
          )}
        />
      )}
    </div>
  );
}
