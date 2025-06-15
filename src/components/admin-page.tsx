import { Link } from "react-router";
import { Plus } from "lucide-react";
import UserTable from "@/components/user/userlist";
export default function AdminPage() {
  return (
    <div className="flex flex-col px-3">
      <div className="flex justify-end py-4 pr-5">
        <Link to="/dashboard/add-user" className="flex gap-2">
          <Plus />
          Add A New User
        </Link>
      </div>

      <UserTable />
    </div>
  );
}
