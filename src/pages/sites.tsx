import { useState, useEffect } from "react";
import { useStore } from "@/store/use-store";
import { siteStore, type siteType } from "@/store/site-store";
import { listSites, removeSite, editSite } from "@/lib/utils";
import SiteItemCard from "@/components/site/site_item_card";
import NewSite from "@/components/site/new_site";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useNavigate } from "react-router";

import { Activity } from "lucide-react";
export default function Sites() {
  const setSites = siteStore((state) => state.setSites);
  const updateSite = siteStore((state) => state.updateSite);
  const deleteSite = siteStore((state) => state.deleteSite);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1); // Add totalPages state

  const token = useStore((state) => state.token);
  const sites = siteStore((state) => state.sites);

  const base_url = import.meta.env.VITE_BASE_URL || "/";

  const navigate = useNavigate();
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (user && user.userType === "personnel") {
      console.log("you do not have access to this page. ");
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);

    listSites(`${base_url}api/site/?page=${page}&pageSize=${pageSize}`)
      .then((res: any) => {
        // Assuming API returns total count of sites
        setSites(res.data.sites);
        setTotalPages(Math.ceil(res.data.total / pageSize) || 1); // Set total pages from API
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch sites.");
        setLoading(false);
      });
  }, [page, pageSize]); // Add page and pageSize as dependencies

  // Helper to generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxShown = 5; // How many page numbers to show around current
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (page <= 3) {
      end = Math.min(totalPages, maxShown);
    }

    if (page >= totalPages - 2) {
      start = Math.max(1, totalPages - maxShown + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
  };

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
    <div className="flex flex-col px-3 h-full">
      <div className="flex justify-end sticky top-0 z-10 bg-white dark:bg-background py-2">
        <NewSite />
      </div>

      <div className=" *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @6xl/main:grid-cols-3 overflow-y-auto max-h-[80vh] py-3">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-10">
            <span className="text-muted-foreground">Loading sites...</span>
          </div>
        ) : sites && sites.length === 0 ? (
          <div className="col-span-full flex flex-col gap-y-5 justify-center items-center py-10">
            <Activity className="size-24" />
            <span className="text-muted-foreground">No sites.</span>
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
      <div className="flex justify-center py-2  mt-auto">
        {/* Dynamic Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="default"
                href="#"
                onClick={() => handlePageChange(page - 1)}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {getPageNumbers()[0] > 1 && (
              <>
                <PaginationItem>
                  <PaginationLink size="default" href="#" onClick={() => handlePageChange(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                {getPageNumbers()[0] > 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}
            {getPageNumbers().map((num) => (
              <PaginationItem key={num}>
                <PaginationLink
                  size="default"
                  href="#"
                  onClick={() => handlePageChange(num)}
                  isActive={num === page}>
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}
            {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
              <>
                {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink
                    size="default"
                    href="#"
                    onClick={() => handlePageChange(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}
            <PaginationItem>
              <PaginationNext
                size="default"
                href="#"
                onClick={() => handlePageChange(page + 1)}
                aria-disabled={page === totalPages}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
