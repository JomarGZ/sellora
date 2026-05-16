import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Lock } from "lucide-react";

export function PasswordSecurityForm() {
  return (
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
        <Button className="mt-2 rounded-xl border-border/60">
          Update Password
        </Button>
      </div>
    </div>
  );
}
