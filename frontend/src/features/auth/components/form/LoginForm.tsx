// src/features/auth/components/form/LoginForm.tsx

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";

import {
  loginSchema,
  type LoginFormValues,
} from "../../validation/login.schema";

import { useLoginMutation } from "../../api/login.queries";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  // ── Replaces the manual useState(isPending) + fake setTimeout ──────────────
  const { mutate: login, isPending } = useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSubmit = (data: LoginFormValues) => {
    login(
      {
        email: data.email,
        password: data.password,
        remember: data.rememberMe,
      },
      {
        // Reset the form only on success so the user's input
        // is preserved if the request fails (easier to correct).
        onSuccess: () => form.reset(),
      },
    );
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
      <FieldGroup>
        {/* Email */}
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Email address</FieldLabel>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...field}
                  type="email"
                  className="h-12 pl-10"
                  placeholder="you@example.com"
                  disabled={isPending}
                />
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Password</FieldLabel>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  className="h-12 pl-10 pr-11"
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Remember Me */}
        <Controller
          name="rememberMe"
          control={form.control}
          render={({ field }) => (
            <Field>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending}
                  />
                  <span className="text-sm text-muted-foreground">
                    Remember me
                  </span>
                </div>

                <a
                  href="#"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </a>
              </div>
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </form>
  );
};

export default LoginForm;
