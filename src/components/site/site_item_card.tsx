import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Trash, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type siteType } from "@/store/site-store";
import { useEffect, useState } from "react";
import { useStore, type userType } from "@/store/use-store";

export default function SiteItemCard({
  site,
  onEdit,
  onRemove,
  clientList,
  personnelList,
}: {
  site: siteType;
  onEdit: (site: siteType) => void;
  onRemove: (id: string) => void;
  clientList: userType[];
  personnelList: userType[];
}) {
  const user = useStore((state) => state.user);
  const [name, setName] = useState(site.name);
  const [address, setAddress] = useState(site.address);
  const [location, setLocation] = useState(site.location);
  const [newClient, setNewClient] = useState<userType | null>(site.clients?.[0] ?? null);
  const [newPersonnel, setNewPersonnel] = useState<userType | null>(site.personnels?.[0] ?? null);

  useEffect(() => {
    return () => {};
  });
  return (
    <Card key={site.id} className="w-full gap-0 py-0">
      <CardHeader className="flex flex-row items-center py-2 justify-between ">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-lg grayscale">
            <AvatarImage src={"/avatars/shadcn.jpg"} alt={site.name} />
            <AvatarFallback className="rounded-full">
              {site.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <h6 className="text-sm leading-none font-bold">{site.name.toUpperCase()}</h6>
            <span className="text-xs font-light text-muted-foreground whitespace-nowrap overflow-hidden  block">
              {site.clients?.map((client: any) => {
                return (
                  <span key={client.id + site.id} className="pr-1">
                    {client.email}
                  </span>
                );
              })}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video border-y">
          {site.location ? (
            <iframe
              title="Site Location"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 180, width: "100%" }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                site.location
              )}&output=embed`}></iframe>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[180px] text-muted-foreground text-sm">
              Location is missing
            </div>
          )}
        </div>
        <div className="px-2 py-2">
          <span className=" font-light text-muted-foreground leading-tight">{site.address}</span>
        </div>
      </CardContent>

      <CardFooter className="flex justify-around">
        {user.userType === "admin" && (
          <>
            <Dialog>
              {/* // onEdit({ ...site, name, address, location }); */}
              <form onSubmit={(e) => e.preventDefault()}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="text-muted-foreground">
                    <Edit />
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                  {/* <Button variant="outline">Open Dialog</Button> */}
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit site - [{name}]</DialogTitle>
                    <DialogDescription>
                      Make changes here. Click save when you&apos;re done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-6 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-1">
                        <Label htmlFor="name">Site Name</Label>
                        <Input
                          id="name"
                          onChange={(e: any) => setName(e.target.value)}
                          type="text"
                          value={name}
                          placeholder="SN002"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="pb-2">Select Personnel</Label>
                        <Select
                          value={newPersonnel?.id || ""}
                          onValueChange={(value) => {
                            const selected =
                              personnelList.find((item) => item.id === value) || null;
                            setNewPersonnel(selected);
                          }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Personnel" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>personnel</SelectLabel>
                              {personnelList.map((item: userType) => (
                                <SelectItem key={item.id ?? ""} value={item.id ?? ""}>
                                  {item.firstName} {item.lastName}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="pb-2">Select Client</Label>
                        <Select
                          value={newClient?.id || ""}
                          onValueChange={(value) => {
                            const selected = clientList.find((item) => item.id === value) || null;
                            setNewClient(selected);
                          }}>
                          <SelectTrigger className="w-ful">
                            <SelectValue placeholder="Select Client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>clients</SelectLabel>
                              {clientList.map((item: userType) => (
                                <SelectItem key={item.id ?? ""} value={item.id ?? ""}>
                                  {item.firstName} {item.lastName}
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
                        value={address}
                        onChange={(e: any) => setAddress(e.target.value)}
                        type="text"
                      />
                    </div>

                    <div className="grid gap-1">
                      <div className="flex items-center">
                        <Label htmlFor="location">Location Coordinate</Label>
                      </div>
                      <Input
                        id="location"
                        value={location}
                        onChange={(e: any) => setLocation(e.target.value)}
                        type="text"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button
                      onClick={() =>
                        onEdit({
                          ...site,
                          name,
                          address,
                          location,
                          clients: newClient ? [newClient] : [],
                          personnels: newPersonnel ? [newPersonnel] : [],
                        })
                      }
                      type="submit">
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-red-400">
                  <Trash />
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to remove <span className="font-bold">{site.name}</span>?
                  </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={() => site.id && onRemove(site.id)}
                    disabled={!site.id}>
                    Yes, Remove
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}
      </CardFooter>
    </Card>
  );
}
