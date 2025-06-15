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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus, X } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useMemo } from "react";
import { clientStore } from "@/store/client-store";
import { type siteType, siteStore } from "@/store/site-store";
import { CreateClient } from "@/lib/client_utils";
import { useStore } from "@/store/use-store";
import { toast } from "sonner";

export default function NewUser() {
  const [officialName, setOfficialName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState<{ name: string }>({ name: "" });
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const sites = siteStore((state) => state.sites);
  const [selectedSites, setSelectedSites] = useState<siteType[]>([]);
  const [inputValue, setInputValue] = useState("");
  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const addClient = clientStore((state) => state.addClient);

  const handleUnselect = useCallback((site: siteType) => {
    setSelectedSites((prev) => prev.filter((s) => s.id !== site.id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && selectedSites.length > 0) {
        setSelectedSites((prev) => prev.slice(0, -1));
      }
    },
    [selectedSites]
  );

  const filteredSites = useMemo(
    () => sites.filter((site) => !selectedSites.includes(site)),
    [selectedSites]
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      officialName,
      email,
      phone,
      contactPerson,
      address,
      password,
      sites: selectedSites.map((site) => site.id),
    };

    const url = `${base_url}api/client/register/`;
    CreateClient({ data, url, token })
      .then((res) => {
        addClient(res.user);

        toast("Client Registered", {
          description: `${res.user?.officialName} has been created successfully.`,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
        setOpenDialog(false);
      })
      .catch((error) => {
        console.log("error happen: ", error);
        toast("Error!", {
          description: `${error}`,
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
          <Plus />
          Add A New Client
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Client</DialogTitle>
            <DialogDescription>Please enter the data nice and clean.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-4">
              <div className="grid gap-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  onChange={(e: any) => setOfficialName(e.target.value)}
                  type="text"
                  placeholder="ABC LLC CO"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="email" className="pb-1">
                    Email
                  </Label>
                  <Input
                    id="email"
                    onChange={(e: any) => setEmail(e.target.value)}
                    type="email"
                    placeholder="info@abc.com"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="pb-1">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    onChange={(e: any) => setPhone(e.target.value)}
                    type="text"
                    placeholder="+1(800)222-2222"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-1">
                <div className="w-full">
                  <Label htmlFor="selectSite" className="pb-1">
                    Select Site
                  </Label>
                  <Command className="overflow-visible" id="selectSite">
                    <div className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                      <div className="flex flex-wrap gap-2">
                        {selectedSites.map((site) => {
                          return (
                            <Badge
                              key={site.id}
                              variant="secondary"
                              className="border flex items-center">
                              {site.name}
                              <span
                                className="flex items-center justify-center size-4 text-muted-foreground hover:text-foreground ml-2 cursor-pointer"
                                onMouseDown={(e: any) => {
                                  e.preventDefault();
                                }}
                                onClick={() => {
                                  return handleUnselect(site);
                                }}>
                                <X />
                              </span>
                            </Badge>
                          );
                        })}
                        <CommandPrimitive.Input
                          onKeyDown={handleKeyDown}
                          onValueChange={setInputValue}
                          value={inputValue}
                          onBlur={() => setOpen(false)}
                          onFocus={() => setOpen(true)}
                          placeholder="Select Sites..."
                          className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                        />
                      </div>
                    </div>
                    <div className="relative mt-2">
                      <CommandList>
                        {open && !!filteredSites.length && (
                          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none">
                            <CommandGroup className="h-full overflow-auto">
                              {filteredSites.map((site) => {
                                return (
                                  <CommandItem
                                    key={site.id}
                                    onMouseDown={(e) => {
                                      e.preventDefault();
                                    }}
                                    onSelect={() => {
                                      setInputValue("");
                                      setSelectedSites((prev) => [...prev, site]);
                                    }}
                                    className={"cursor-pointer"}>
                                    {site.name}
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </div>
                        )}
                      </CommandList>
                    </div>
                  </Command>
                </div>
              </div>
              <div className="grid grid-cols-1 ">
                <Label htmlFor="contactPerson" className="pb-1">
                  Contact Manager
                </Label>
                <div className=" grap-3">
                  <Input
                    id="contactPerson"
                    onChange={(e: any) => setContactPerson({ name: e.target.value })}
                    type="text"
                    placeholder="John Due"
                    required
                  />
                </div>
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="address">Address</Label>
                </div>
                <Input
                  id="address"
                  placeholder="123st downtown NY"
                  onChange={(e: any) => setAddress(e.target.value)}
                  type="text"
                  required
                />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  onChange={(e: any) => setPassword(e.target.value)}
                  type="text"
                  required
                />
              </div>

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
            <Button type="submit">Save </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
