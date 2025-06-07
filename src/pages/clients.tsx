import ClientsTable from "@/components/client/table";
import NewClient from "@/components/client/new_client";

export default function Clients() {
  return (
    <div className="flex flex-col px-3">
      <div className="flex justify-end py-4">
        <NewClient />
      </div>

      <ClientsTable />
    </div>
  );
}
