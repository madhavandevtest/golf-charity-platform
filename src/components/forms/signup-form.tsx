"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { env } from "@/lib/env";
import { createClient } from "@/lib/supabase/browser";
import type { Charity } from "@/lib/types";
import { signupSchema } from "@/lib/validators/auth";

const isMockMode = process.env.NEXT_PUBLIC_ENABLE_MOCK_MODE === "true";

export function SignupForm({
  charities,
  selectedCharityId,
  selectedPlan,
}: {
  charities: Charity[];
  selectedCharityId?: string;
  selectedPlan?: "monthly" | "yearly";
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.input<typeof signupSchema>, unknown, z.output<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      charityId: selectedCharityId ?? charities[0]?.id ?? "",
      charityPercentage: 10,
    },
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      if (isMockMode) {
        toast.success("Mock account created.");
        router.push(`/dashboard/subscription?plan=${selectedPlan ?? "monthly"}`);
        router.refresh();
        return;
      }

      const supabase = createClient();
      setError(null);

      const { error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
          data: {
            full_name: values.fullName,
            charity_id: values.charityId,
            charity_percentage: values.charityPercentage,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      toast.success("Account created. If email confirmation is enabled, check your inbox.");
      router.push(`/dashboard/subscription?plan=${selectedPlan ?? "monthly"}`);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Full name</label>
        <Input {...form.register("fullName")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input type="email" {...form.register("email")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <Input type="password" {...form.register("password")} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Choose a charity</label>
        <Select {...form.register("charityId")}>
          {charities.map((charity) => (
            <option key={charity.id} value={charity.id}>
              {charity.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Charity contribution %</label>
        <Input type="number" min={10} max={100} {...form.register("charityPercentage")} />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
