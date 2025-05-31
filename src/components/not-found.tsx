import { GalleryVerticalEnd } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-muted flex min-h-90 flex-col border-4 items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6 center">
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Nothing to show here...
      </div>
    </div>
  );
}
