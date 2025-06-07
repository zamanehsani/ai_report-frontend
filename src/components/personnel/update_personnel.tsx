import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { personnelStore, type personnelType } from "@/store/personnel-store";
import { editPersonnel } from "@/lib/personnel_utils";
import { toast } from "sonner";

export default function UpdatePersonnel({ personnel }: { personnel: personnelType }) {
  const [firstName, setFirstName] = useState(personnel.firstName);
  const [lastName, setLastName] = useState(personnel.middleName);
  const [middleName, setMiddleName] = useState(personnel.lastName);
  const [phone, setPhone] = useState(personnel.phone);
  const [email, setEmail] = useState(personnel.email);
  const [open, setOpen] = useState(false);

  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const upddatePersonnel = personnelStore((state) => state.updatePersonnel);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      firstName,
      middleName,
      lastName,
      email,
      phone,
    };
    const url = `${base_url}api/personnel/${personnel.id}`;
    editPersonnel({ data, url, token })
      .then((res) => {
        // add to the state and show a toast

        upddatePersonnel(res.user);
        toast(" Update", {
          description: res.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
        setOpen(false);
      })
      .catch((error) => {
        toast("Error", {
          description: error,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e: any) => handleSubmit(e)}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col gap-3 sm:flex-row ">
              <div className="flex-1 grid gap-1">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="flex-1 grid gap-1">
                <Label htmlFor="middleName">Middle Name</Label>
                <Input
                  id="middleName"
                  name="middleName"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                />
              </div>
              <div className="flex-1 grid gap-1">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 grid gap-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex-1 grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter className="mt-3">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
