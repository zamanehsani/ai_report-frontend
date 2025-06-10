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
import { Edit, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useStore } from "@/store/use-store";
import { personnelStore, type personnelType } from "@/store/personnel-store";
import { editPersonnel } from "@/lib/personnel_utils";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { useCallback, useMemo } from "react";
import { type siteType, siteStore } from "@/store/site-store";

export default function UpdatePersonnel({ personnel }: { personnel: personnelType }) {
  const [firstName, setFirstName] = useState(personnel.firstName);
  const [lastName, setLastName] = useState(personnel.middleName);
  const [middleName, setMiddleName] = useState(personnel.lastName);
  const [phone, setPhone] = useState(personnel.phone);
  const [email, setEmail] = useState(personnel.email);

  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const sites = siteStore((state) => state.sites);
  const [selectedSites, setSelectedSites] = useState<any>(personnel.sites || []);
  const [inputValue, setInputValue] = useState("");

  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const upddatePersonnel = personnelStore((state) => state.updatePersonnel);

  const handleUnselect = useCallback((site: siteType) => {
    setSelectedSites((prev: any) => prev.filter((s: any) => s.id !== site.id));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && selectedSites.length > 0) {
        setSelectedSites((prev: any) => prev.slice(0, -1));
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
      firstName,
      middleName,
      lastName,
      email,
      phone,
      sites: selectedSites.map((site: any) => site.id),
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
        setOpenDialog(false);
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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e: any) => handleSubmit(e)}>
          <DialogHeader className="pb-4">
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
            <div className="grid gap-1">
              <div className="w-full">
                <Label htmlFor="selectSite" className="pb-1">
                  Selected Sites
                </Label>
                <Command className="overflow-visible" id="selectSite">
                  <div className="rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <div className="flex flex-wrap gap-2">
                      {selectedSites.map((site: any) => {
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
                                    setSelectedSites((prev: any) => [...prev, site]);
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
