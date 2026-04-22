import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { isMockMode } from "@/lib/env";
import { mockAdminUser, mockUser } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import type { AppUser } from "@/lib/types";

export async function getSessionUser() {
  if (isMockMode) {
    const cookieStore = await cookies();
    const role = cookieStore.get("mock_auth_role")?.value;
    const currentUser = role === "admin" ? mockAdminUser : mockUser;

    return {
      id: currentUser.id,
      email: currentUser.email,
      user_metadata: { full_name: currentUser.full_name },
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function requireUser() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function getProfile(userId?: string) {
  if (isMockMode) {
    const cookieStore = await cookies();
    const role = cookieStore.get("mock_auth_role")?.value;
    if (role === "admin" || userId === mockAdminUser.id) return mockAdminUser;
    return mockUser;
  }

  const supabase = await createClient();
  const targetUserId = userId ?? (await requireUser()).id;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", targetUserId)
    .single<AppUser>();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function requireAdmin() {
  if (isMockMode) {
    return mockAdminUser;
  }

  const profile = await getProfile();

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return profile;
}
