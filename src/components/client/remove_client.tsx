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
import { useStore } from "@/store/use-store";
import { removeClient } from "@/lib/client_utils";
import { clientStore } from "@/store/client-store";
import { toast } from "sonner";

export default function RemoveClient({ id }: { id: string }) {
  // Handler for removing a site
  const token = useStore((state) => state.token);
  const deleteClient = clientStore((state) => state.deleteClient);
  const base_url = import.meta.env.VITE_BASE_URL || "/";

  const handleRemoveClient = (id: string) => {
    const url = `${base_url}api/client/${id}`;
    removeClient(token, url)
      .then((res) => {
        deleteClient(id);
        toast("Client Removed", {
          description: res.data?.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      })
      .catch(() => {
        toast("Error!", {
          description: "Could not remove this client. Please try again.",
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
          <DialogDescription>Please confirm removing this client!</DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />
        <DialogFooter className="">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => handleRemoveClient(id)}>Save </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
