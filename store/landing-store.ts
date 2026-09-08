"use client";

import { create } from "zustand";

export const PROVIDER_IDS = ["vercel", "netlify", "cloudflare"] as const;
export type ProviderId = (typeof PROVIDER_IDS)[number];

interface LandingState {
  activeProviderId: ProviderId;
  openFaqIndex: number | null;
  setActiveProviderId: (id: ProviderId) => void;
  toggleFaq: (index: number) => void;
}

export const useLandingStore = create<LandingState>((set) => ({
  activeProviderId: "vercel",
  openFaqIndex: null,
  setActiveProviderId: (activeProviderId) => set({ activeProviderId }),
  toggleFaq: (index) =>
    set((state) => ({
      openFaqIndex: state.openFaqIndex === index ? null : index,
    })),
}));