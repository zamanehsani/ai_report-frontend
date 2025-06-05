import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash, Edit, Plus } from "lucide-react";

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
import { useState, useEffect } from "react";
import { useStore } from "@/store/use-store";
import { siteStore } from "@/store/site-store";
import { CreateSite } from "@/lib/utils";
import { listSites } from "@/lib/utils";

export default function Sites() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [location, setLocation] = useState("");
  const [clientId, setClientId] = useState("cmbc4ru3k0000t2128d7wqckd");
  const [error, setError] = useState("");

  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const sites = siteStore((state) => state.sites);
  const setSites = siteStore((state) => state.setSites);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    const data = {
      name,
      address,
      location,
      isActive,
      clientId,
    };
    const url = `${base_url}api/site/add`;
    CreateSite({ data, url, token })
      .then((res) => {
        console.log("ResS:", res);
      })
      .catch((err) => {
        console.log("error happen: ", err);
      });
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    listSites(`${base_url}api/site/`)
      .then((res: any) => {
        console.log("list of sites: ", res.data.sites);
        setSites(res.data.sites);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch sites.");
        setLoading(false);
      });
    console.log("got it: ", sites);
  }, []);

  return (
    <div className="flex flex-col px-3">
      <div className="flex justify-end ">
        <Dialog>
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
                <div className="grid gap-4">
                  <div className="grid gap-1">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      onChange={(e: any) => setName(e.target.value)}
                      type="text"
                      placeholder="Jahn Due"
                      required
                    />
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
                    <Input
                      id="location"
                      onChange={(e: any) => setLocation(e.target.value)}
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
      </div>
      <Separator className="my-4" />
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <span className="text-muted-foreground">Loading sites...</span>
          </div>
        ) : (
          sites?.map((site) => (
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
                    <h6 className=" leading-none font-medium">{site.name}</h6>
                    <span
                      className="text-xs font-light text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block"
                      title={site.address}>
                      {site.address}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted border-y">
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
                <Button variant="ghost" className="text-muted-foreground">
                  <Edit />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button variant="ghost" className="text-red-400">
                  <Trash />
                  <span className="hidden sm:inline">Remove</span>
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
