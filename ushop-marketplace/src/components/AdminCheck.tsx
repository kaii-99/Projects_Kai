"use client"

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import { SetStateAction, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/table";
import Image from "next/image";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ArrowDownNarrowWide, ArrowUpNarrowWide } from "lucide-react";
import { products } from "@/app/productsData";

const initialInvoice = [
  {
    images: ["/images/seasonal-black-1.png", "/images/seasonal-black-2.png"],
    name: "Seasonal Tee - Black",
    invoice: "N7UU5001",
    category: "Tops",
    id: "promo-seasonal-black",
    date: "2024-01-01",
    status: "Confirmed",
    quantity: 1,
    price: 10.99,
  },
  {
    images: ["/images/seasonal-pink-1.png", "/images/seasonal-pink-2.png"],
    name: "Seasonal Tee - Pink",
    invoice: "N7UU5002",
    category: "Tops",
    id: "promo-seasonal-pink",
    date: "2024-01-02",
    status: "Pending",
    quantity: 1,
    price: 10.99,
  },
  {
    images: ["/images/seasonal-black-1.png", "/images/seasonal-black-2.png"],
    name: "Seasonal Tee - Black",
    invoice: "N7UU5003",
    category: "Tops",
    id: "promo-seasonal-black",
    date: "2024-02-01",
    status: "Cancelled",
    quantity: 1,
    price: 10.99,
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statusOptions = ["All", "Pending", "Confirmed", "Cancelled"];

const ITEMS_PER_PAGE = 8;

const AdminCheck = () => {
    const [dataShown, setDataShown] = useState("check");
    const [Month, setMonth] = useState("Month");
    const [Year, setYear] = useState("Year");
    const [statusFilter, setStatusFilter] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [filterUp, setFilterUp] = useState(false);
    const [invoices, setInvoices] = useState(initialInvoice);
    const [isPromo, setPromo] = useState(false);
  
    // Handle status update
    const handleStatusChange = (invoiceNum: string, newStatus: string) => {
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.invoice === invoiceNum
            ? { ...invoice, status: newStatus }
            : invoice
        )
      );
    };
  
    // Filter and sort the invoices based on the selected month, year, status, and sorting order.
    const filteredInvoices = invoices
      .filter((invoice) => {
        const invoiceDate = new Date(invoice.date);
        const selectedMonthIndex = months.indexOf(Month);
        const selectedYear = parseInt(Year, 10);
  
        const matchesMonth =
          Month === "Month" || invoiceDate.getMonth() === selectedMonthIndex;
        const matchesYear =
          Year === "Year" || invoiceDate.getFullYear() === selectedYear;
        const matchesStatus =
          statusFilter === "All" || invoice.status === statusFilter;
  
        return matchesMonth && matchesYear && matchesStatus;
      })
      .sort((a, b) => {
        return filterUp
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      });
  
    const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedInvoices = filteredInvoices.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  
    const handlePageChange = (pageNumber: SetStateAction<number>) => {
      setCurrentPage(pageNumber);
    };
  
    const [counter, setCounter] = useState(10);
  
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");
    const [sizes, setSizes] = useState<string[]>([]);
    const [disc, setDisc] = useState("");
    const [colours, setColours] = useState<string[]>([]);
  
    // State for image files
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [image3, setImage3] = useState<File | null>(null);
  
    const [newProducts, setNewProducts] = useState(products);
  
    // Handle size checkbox changes
    const handleSizeChange = (size: string) => {
      if (sizes.includes(size)) {
        setSizes(sizes.filter((s) => s !== size));
      } else {
        setSizes([...sizes, size]);
      }
    };
  
    // Handle form submission
    const handleSubmit = (e: { preventDefault: () => void }) => {
      e.preventDefault();
  
      // Create new product object
      const newProduct = {
        id: newProducts.length + 1, // Increment the id
        name: productName,
        price: parseFloat(price), // Convert price to a number
        category: category,
        stock: counter,
        sizes: sizes,
        colours: colours,
        description: description,
        promo: isPromo,
        disc: isPromo ? disc : "0%",
        images: [
          image1
            ? URL.createObjectURL(image1)
            : "/placeholder.svg?height=200&width=300",
          image2
            ? URL.createObjectURL(image2)
            : "/placeholder.svg?height=200&width=300",
          image3
            ? URL.createObjectURL(image3)
            : "/placeholder.svg?height=200&width=300",
        ], // Use URL.createObjectURL to generate a preview
      };
  
      // Append new product to the products array
      setNewProducts([...newProducts, newProduct]);
  
      // Optionally clear form fields after submission
      setProductName("");
      setPrice("");
      setCategory("");
      setCounter(10);
      setDescription("");
      setSizes([]);
      setPromo(false);
      setDisc("");
      setImage1(null);
      setImage2(null);
      setImage3(null);
    };

  return (
    <div className="w-[1350px] flex flex-col gap-2 p-8">
      <div className="flex items-center justify-between">
        {/* Month and Year Filters */}
        <div className="flex gap-2 items-center">
          {/* Month Filter */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs flex items-center justify-between w-40"
                >
                  {Month}
                  <ChevronDown className="w-3 h-3"></ChevronDown>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-mainWhite flex flex-col p-2 rounded-lg shadow-md">
                {months.map((month, index) => (
                  <DropdownMenuItem key={index} onClick={() => setMonth(month)}>
                    <Button variant="ghost" className="text-xs h-5 p-0">
                      {month}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {Month !== "Month" && (
              <RotateCcw
                className="w-4 h-4 cursor-pointer mr-3"
                onClick={() => setMonth("Month")}
              />
            )}
          </div>
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs flex items-center justify-between w-40"
                >
                  {Year} <ChevronDown className="w-3 h-3"></ChevronDown>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-mainWhite flex flex-col p-2 rounded-lg shadow-md">
                {Array.from({ length: 5 }).map((_, index) => (
                  <DropdownMenuItem
                    key={index}
                    onClick={() => setYear(String(2024 - index))}
                  >
                    <Button variant="ghost" className="text-xs h-5 p-0">
                      {String(2024 - index)}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {Year !== "Year" && (
              <RotateCcw
                className="w-4 h-4 cursor-pointer mr-3"
                onClick={() => setYear("Year")}
              />
            )}
          </div>
          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-xs flex items-center justify-between w-40"
                >
                  {statusFilter} <ChevronDown className="w-3 h-3"></ChevronDown>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 bg-mainWhite flex flex-col p-2 rounded-lg shadow-md">
                {statusOptions.map((status) => (
                  <DropdownMenuItem
                    key={status}
                    onClick={() => setStatusFilter(status)}
                  >
                    <Button variant="ghost" className="text-xs h-5 p-0">
                      {status}
                    </Button>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {statusFilter !== "All" && (
              <RotateCcw
                className="w-4 h-4 cursor-pointer mr-3"
                onClick={() => setStatusFilter("All")}
              />
            )}
          </div>
        </div>
        {/* Sorting Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setFilterUp(!filterUp)}
        >
          {filterUp ? (
            <>
              <ArrowDownNarrowWide className="w-4 h-4" />
              <span className="text-xs text-mainBlack">Recent</span>
            </>
          ) : (
            <>
              <ArrowUpNarrowWide className="w-4 h-4" />
              <span className="text-xs text-mainBlack">Oldest</span>
            </>
          )}
        </Button>
      </div>
      {/* Invoices Table */}
      <div className="p-5 rounded-2xl overflow-hidden border-[1px] border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="w-[300px]">Item</TableCell>
              <TableCell>Invoice</TableCell>
              <TableCell>
                Date{" "}
                <p className="text-[10px] text-muted-foreground mt-[-2px]">
                  (YYYY-MM-DD)
                </p>
              </TableCell>
              <TableCell>Status</TableCell>
              <TableCell className="text-right">Amount</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedInvoices.map((invoice) => (
              <TableRow key={invoice.invoice}>
                <TableCell>
                  <div className="w-[200px] flex gap-2 items-center">
                    <Image
                      width={48}
                      height={48}
                      alt="image"
                      src={invoice.images[0]}
                      className="object-cover aspect-square rounded-md"
                    />
                    <div className="flex flex-col gap-0">
                      <p className="text-xs font-medium">{invoice.name}</p>
                      <p className="text-xs font-light text-muted-foreground">
                        {invoice.category}
                      </p>
                      <p className="text-[10px] font-light text-muted-foreground">
                        x {invoice.quantity}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-light">{invoice.invoice}</TableCell>
                <TableCell className="font-light">{invoice.date}</TableCell>
                <TableCell className="font-light">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="text-xs">
                        {invoice.status}
                        <ChevronDown className="w-3 h-3 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40">
                      {statusOptions.slice(1).map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() =>
                            handleStatusChange(invoice.invoice, status)
                          }
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
                <TableCell className="text-right font-light">
                  ${invoice.quantity * invoice.price}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              {currentPage === 1 ? null : (
                <PaginationPrevious
                  href="#"
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  aria-disabled={currentPage === 1}
                />
              )}
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  href="#"
                  onClick={() => handlePageChange(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            {totalPages > 3 && <PaginationEllipsis />}
            <PaginationItem>
              {currentPage === totalPages ? null : (
                <PaginationNext
                  href="#"
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default AdminCheck;
