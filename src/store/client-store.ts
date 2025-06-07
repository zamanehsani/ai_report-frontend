import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface clientType {
  id?: string;
  officialName: string;
  phone: string;
  email: string;
  contactPerson: { name: string };
  address: string;
  password?: string;
  site?: string[];
}

export interface ClientStore {
  clients: clientType[];
  setClients: (obj: clientType[]) => void;
  removeClients: () => void;
  addClient: (site: clientType) => void;
  updateClient: (site: clientType) => void;
  deleteClient: (id: string) => void;
}

export const clientStore = create<ClientStore>()(
  devtools(
    persist(
      (set, get) => ({
        clients: [],
        setClients: (objects: clientType[]) => set({ clients: objects }),
        removeClients: () => set({ clients: [] }),
        addClient: (client: clientType) => set({ clients: [...get().clients, client] }),
        updateClient: (new_site: clientType) =>
          set({
            clients: get().clients.map((site_instance: clientType) =>
              site_instance.id === new_site.id ? new_site : site_instance
            ),
          }),
        deleteClient: (id: string) =>
          set({
            clients: get().clients.filter((site: clientType) => site.id !== id),
          }),
      }),
      { name: "ClientStore" }
    )
  )
);
