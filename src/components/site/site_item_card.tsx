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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type siteType } from "@/store/site-store";
import { useState } from "react";
export default function SiteItemCard({
  site,
  onEdit,
  onRemove,
}: {
  site: siteType;
  onEdit: (site: siteType) => void;
  onRemove: (id: string) => void;
}) {
  const [name, setName] = useState(site.name);
  const [address, setAddress] = useState(site.address);
  const [location, setLocation] = useState(site.location);

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
            <span
              className="text-xs font-light text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block"
              title={site.address}>
              {site.address}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative aspect-video border-y">
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
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    name="name"
                    defaultValue={name}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    onChange={(e) => setAddress(e.target.value)}
                    id="address"
                    name="address"
                    defaultValue={address}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="location">Location Cordinates</Label>
                  <Input
                    onChange={(e) => setLocation(e.target.value)}
                    id="location"
                    name="location"
                    defaultValue={location}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={() => onEdit({ ...site, name, address, location })} type="submit">
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
