import { OnboardingSchema } from "@/features/onboarding/schema";
import { create } from "zustand";

type OnboardingState = Partial<OnboardingSchema> & {
  setData: (data: Partial<OnboardingSchema>) => void;
}

export const useOnboardingStore = create<OnboardingState>((set)=>({
  setData: (data) => set(data),
}));