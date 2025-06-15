import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { removeUser } from "@/lib/user_admin_utils";
import { useStore } from "@/store/use-store";
import { toast } from "sonner";

export default function RemoveUser({ id }: { id: string }) {
  // Handler for removing a site
  const token = useStore((state) => state.token);
  const deleteUsers = useStore((state) => state.deleteUsers);
  const base_url = import.meta.env.VITE_BASE_URL || "/";

  const handleRemoveUser = (id: string) => {
    const url = `${base_url}api/admin/${id}`;
    removeUser(token, url)
      .then((res) => {
        deleteUsers(id);
        toast("User Removed", {
          description: <span className="text-slate-800">{res.data?.message}</span>,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      })
      .catch(() => {
        toast("Error!", {
          description: "Could not remove this user. Please try again.",
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-red-500 hover:bg-red-200 hover:text-red-700 font-semibold">
          <Trash />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure? </DialogTitle>
          <DialogDescription>Please confirm removing this user!</DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />
        <DialogFooter className="">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={() => handleRemoveUser(id)}>
            Yes, Remove{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
