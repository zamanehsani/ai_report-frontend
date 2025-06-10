import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface siteType {
  id: string;
  name: string;
  address: string;
  location: string;
  clients: string[];
  isActive: boolean;
}

export interface SiteStore {
  sites: siteType[];
  setSites: (obj: siteType[]) => void;
  removeSites: () => void;
  addSite: (site: siteType) => void;
  updateSite: (site: siteType) => void;
  deleteSite: (id: string) => void;
}

export const siteStore = create<SiteStore>()(
  devtools(
    persist(
      (set, get) => ({
        sites: [],
        setSites: (objects: siteType[]) => set({ sites: objects }),
        removeSites: () => set({ sites: [] }),
        addSite: (site: siteType) => set({ sites: [...get().sites, site] }),
        updateSite: (new_site: siteType) =>
          set({
            sites: get().sites.map((site_instance: siteType) =>
              site_instance.id === new_site.id ? new_site : site_instance
            ),
          }),
        deleteSite: (id: string) =>
          set({
            sites: get().sites.filter((site: siteType) => site.id !== id),
          }),
      }),
      { name: "SiteStore" }
    )
  )
);
