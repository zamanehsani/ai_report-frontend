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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useStore, type userType } from "@/store/use-store";
import { toast } from "sonner";
import axios from "axios";

export default function PasswordUser({ user }: { user: userType }) {
  const [newPassword, setNewPassword] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);

  // Handler for editing a site (for now, just a placeholder)
  const handlePassUser = (e: any) => {
    e.preventDefault();
    const url = `${base_url}api/admin/reset-password`;
    const data = { newPassword, user_id: user.id };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        toast("Password Changed", {
          description: res?.data?.message || "Password updated successfully.",
          action: {
            label: "X",
            onClick: () => {},
          },
        });
        setOpenDialog(false);
      })
      .catch((err) => {
        toast("Error!", {
          description: err?.response?.data?.message || "Could not update the password.",
          action: {
            label: "X",
            onClick: () => {},
          },
        });
      });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => handlePassUser(e)}>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>Enter a new password</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-4">
            <div className="grid grid-cols-1 gap-3">
              <Input
                id="password"
                onChange={(e: any) => setNewPassword(e.target.value)}
                type="text"
                placeholder="A123123a@123"
                defaultValue={newPassword}
              />
            </div>
          </div>

          <Separator className="my-2" />
          <DialogFooter className="">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
