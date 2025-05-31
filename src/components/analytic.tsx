import { ChartAreaInteractive } from "./chart-area-interactive";
import { DataTable } from "./data-table";
import { SectionCards } from "./section-cards";
import data from "../data.json";

export default function Analytic() {
  return (
    <>
      <SectionCards />
      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>
      <DataTable data={data} />
    </>
  );
}
