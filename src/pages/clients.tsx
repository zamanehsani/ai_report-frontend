import ClientsTable from "@/components/client/table";
import NewClient from "@/components/client/new_client";
import { useNavigate } from "react-router";
import { useStore } from "@/store/use-store";
import { useEffect } from "react";
export default function Clients() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user && user.userType === "personnel") {
      console.log("you do not have access to this page. ");
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  return (
    <div className="flex flex-col px-3">
      <div className="flex justify-end py-4">
        <NewClient />
      </div>

      <ClientsTable />
    </div>
  );
}
