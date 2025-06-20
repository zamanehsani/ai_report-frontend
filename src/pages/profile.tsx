import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import EditUser from "@/components/user/edit_user";
import { useStore } from "@/store/use-store";

export default function MyProfile() {
  // Example static user data
  const user = useStore((state) => state.user);
  console.log("user:", user);

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Card className="max-w-sm w-full">
        <CardHeader className="flex flex-col items-center">
          <img
            src={"https://randomuser.me/api/portraits/men/32.jpg"}
            alt={user.firstName}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200 mb-4"
          />
          <CardTitle className="text-xl">{user.firstName}</CardTitle>
          <Badge className="px-4 m-0 " variant={"outline"}>
            {user.userType}
          </Badge>
        </CardHeader>
        <div className="px-6 pb-6 space-y-2 text-center">
          <div className="text-gray-600">{user.email}</div>
          <div className="text-gray-600">{user.phone}</div>
          <div className="text-gray-600">{user.address}</div>
          <div className="mt-4">
            <div className="font-semibold">Associated Sites:</div>
            {/* <ul className="list-disc list-inside text-gray-700">
              {user.sites?.map((site: any) => (
                <li key={site}>{site}</li>
              ))}
            </ul> */}
          </div>
          <EditUser user={user} />
        </div>
      </Card>
    </div>
  );
}
