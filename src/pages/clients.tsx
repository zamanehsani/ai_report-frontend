import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MoreHorizontalIcon, Mail, Phone, Trash, Edit, Plus } from "lucide-react";

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
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Clients() {
  const clients = [
    {
      id: "12343b2b342",
      officialName: "Security Corps",
      contactPerson: "Basir Aria",
      address: "Dallas,123 st,Dubai, USA",
      email: "information@gmail.com",
      phone: "+1(800)222-2222",
    },
  ];
  const [officialName, setOfficialName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [sites, setSites] = useState([]);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    console.log("");
  };
  return (
    <div className="flex flex-col px-3">
      <div className="flex justify-end ">
        <Dialog>
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
                      placeholder="Jahn Due"
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
                        placeholder="m@example.com"
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

                  <div className="grid grid-cols-2 gap-2">
                    <div className=" grap-3">
                      <Label htmlFor="contactPerson" className="pb-1">
                        Contact Manager
                      </Label>
                      <Input
                        id="contactPerson"
                        onChange={(e: any) => setContactPerson(e.target.value)}
                        type="text"
                        placeholder="John Due"
                        required
                      />
                    </div>
                    <div className=" ">
                      <Label htmlFor="password" className="pb-1">
                        Password
                      </Label>
                      <Input
                        id="password"
                        onChange={(e: any) => setPassword(e.target.value)}
                        type="password"
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
                      onChange={(e: any) => setAddress(e.target.value)}
                      type="text"
                      required
                    />
                  </div>

                  <div className="grid gap-1">
                    <div className="flex items-center">
                      <Label>Select Site</Label>
                    </div>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Site" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">AB001</SelectItem>
                        <SelectItem value="dark">AB002</SelectItem>
                        <SelectItem value="system">AB003</SelectItem>
                      </SelectContent>
                    </Select>
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
        <Card className="w-full gap-0 py-0">
          <CardHeader className="flex flex-row items-center py-2 justify-between ">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={"/avatars/shadcn.jpg"} alt="user.lastName" />
                <AvatarFallback className="rounded-full">
                  {"Company Name"?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-0.5">
                <h6 className="text-sm leading-none font-medium">Company Name</h6>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <MoreHorizontalIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg">
                <DropdownMenuItem>
                  <Edit />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Trash />
                  Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-muted border-y" />
            <div className="pt-3 pb-4 px-6">
              <h2 className="font-semibold">John Due Smith</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                2841 West Side Avenue, Fort Lee, New Jersey,
                <span className="text-blue-500"> info@gmail.com </span>
                <span className="text-blue-500"> +1(800)222-2222</span>
              </p>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-around">
            <Button variant="ghost" className="text-muted-foreground">
              <Mail />{" "}
              <a href={`mailto:${"info@gmail.com"}`} className="hidden sm:inline">
                Email
              </a>
            </Button>

            <Button variant="ghost" className="text-muted-foreground">
              <Phone />{" "}
              <a href={`tel:${"0566652534"}`} className="hidden sm:inline">
                Phone
              </a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
