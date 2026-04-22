"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Charity } from "@/lib/types";

async function request<T>(url: string, method: string, body: T) {
  const response = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed.");
  }

  return payload;
}

export function AdminCharityManager({ charities }: { charities: Charity[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-6">
      <form
        className="grid gap-3 rounded-[28px] border border-[var(--color-line)] bg-white p-6"
        onSubmit={(event) => {
          event.preventDefault();
          const formData = new FormData(event.currentTarget);
          const payload = {
            name: String(formData.get("name") ?? ""),
            slug: String(formData.get("slug") ?? ""),
            category: String(formData.get("category") ?? ""),
            location: String(formData.get("location") ?? ""),
            websiteUrl: String(formData.get("websiteUrl") ?? ""),
            summary: String(formData.get("summary") ?? ""),
            description: String(formData.get("description") ?? ""),
            impactStat: String(formData.get("impactStat") ?? ""),
            featured: Boolean(formData.get("featured")),
            active: true,
          };
          startTransition(async () => {
            try {
              await request("/api/admin/charities", "POST", payload);
              toast.success("Charity created.");
              window.location.reload();
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Unable to create charity.");
            }
          });
        }}
      >
        <h2 className="text-2xl font-semibold">Create charity</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Input name="name" placeholder="Name" />
          <Input name="slug" placeholder="Slug" />
          <Input name="category" placeholder="Category" />
          <Input name="location" placeholder="Location" />
          <Input name="websiteUrl" placeholder="Website URL" />
          <Input name="impactStat" placeholder="Impact stat" />
        </div>
        <Input name="summary" placeholder="Summary" />
        <Textarea name="description" placeholder="Description" />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="featured" />
          Feature this charity
        </label>
        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Saving..." : "Create charity"}
        </Button>
      </form>

      <div className="grid gap-4">
        {charities.map((charity) => (
          <form
            key={charity.id}
            className="grid gap-3 rounded-[28px] border border-[var(--color-line)] bg-white p-6"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const payload = {
                name: String(formData.get("name") ?? ""),
                slug: String(formData.get("slug") ?? ""),
                category: String(formData.get("category") ?? ""),
                location: String(formData.get("location") ?? ""),
                websiteUrl: String(formData.get("websiteUrl") ?? ""),
                summary: String(formData.get("summary") ?? ""),
                description: String(formData.get("description") ?? ""),
                impactStat: String(formData.get("impactStat") ?? ""),
                featured: Boolean(formData.get("featured")),
                active: Boolean(formData.get("active")),
              };
              startTransition(async () => {
                try {
                  await request(`/api/admin/charities/${charity.id}`, "PATCH", payload);
                  toast.success("Charity updated.");
                  window.location.reload();
                } catch (error) {
                  toast.error(error instanceof Error ? error.message : "Unable to update charity.");
                }
              });
            }}
          >
            <div className="grid gap-3 md:grid-cols-2">
              <Input name="name" defaultValue={charity.name} />
              <Input name="slug" defaultValue={charity.slug} />
              <Input name="category" defaultValue={charity.category} />
              <Input name="location" defaultValue={charity.location} />
              <Input name="websiteUrl" defaultValue={charity.website_url ?? ""} />
              <Input name="impactStat" defaultValue={charity.impact_stat} />
            </div>
            <Input name="summary" defaultValue={charity.summary} />
            <Textarea name="description" defaultValue={charity.description} />
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" name="featured" defaultChecked={charity.featured} />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" name="active" defaultChecked={charity.active} />
                Active
              </label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={isPending}>
                Save changes
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    try {
                      await fetch(`/api/admin/charities/${charity.id}`, { method: "DELETE" });
                      toast.success("Charity removed.");
                      window.location.reload();
                    } catch {
                      toast.error("Unable to delete charity.");
                    }
                  })
                }
              >
                Delete
              </Button>
            </div>
          </form>
        ))}
      </div>
    </div>
  );
}
