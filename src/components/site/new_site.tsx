import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { siteStore } from "@/store/site-store";
import { CreateSite } from "@/lib/utils";
import { toast } from "sonner";
import { clientStore } from "@/store/client-store";

export default function NewSite() {
  const clientsList = clientStore((state) => state.clients);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [location, setLocation] = useState("");
  const [clients, setClients] = useState([""]);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const addSite = siteStore((state) => state.addSite);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      name,
      address,
      location,
      isActive,
      clients,
    };
    const url = `${base_url}api/site/add`;
    CreateSite({ data, url, token })
      .then((res) => {
        // add to the store
        addSite(res.site);
        // show a toast on the dashboard
        toast("Site Created", {
          description: `${res.site?.name} has been created successfully.`,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
        setOpen(false);
      })
      .catch((err) => {
        // add toast here as well.
        console.log("error happen: ", err);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Plus />
          Add A New site
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Site</DialogTitle>
            <DialogDescription>Please enter the data nice and clean.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="grid col-span-2 gap-1">
                <Label htmlFor="name">Site Name</Label>
                <Input
                  id="name"
                  onChange={(e: any) => setName(e.target.value)}
                  type="text"
                  placeholder="SN002"
                  required
                />
              </div>
              <div className="grid gap-1">
                <Label htmlFor="selectSite">Select Client</Label>
                <Select
                  onValueChange={(value) => {
                    setClients([value]);
                  }}
                  value={clients[0] || ""}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>clients</SelectLabel>
                      {clientsList &&
                        clientsList.map((clnt) => (
                          <SelectItem key={clnt.id ?? ""} value={clnt.id ?? ""}>
                            {clnt.officialName}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="address">Address</Label>
              </div>
              <Input
                id="address"
                onChange={(e: any) => setAddress(e.target.value)}
                type="text"
                required
              />
            </div>

            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="location">Location Coordinate</Label>
              </div>
              <Input id="location" onChange={(e: any) => setLocation(e.target.value)} type="text" />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center font-medium mb-2">{error}</div>
            )}
          </div>

          <Separator className="my-2" />
          <DialogFooter className="">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="px-10">
              Register
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
