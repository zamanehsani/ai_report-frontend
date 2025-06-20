import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface reportType {
  id?: string;
  date?: string;
  user?: string;
  site?: string;
  file?: File | null | undefined;
  image?: File | null | undefined;
  voice?: File | null | undefined;
}

export interface ReportStore {
  reports: reportType[];
  setReport: (obj: reportType[]) => void;
  removeReport: () => void;
  addReport: (site: reportType) => void;
  updateReport: (site: reportType) => void;
  deleteReport: (id: string) => void;
}

export const reportStore = create<ReportStore>()(
  devtools(
    persist(
      (set, get) => ({
        reports: [],
        setReport: (objects: reportType[]) => set({ reports: objects }),
        removeReport: () => set({ reports: [] }),
        addReport: (rep: reportType) => set({ reports: [...get().reports, rep] }),
        updateReport: (new_report: reportType) =>
          set({
            reports: get().reports.map((report_instance: reportType) =>
              report_instance.id === new_report.id ? new_report : report_instance
            ),
          }),
        deleteReport: (id: string) =>
          set({
            reports: get().reports.filter((site: reportType) => site.id !== id),
          }),
      }),
      { name: "ReportStore" }
    )
  )
);
