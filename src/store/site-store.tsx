import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface siteType {
  id: string;
  name: string;
  address: string;
  location: string;
  isActive: boolean;
}

export interface SiteState {
  sites: siteType[];
  setSites: (obj: siteType[]) => void;
  removeSites: () => void;
}

export const siteStore = create<SiteState>()(
  devtools(
    persist(
      (set) => ({
        sites: [],
        setSites: (objects) => set({ sites: objects }),
        removeSites: () => set({ sites: [] }),
      }),
      { name: "SiteStore" }
    )
  )
);
