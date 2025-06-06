import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash, Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { type siteType } from "@/store/site-store";
export default function SiteItemCard({
  site,
  onEdit,
  onRemove,
}: {
  site: siteType;
  onEdit: (site: siteType) => void;
  onRemove: (id: string) => void;
}) {
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
        <Button variant="ghost" className="text-muted-foreground" onClick={() => onEdit(site)}>
          <Edit />
          <span className="hidden sm:inline">Edit</span>
        </Button>
        <Button variant="ghost" className="text-red-400" onClick={() => onRemove(site.id)}>
          <Trash />
          <span className="hidden sm:inline">Remove</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
