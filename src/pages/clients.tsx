import { DataTable } from "../components/data-table";
import { SectionCards } from "../components/section-cards";
import data from "../data.json";
import { Separator } from "@/components/ui/separator";

export default function Clients() {
  return (
    <div className="">
      <SectionCards />
      <Separator className="my-4" />
      <DataTable data={data} />
    </div>
  );
}
