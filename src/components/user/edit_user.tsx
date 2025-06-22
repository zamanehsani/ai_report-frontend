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
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import { useState } from "react";
import { useStore, type userType } from "@/store/use-store";
import { toast } from "sonner";
import { editUser } from "@/lib/user_admin_utils";

export default function EditUser({ user, source = "default" }: { user: userType; source: string }) {
  const [first_name, setFirst_name] = useState(user.firstName);
  const [middle_name, setMiddle_name] = useState(user.middleName);
  const [last_name, setLast_name] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [secondary_name, setSecondaryName] = useState(user.secondary_name);
  const [secondary_email, setSecondaryEmail] = useState(user.secondary_email);
  const [secondary_phone, setSecondaryPhone] = useState(user.secondary_phone);
  const [isActive] = useState(user.isActive);
  const [userType] = useState(user.userType);
  const [address, setAddress] = useState(user.address);
  const [error] = useState("");
  const [note, setNote] = useState(user.note);
  const [openDialog, setOpenDialog] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const updateUsers = useStore((state) => state.updateUsers);
  const updateUser = useStore((state) => state.updateUser);

  // Handler for editing a site (for now, just a placeholder)
  const handleEditUser = (e: any) => {
    e.preventDefault();
    const url = `${base_url}api/admin/${user.id}`;
    const data = {
      firstName: first_name,
      lastName: last_name,
      middleName: middle_name,
      email,
      phone,
      address,
      isActive,
      userType,
      secondary_email,
      secondary_name,
      secondary_phone,
      note,
    };

    editUser({ data: data, url, token })
      .then((res) => {
        if (source === "profile") {
          updateUser(res.user);
        } else {
          updateUsers(res.user);
        }

        toast("Client Update", {
          description: res?.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
        setOpenDialog(false);
      })
      .catch(() => {
        toast("Error!", {
          description: "Could not update this client.",
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      });
  };

  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e) => handleEditUser(e)}>
          <DialogHeader>
            <DialogTitle>Update User</DialogTitle>
            <DialogDescription>Please enter any changes here and hit Save.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-6 py-4">
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="name">First Name</Label>
                <Input
                  id="name"
                  onChange={(e: any) => setFirst_name(e.target.value)}
                  type="text"
                  placeholder="ABC LLC CO"
                  defaultValue={first_name}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="middleName">Middel Name</Label>
                <Input
                  id="middleName"
                  onChange={(e: any) => setMiddle_name(e.target.value)}
                  type="text"
                  placeholder="ABC LLC CO"
                  defaultValue={middle_name}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  onChange={(e: any) => setLast_name(e.target.value)}
                  type="text"
                  placeholder="ABC LLC CO"
                  defaultValue={last_name}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="grid gap-1">
                <Label htmlFor="secondary_email">Emergency Contact</Label>
                <Input
                  id="secondary_email"
                  onChange={(e: any) => setSecondaryEmail(e.target.value)}
                  type="email"
                  placeholder="abc@gmail.com"
                  defaultValue={secondary_email}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="secondary_phone">Emergency Phone</Label>
                <Input
                  id="secondary_phone"
                  onChange={(e: any) => setSecondaryPhone(e.target.value)}
                  type="text"
                  placeholder="+123454343"
                  defaultValue={secondary_phone}
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="scondary_name">Emergency Name</Label>
                <Input
                  id="scondary_name"
                  onChange={(e: any) => setSecondaryName(e.target.value)}
                  type="text"
                  placeholder="Mohammad"
                  defaultValue={secondary_name}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="email" className="pb-1">
                  Email
                </Label>
                <Input
                  defaultValue={email}
                  id="email"
                  onChange={(e: any) => setEmail(e.target.value)}
                  type="email"
                  placeholder="info@abc.com"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="pb-1">
                  Phone
                </Label>
                <Input
                  id="phone"
                  defaultValue={phone}
                  onChange={(e: any) => setPhone(e.target.value)}
                  type="text"
                  placeholder="+1(800)222-2222"
                />
              </div>
            </div>
            <div className="grid ">
              <Label htmlFor="address">Address</Label>
              <Input
                defaultValue={address}
                id="address"
                placeholder="123st downtown NY"
                onChange={(e: any) => setAddress(e.target.value)}
                type="text"
              />
            </div>
            <div>
              <Textarea
                placeholder="Type your message here."
                onChange={(e) => setNote(e.target.value)}
                defaultValue={note}
              />
            </div>
            <div>
              {error && (
                <div className="text-red-500 text-sm text-center font-medium mb-2">{error}</div>
              )}
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
