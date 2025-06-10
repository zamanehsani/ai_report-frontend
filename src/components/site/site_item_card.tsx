import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
import { useState } from "react";
import { clientStore } from "@/store/client-store";

export default function SiteItemCard({
  site,
  onEdit,
  onRemove,
}: {
  site: siteType;
  onEdit: (site: siteType) => void;
  onRemove: (id: string) => void;
}) {
  const clientsList = clientStore((state) => state.clients);
  const [name, setName] = useState(site.name);
  const [address, setAddress] = useState(site.address);
  const [location, setLocation] = useState(site.location);
  const [clientId, setClientId] = useState("");
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
            <span className="text-xs font-light text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block">
              {site.clients?.map((client: any) => {
                return <span className="pr-1">{client.officialName}</span>;
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
        <div className="px-2">
          <span className="text-xs font-light text-muted-foreground leading-tight">
            {site.address}
          </span>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-around">
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
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid col-span-2 gap-1">
                    <Label htmlFor="name">Site Name</Label>
                    <Input
                      id="name"
                      onChange={(e: any) => setName(e.target.value)}
                      type="text"
                      value={name}
                      placeholder="SN002"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor="selectSite">Select Client</Label>
                    <Select
                      onValueChange={(value) => {
                        setClientId(value);
                      }}
                      // @ts-ignore
                      defaultValue={site?.clients[0]?.id}>
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
                      clients: [clientId],
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
              <Button variant="destructive" onClick={() => onRemove(site.id)}>
                Yes, Remove
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
