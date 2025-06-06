import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { useStore } from "@/store/use-store";
import { siteStore, type siteType } from "@/store/site-store";
import { listSites, removeSite, editSite } from "@/lib/utils";
import SiteItemCard from "@/components/site/site_item_card";
import NewSite from "@/components/site/new_site";
import { toast } from "sonner";

export default function Sites() {
  const setSites = siteStore((state) => state.setSites);
  const addSite = siteStore((state) => state.addSite);
  const updateSite = siteStore((state) => state.updateSite);
  const deleteSite = siteStore((state) => state.deleteSite);
  const [error, setError] = useState("");
  const token = useStore((state) => state.token);
  const sites = siteStore((state) => state.sites);
  const [loading, setLoading] = useState(false);
  const base_url = import.meta.env.VITE_BASE_URL || "/";

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

  // Handler for removing a site
  const handleRemoveSite = (id: string) => {
    const url = `${base_url}api/site/${id}`;
    removeSite(token, url)
      .then((res) => {
        deleteSite(id);
        toast("Site Removed", {
          description: res.data?.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      })
      .catch(() => {
        toast("Error!", {
          description: "Could not remove this site. Please try again.",
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      });
  };

  // Handler for editing a site (for now, just a placeholder)
  const handleEditSite = (site: siteType) => {
    // send to the backend and on ok, update the list here as well.
    const url = `${base_url}api/site/${site.id}`;
    editSite({ data: site, url, token })
      .then((res) => {
        updateSite(res.site);
        toast("Site Update", {
          description: res?.message,
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      })
      .catch(() => {
        toast("Error!", {
          description: "Could not update this site.",
          action: {
            label: "X",
            onClick: () => console.log("toast closed."),
          },
        });
      });
  };

  return (
    <div className="flex flex-col px-3">
      <div className="flex justify-end ">
        <NewSite />
      </div>
      <Separator className="my-4" />
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <span className="text-muted-foreground">Loading sites...</span>
          </div>
        ) : (
          sites?.map((site: siteType) => (
            <SiteItemCard
              key={site.id}
              site={site}
              onEdit={handleEditSite}
              onRemove={handleRemoveSite}
            />
          ))
        )}
      </div>
    </div>
  );
}
