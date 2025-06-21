import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import EditUser from "@/components/user/edit_user";
import { useStore } from "@/store/use-store";
import { use } from "react";

export default function MyProfile() {
  // Example static user data
  const user = useStore((state) => state.user);
  console.log("user:", user);

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <Card className="max-w-sm w-full">
        <CardHeader className="flex flex-col items-center">
          {/* <img
            src={"https://randomuser.me/api/portraits/men/32.jpg"}
            alt={user.firstName}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-4"
          /> */}
          <CardTitle className="text-xl">
            {[user.firstName, user.middleName, user.lastName]
              .filter(Boolean)
              .map((name: any) => name.charAt(0).toUpperCase() + name.slice(1).toLowerCase())
              .join("  ")}
          </CardTitle>
          <Badge className="px-4 m-0 " variant={"outline"}>
            {user.userType}
          </Badge>
        </CardHeader>
        <div className="px-6 pb-6 space-y-2 text-center">
          <div className="text-gray-600">{user.email}</div>
          <div className="text-gray-600">{user.phone}</div>
          <div className="text-gray-600">{user.address}</div>

          <EditUser source={"profile"} user={user} />
        </div>
      </Card>
    </div>
  );
}
