import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { User, User2, UserCircle } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import {
  profileSchema,
  type ProfileFormValues,
} from "../validation/profile.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { useAuth } from "@/providers/AuthProvider";
import { useUpdateProfile } from "@/features/auth/api/user.queries";
import type { User as UserType } from "@/shared/types";
import { useEffect } from "react";

export function EditProfileForm() {
  const { user, setUser } = useAuth();
  const updateProfile = useUpdateProfile();
  const defaultValues = {
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
  };
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const handleSubmit = (data: ProfileFormValues) => {
    if (!form.formState.isDirty) return;

    updateProfile.mutate(data, {
      onSuccess: (response) => {
        const updatedUser = response.data;

        form.reset({
          first_name: updatedUser.first_name ?? "",
          last_name: updatedUser.last_name ?? "",
        });

        setUser({
          ...user,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
        } as UserType);
      },
    });
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl border border-border/60 overflow-hidden">
      <div className="p-6 border-b border-border/40 bg-muted/20">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <User2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              My Information
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="first_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>First Name</FieldLabel>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    className="h-12 pl-10"
                    placeholder="John"
                    disabled={updateProfile.isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="last_name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel required>Last name</FieldLabel>
                <div className="relative">
                  <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    className="h-12 pl-10"
                    placeholder="Doe"
                    disabled={updateProfile.isPending}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <Button
          type="submit"
          disabled={updateProfile.isPending}
          className="mt-2 cursor-pointer rounded-xl border-border/60"
        >
          {updateProfile.isPending ? `Updating Profile` : `Update Profile`}
        </Button>
      </form>
    </div>
  );
}
