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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useStore } from "@/store/use-store";
import { personnelStore } from "@/store/personnel-store";
import { CreatePersonnel } from "@/lib/personnel_utils";
import { toast } from "sonner";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCallback, useMemo } from "react";
import { type siteType, siteStore } from "@/store/site-store";

export default function NewPersonnel() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [phone, setPhone] = useState("");
  const [second_email, setSecondEmail] = useState("");
  const [second_phone, setSecondPhone] = useState("");
  const [second_name, setSecondName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const sites = siteStore((state) => state.sites);
  const [selectedSites, setSelectedSites] = useState<siteType[]>([]);
  const [inputValue, setInputValue] = useState("");

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

  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const addPersonnel = personnelStore((state) => state.addPersonnel);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      firstName,
      middleName,
      lastName,
      email,
      phone,
      password,
      sites: selectedSites.map((site) => site.id),
    };
    const url = `${base_url}api/personnel/register/`;
    CreatePersonnel({ data, url, token })
      .then((res) => {
        // add to the state and show a toast

        addPersonnel(res.user);
        toast("Personnel Registered", {
          description: res.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
        setOpenDialog(false);
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
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">Register New Personnel</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={(e: any) => handleSubmit(e)}>
          <DialogHeader className="pb-4">
            <DialogTitle>New profile</DialogTitle>
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
                  // value={firstName}
                  required
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
                  required
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 grid gap-1">
                <Label htmlFor="phone">Primary Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={phone}
                  required
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="flex-1 grid gap-1">
                <Label htmlFor="email">Primary Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 grid gap-1">
                <Label htmlFor="secondary_phone">Secondary Phone</Label>
                <Input
                  id="secondary_phone"
                  name="phsecondary_phoneone"
                  value={second_phone}
                  required
                  onChange={(e) => setSecondPhone(e.target.value)}
                />
              </div>
              <div className="flex-1 grid gap-1">
                <Label htmlFor="second_email">Secondary Email</Label>
                <Input
                  id="second_email"
                  name="second_email"
                  type="email"
                  value={second_email}
                  required
                  onChange={(e) => setSecondEmail(e.target.value)}
                />
              </div>
              <div className="flex-1 grid gap-1">
                <Label htmlFor="second_name">Secondary Name</Label>
                <Input
                  id="second_name"
                  name="second_name"
                  type="text"
                  value={second_name}
                  required
                  onChange={(e) => setSecondName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1">
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
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="text"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
