"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MOCK_ADMIN_PASSWORD, mockAdminUser } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/browser";
import { loginSchema, type LoginInput } from "@/lib/validators/auth";

const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE === "true";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const fillMockAdmin = () => {
    form.setValue("email", mockAdminUser.email);
    form.setValue("password", MOCK_ADMIN_PASSWORD);
    // Trigger submit with the set values
    form.handleSubmit((values) => onSubmitLogic(values))();
  };

  const onSubmitLogic = async (values: LoginInput) => {
    startTransition(async () => {
      if (isMockMode) {
        const isAdminLogin =
          values.email === mockAdminUser.email && values.password === MOCK_ADMIN_PASSWORD;

        if (!isAdminLogin) {
          setError("Invalid credentials. Use the mock admin button for local access.");
          return;
        }

        document.cookie = "mock_auth_role=admin; path=/; SameSite=Lax";
        toast.success("Mock login successful.");
        router.push(redirectTo ?? "/admin");
        router.refresh();
        return;
      }

      const supabase = createClient();
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (signInError) {
        setError(signInError.message);
        toast.error(signInError.message);
        return;
      }

      toast.success("Welcome back.");
      router.push(redirectTo ?? "/dashboard");
      router.refresh();
    });
  };

  const onSubmit = form.handleSubmit(onSubmitLogic);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input type="email" {...form.register("email")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <Input type="password" {...form.register("password")} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {isMockMode && (
        <Button type="button" onClick={fillMockAdmin} variant="secondary" className="w-full">
          Use Mock Admin
        </Button>
      )}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Signing in..." : "Log in"}
      </Button>
    </form>
  );
}
