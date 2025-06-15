import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type userType } from "@/store/use-store";
import { Link } from "react-router";
export function NavUser({ user }: { user: userType }) {
  const avatar = "/avatars/shadcn.jpg";

  return (
    <Link
      to="./profile"
      className="flex items-center bg-muted/30 rounded-xl hover:bg-muted gap-2 px-1 py-1.5 text-left text-sm">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarImage src={avatar} alt={user.lastName} />
        <AvatarFallback className="rounded-lg">
          {user.firstName?.charAt(0).toUpperCase()}
          {user.lastName?.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">
          {user.firstName} {user.lastName}
        </span>
        <span className="text-muted-foreground truncate text-xs">{user.email}</span>
      </div>
    </Link>
  );
}
