import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { Link } from "react-router";
export default function AReport({ item }: { item: any }) {
  const base_url = import.meta.env.VITE_BASE_URL;
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: false, // use `true` if you want AM/PM format
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 border rounded-lg my-1">
      <div className="flex flex-col gap-1">
        <h3 className="">
          {item.createdAt && new Date(item.createdAt).toLocaleString("en-US", options)}
        </h3>
        <p className="text-sm text-muted-foreground">{item.category}</p>
      </div>
      <img src={`${base_url.replace(/\/$/, "")}${item.image}`} width={40} className="border" />
      <Button variant="outline" asChild>
        <Link
          target="__blank"
          to={`${base_url.replace(/\/$/, "")}${item.pdfUrl}`}
          className="order-3 ml-auto w-fit gap-2 md:order-none">
          <span>View Report</span>
          <File className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
