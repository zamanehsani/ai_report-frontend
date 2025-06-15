import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface personnelType {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  second_name?: string;
  second_email?: string;
  second_phone?: string;
  imageUrl?: string;
  photoUrl?: string;
  password?: string;
  sites?: string[];
}

export interface PersonnelStoreProp {
  personnels: personnelType[];
  setPersonnels: (obj: personnelType[]) => void;
  removePersonnels: () => void;
  addPersonnel: (site: personnelType) => void;
  updatePersonnel: (site: personnelType) => void;
  deletePersonnel: (id: string) => void;
}

export const personnelStore = create<PersonnelStoreProp>()(
  devtools(
    persist(
      (set, get) => ({
        personnels: [],
        setPersonnels: (objects: personnelType[]) => set({ personnels: objects }),
        removePersonnels: () => set({ personnels: [] }),
        addPersonnel: (personnel: personnelType) =>
          set({ personnels: [...get().personnels, personnel] }),
        updatePersonnel: (new_obj: personnelType) =>
          set({
            personnels: get().personnels.map((instance: personnelType) =>
              instance.id === new_obj.id ? new_obj : instance
            ),
          }),
        deletePersonnel: (id: string) =>
          set({
            personnels: get().personnels.filter((personnel: personnelType) => personnel.id !== id),
          }),
      }),
      { name: "PersonnelStore" }
    )
  )
);
