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
import { useStore, type userType } from "@/store/use-store";
import { listUser } from "@/lib/user_admin_utils";

import EditUser from "./edit_user";
import RemoveUser from "./remove_user";
import { Badge } from "@/components/ui/badge";

import { toast } from "sonner";
import { editUser } from "@/lib/user_admin_utils";
import { useNavigate } from "react-router";

export default function UserTable() {
  const setUsers = useStore((state) => state.setUsers);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const updateUsers = useStore((state) => state.updateUsers);
  const users = useStore((state) => state.users);
  const base_url = import.meta.env.VITE_BASE_URL || "/";
  const token = useStore((state) => state.token);
  const user = useStore((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.userType !== "admin") {
      console.log("user is not admin and redirecting back to dashabord");
      navigate("/dashboard", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    setLoading(true);

    listUser(`${base_url}api/admin/list?page=${page}&pageSize=${pageSize}`)
      .then((res: any) => {
        setUsers(res.data.users);

        setTotalPages(Math.ceil(res.data.total / pageSize) || 1); // Set total pages from API
        setLoading(false);
      })
      .catch((err) => {
        console.log("error while listing users..", err);
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

  const handleStatusChange = (user: userType) => {
    const base_url = import.meta.env.VITE_BASE_URL || "/";
    const url = `${base_url}api/admin/${user.id}`;
    if (user) {
      editUser({ data: { ...user, isActive: !user.isActive }, url, token })
        .then((res) => {
          updateUsers(res.user);
          toast("Client Update", {
            description: res?.message,
            action: {
              label: "X",
              onClick: () => console.log("toast closed."),
            },
          });
        })
        .catch(() => {
          toast("Error!", {
            description: "Could not update this client.",
            action: {
              label: "X",
              onClick: () => console.log("toast closed."),
            },
          });
        });
    }
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
                <TableHead> User Type</TableHead>

                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} className="odd:bg-muted/50">
                  <TableCell>
                    {user.firstName} {user.middleName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.userType}</TableCell>

                  <TableCell>
                    <div className="flex flex-wrap max-w-[12rem] gap-2">
                      <Badge
                        onClick={() => handleStatusChange(user)}
                        className="p-1 px-2 hover:bg-muted"
                        variant={"outline"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <EditUser user={user} />
                    {user.id && <RemoveUser id={user.id} />}
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
