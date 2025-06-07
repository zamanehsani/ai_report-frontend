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
import { removePersonnel } from "@/lib/personnel_utils";
import { personnelStore } from "@/store/personnel-store";
import { toast } from "sonner";

export default function RemovePersonnel({ id }: { id: string }) {
  // Handler for removing a site
  const token = useStore((state) => state.token);
  const deletePersonnel = personnelStore((state) => state.deletePersonnel);
  const base_url = import.meta.env.VITE_BASE_URL || "/";

  const handleRemove = (id: string) => {
    const url = `${base_url}api/personnel/${id}`;
    removePersonnel(token, url)
      .then((res) => {
        deletePersonnel(id);
        toast("Personnel Removed", {
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
          <DialogDescription>Please confirm removing this personnel!</DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />
        <DialogFooter className="">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant={"destructive"} onClick={() => handleRemove(id)}>
            Yes, Remove{" "}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
