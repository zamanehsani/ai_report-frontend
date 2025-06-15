import { useEffect, useState } from "react";
import { personnelStore } from "@/store/personnel-store";
import { listPersonnel } from "@/lib/personnel_utils";
import NewPersonnel from "@/components/personnel/new_personnel";
import PersonnelCard from "@/components/personnel/personnel-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function Personnel() {
  const personnels = personnelStore((state) => state.personnels);
  const setPersonnels = personnelStore((state) => state.setPersonnels);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const base_url = import.meta.env.VITE_BASE_URL || "/";

  useEffect(() => {
    setLoading(true);
    listPersonnel(`${base_url}api/personnel/?page=${page}&pageSize=${pageSize}`)
      .then((res: any) => {
        setPersonnels(res.data.personnels);
        setTotalPages(Math.ceil(res.data.total / pageSize) || 1); // Set total pages from API
        setLoading(false);
      })
      .catch((err) => {
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

  return (
    <div className="flex flex-col justify-center sm:py-4 px-6 lg:px-8 max-w-screen-xl mx-auto gap-1">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className=" text-4xl sm:text-4xl font-bold tracking-tight"> Our Team</h2>
        <div className=" flex flex-col sm:flex-row-reverse sm:justify-center py-3">
          <NewPersonnel />
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ">
        {personnels &&
          personnels.length >= 1 &&
          personnels?.map((member) => <PersonnelCard key={member.id} member={member} />)}
      </div>
      <div className="flex justify-center py-2  mt-auto">
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
