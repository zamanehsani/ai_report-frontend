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
  addSite: (site: siteType) => void;
  updateSite: (site: siteType) => void;
  deleteSite: (id: string) => void;
}

export const siteStore = create<SiteState>()(
  devtools(
    persist(
      (set, get) => ({
        sites: [],
        setSites: (objects) => set({ sites: objects }),
        removeSites: () => set({ sites: [] }),
        addSite: (site) => set({ sites: [...get().sites, site] }),
        updateSite: (new_site) =>
          set({
            sites: get().sites.map((site_instance) =>
              site_instance.id === new_site.id ? new_site : site_instance
            ),
          }),
        deleteSite: (id) =>
          set({
            sites: get().sites.filter((site) => site.id !== id),
          }),
      }),
      { name: "SiteStore" }
    )
  )
);
