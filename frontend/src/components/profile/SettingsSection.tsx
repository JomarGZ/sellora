import { useState } from "react";
import { Lock, Bell, Smartphone } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Label } from "@/shared/components/ui/label";
import { useUpdateSettings } from "@/hooks/useProfile";

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
      {/* Password Section */}
      <div className="bg-white dark:bg-card rounded-2xl border border-border/60 overflow-hidden">
        <div className="p-6 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Password & Security
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage your password and security preferences.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="current">Current Password</Label>
            <Input
              id="current"
              type="password"
              placeholder="••••••••"
              className="rounded-xl"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                placeholder="••••••••"
                className="rounded-xl"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input
                id="confirm"
                type="password"
                placeholder="••••••••"
                className="rounded-xl"
              />
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-2 rounded-xl border-border/60"
          >
            Update Password
          </Button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white dark:bg-card rounded-2xl border border-border/60 overflow-hidden">
        <div className="p-6 border-b border-border/40 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Notification Preferences
              </h3>
              <p className="text-sm text-muted-foreground">
                Choose what updates you want to receive.
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <MailIcon className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-base font-medium">
                  Email Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Receive order updates and promotions via email.
                </p>
              </div>
            </div>
            <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
          </div>

          <div className="h-px bg-border/40" />

          <div className="flex items-center justify-between">
            <div className="flex items-start gap-3">
              <Smartphone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <Label className="text-base font-medium">
                  SMS Notifications
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get real-time delivery tracking alerts on your phone.
                </p>
              </div>
            </div>
            <Switch checked={smsNotifs} onCheckedChange={setSmsNotifs} />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          className="rounded-xl px-8 shadow-md hover-elevate font-semibold"
          onClick={handleSave}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Save All Changes"}
        </Button>
      </div>
    </div>
  );
}

// Simple internal icon since we didn't import Mail globally here
function MailIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinelinejoin="round"
      {...props}
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
