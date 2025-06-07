import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useState, useEffect } from "react";
import { clientStore } from "@/store/client-store";
import { listClient } from "@/lib/client_utils";
import EditClient from "./edit_client";
import RemoveClient from "./remove_client";
import { Badge } from "@/components/ui/badge";

export default function ClientTable() {
  const setClients = clientStore((state) => state.setClients);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const clients = clientStore((state) => state.clients);
  const base_url = import.meta.env.VITE_BASE_URL || "/";

  useEffect(() => {
    setLoading(true);

    listClient(`${base_url}api/client/?page=${page}&pageSize=${pageSize}`)
      .then((res: any) => {
        setClients(res.data.clients);
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
    <div className="w-full">
      <div className="w-full border rounded-md overflow-hidden">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400 mr-2"></span>
            <span>Loading...</span>
          </div>
        )}
        {!loading && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead> Manager Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Sites</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="odd:bg-muted/50">
                  <TableCell>{client.officialName}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.contactPerson?.name}</TableCell>
                  <TableCell>{client.address}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap max-w-[12rem] gap-2">
                      {client.sites?.map((site: any) => (
                        <Badge
                          className="p-1 px-2 hover:bg-muted"
                          variant={"outline"}
                          key={site.id}>
                          {site.name}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <EditClient client={client} />
                    {client.id && <RemoveClient id={client.id} />}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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
