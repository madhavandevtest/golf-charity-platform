"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [selectedCharity, setSelectedCharity] = useState<string>(
    selectedCharityId ?? charities[0]?.id ?? ""
  );
  const hasCharities = charities.length > 0;

  const form = useForm<z.input<typeof signupSchema>, unknown, z.output<typeof signupSchema>>(
    {
      resolver: zodResolver(signupSchema),
      defaultValues: {
        email: "",
        password: "",
        fullName: "",
        charityId: selectedCharity,
        charityPercentage: 10,
      },
    }
  );

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      if (!hasCharities) {
        setError("No charities are available right now. Please add charity records in Supabase first.");
        toast.error("No charities are available right now.");
        return;
      }

      if (!selectedCharity) {
        setError("Please select a charity");
        toast.error("Please select a charity");
        return;
      }

      const finalValues = {
        ...values,
        charityId: selectedCharity,
      };

      if (isMockMode) {
        toast.success("Mock account created.");
        router.push(`/dashboard/subscription?plan=${selectedPlan ?? "monthly"}`);
        router.refresh();
        return;
      }

      const supabase = createClient();
      setError(null);
      const redirectBaseUrl = window.location.origin;

      const { error: signUpError } = await supabase.auth.signUp({
        email: finalValues.email,
        password: finalValues.password,
        options: {
          emailRedirectTo: `${redirectBaseUrl}/api/auth/callback`,
          data: {
            full_name: finalValues.fullName,
            charity_id: finalValues.charityId,
            charity_percentage: finalValues.charityPercentage,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        toast.error(signUpError.message);
        return;
      }

      toast.success("Account created. Check your email for confirmation.");
      router.push(`/login?redirectTo=/dashboard/subscription?plan=${selectedPlan ?? "monthly"}`);
      router.refresh();
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Full name</label>
        <Input
          type="text"
          placeholder="John Doe"
          {...form.register("fullName")}
          required
        />
        {form.formState.errors.fullName && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
          required
        />
        {form.formState.errors.email && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          {...form.register("password")}
          required
        />
        {form.formState.errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Choose a charity</label>
        <select
          value={selectedCharity}
          onChange={(e) => {
            setSelectedCharity(e.target.value);
            form.setValue("charityId", e.target.value);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
          disabled={!hasCharities}
          required
        >
          <option value="">{hasCharities ? "Select a charity..." : "No charities available"}</option>
          {charities.map((charity) => (
            <option key={charity.id} value={charity.id}>
              {charity.name}
            </option>
          ))}
        </select>
        {hasCharities && !selectedCharity && (
          <p className="mt-1 text-sm text-red-600">Please select a charity</p>
        )}
        {!hasCharities && (
          <p className="mt-1 text-sm text-red-600">
            Charity records are missing from the deployed database, so account creation is blocked.
          </p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Charity contribution %
        </label>
        <Input
          type="number"
          min="10"
          max="100"
          placeholder="10"
          {...form.register("charityPercentage", { valueAsNumber: true })}
          required
        />
        {form.formState.errors.charityPercentage && (
          <p className="mt-1 text-sm text-red-600">
            {form.formState.errors.charityPercentage.message}
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
