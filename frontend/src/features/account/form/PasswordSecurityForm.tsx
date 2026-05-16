import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Lock } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  passwordSchema,
  type PasswordFormValues,
} from "../validation/password.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { useChangePassword } from "@/features/auth/api/user.queries";

export function PasswordSecurityForm() {
  const changePassword = useChangePassword();
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const handleSubmit = (data: PasswordFormValues) => {
    changePassword.mutate(data, {
      onSuccess: () => form.reset(),
    });
  };
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
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="p-6 space-y-4"
      >
        <div className="grid gap-2">
          <Controller
            name="current_password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Current Password</FieldLabel>
                <div className="relative">
                  <Input
                    {...field}
                    className="rounded-xl"
                    type="password"
                    placeholder="••••••••"
                    disabled={changePassword.isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Controller
              name="new_password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      className="rounded-xl"
                      type="password"
                      placeholder="••••••••"
                      disabled={changePassword.isPending}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
          <div className="grid gap-2">
            <Controller
              name="new_password_confirmation"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Confirm New Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      className="rounded-xl"
                      type="password"
                      placeholder="••••••••"
                      disabled={changePassword.isPending}
                    />
                  </div>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={changePassword.isPending}
          className="mt-2 rounded-xl border-border/60 cursor-pointer"
        >
          {changePassword.isPending
            ? "Updating password..."
            : "Update Password"}
        </Button>
      </form>
    </div>
  );
}
