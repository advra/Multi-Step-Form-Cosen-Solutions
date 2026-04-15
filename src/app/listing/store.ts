"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  CategorySelectionSchema,
  FranchiseSelectionSchema,
  ProductSelectionSchema,
} from "@/features/listing/schema";

type ListingState = Partial<
  CategorySelectionSchema &
  FranchiseSelectionSchema &
  ProductSelectionSchema
> & {
  setData: (
    data: Partial<CategorySelectionSchema & FranchiseSelectionSchema & ProductSelectionSchema>
  ) => void;
};

export const useListingStore = create<ListingState>()(
  persist(
    (set) => ({
      setData: (data) => set(data),
    }),
    {
      name: "listing-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);