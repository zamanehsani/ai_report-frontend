import { Link } from "react-router";
import { Plus } from "lucide-react";
import UserTable from "@/components/user/userlist";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useStore } from "@/store/use-store";

export default function AdminPage() {
  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user && user.userType !== "admin") {
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

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
