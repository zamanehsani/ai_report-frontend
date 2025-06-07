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
const products = [
  {
    id: 101,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 59.99,
    rating: 4.5,
  },
  {
    id: 102,
    name: "Yoga Mat",
    category: "Sports & Fitness",
    price: 25.0,
    rating: 4.8,
  },
  {
    id: 103,
    name: "Coffee Maker",
    category: "Home Appliances",
    price: 80.0,
    rating: 4.2,
  },
  {
    id: 104,
    name: "Running Shoes",
    category: "Sportswear",
    price: 70.0,
    rating: 4.6,
  },
  {
    id: 105,
    name: "Smartwatch",
    category: "Electronics",
    price: 120.0,
    rating: 4.7,
  },
];
export default function ClientTable() {
  return (
    <div className="w-full">
      <div className="w-full border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">ID</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (USD)</TableHead>
              <TableHead>Rating</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="odd:bg-muted/50">
                <TableCell className="pl-4">{product.id}</TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.rating}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious size="default" href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink size="default" href="#">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink size="default" href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink size="default" href="#">
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext size="default" href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
