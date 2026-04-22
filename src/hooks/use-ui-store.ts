"use client";

import { create } from "zustand";

type UiStore = {
  mobileNavOpen: boolean;
  setMobileNavOpen: (open: boolean) => void;
  highlightedPlan: "monthly" | "yearly";
  setHighlightedPlan: (plan: "monthly" | "yearly") => void;
};

export const useUiStore = create<UiStore>((set) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  highlightedPlan: "yearly",
  setHighlightedPlan: (plan) => set({ highlightedPlan: plan }),
}));
