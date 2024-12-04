"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ChevronDown,
  Minus,
  MinusCircle,
  Plus,
  PlusCircle,
  RotateCcw,
} from "lucide-react";
import { SetStateAction, useState, useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { products } from "../productsData";
import AdminInventory from "@/components/AdminInventory";
import { useRouter } from 'next/navigation';

interface Invoice {
  images: string[];
  name: string;
  invoice: string;
  category: string;
  id: string;
  date: string;
  status: string;
  quantity: number;
  price: number;
}

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

const adminEmail = "admin@gmail.com";
const adminPassword = "admin12345678";

const statusOptions = ["All", "Pending", "Confirmed", "Cancelled"];

const ITEMS_PER_PAGE = 8;

const Page = () => {
  const router = useRouter();
  const [isAdmin, setAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (email === adminEmail && password === adminPassword) {
      setAdmin(true);
    } else {
      alert("Invalid email or password");
    }
  };

  const [dataShown, setDataShown] = useState("check");

  const [Month, setMonth] = useState("Month");
  const [Year, setYear] = useState("Year");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUp, setFilterUp] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]); // Initialize with an empty array
  const [isPromo, setPromo] = useState(false);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/check_order');
        const result = await response.json();
        console.log(result);
        if (result.success) {
          console.log(result.data);
          setInvoices(result.data);
        } else {
          alert("Failed to fetch orders: " + result.error);
        }
      } catch (error: any) {
        alert("Error: " + error.message);
      }
    };

    fetchOrders();
  }, []);

  // Handle status update
  const handleStatusChange = async (invoiceNum: string, newStatus: string) => {
    try {
      const response = await fetch('/api/check_order', {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice: invoiceNum, status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setInvoices((prevInvoices) =>
          prevInvoices.map((invoice) =>
            invoice.invoice === invoiceNum
              ? { ...invoice, status: newStatus }
              : invoice
          )
        );
        window.location.reload(); // Refresh the page
      } else {
        alert("Failed to update order status: " + result.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
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
    .filter((invoice) => invoice.date) // Ensure date property exists
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

  const routerPush = (link: string) => {
    if (link === "check") {
        router.push("/admin_CheckOrder");
    }
    else if (link === "upload") {
        router.push("/admin_InventoryUpload");
    }
    else if (link === "inventory") {
        router.push("/admin_Inventory");
    }
    else {
        router.push("/admin");
    }
  }

  const [counter, setCounter] = useState(10);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [disc, setDisc] = useState("");

  // State for image files
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [image1, setImage1] = useState<File | null>(null);

  // Handle size checkbox changes
  const handleSizeChange = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleSubmit = async (
    productName: string, 
    price: string, 
    category: string,
    counter: number,
    sizes: string[],
    imageURL: string | null,
    description: string,
    isPromo: boolean,
    disc: string
  ) => {
    if (!imageURL) {
      alert("Image URL is required");
      return;
    }

    const newProduct = {
      name: productName,
      price: parseFloat(price),
      category: category,
      quantity: counter,
      sizes: sizes,
      imageurl: imageURL,
      description: description,
      promo: isPromo,
      disc: isPromo ? disc : "0%",
    };

    try {
      const response = await fetch('/api/add_item', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      });

      const result = await response.json();
      if (result.success) {
        alert("Product added successfully!");
        // Optionally clear form fields after successful submission
        setProductName("");
        setPrice("");
        setCategory("");
        setCounter(10);
        setDescription("");
        setSizes([]);
        setPromo(false);
        setDisc("");
        setImage1(null);
        setImageURL(null);
      } else {
        alert("Failed to add product: " + result.error);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    }
  };

  // Reset the promo switch when the product is added or the page is refreshed
  useEffect(() => {
    setPromo(false);
  }, [invoices]);

  return (
    <div className="flex justify-center flex-col text-mainBlack">
        <div>
          <div className="flex flex-col gap-4 p-8 w-full items-center">
            <div className="flex justify-between items-center w-full">
              <Button variant="link" className="opacity-0">
                Log out
              </Button>
              <div className="flex gap-1 items-center p-2 rounded-full border-[1px] overflow-hidden border-gray-200">
                <div
                  className={`py-2 px-4 rounded-full cursor-pointer ${
                    dataShown === "check"
                      ? "bg-mainBlack text-mainWhite"
                      : "bg-gray-100 text-mainBlack"
                  }`}
                  onClick={() => routerPush("check")}
                >
                  Check orders
                </div>
                <div
                  className={`py-2 px-4 rounded-full cursor-pointer ${
                    dataShown === "upload"
                      ? "bg-mainBlack text-mainWhite"
                      : "bg-gray-100 text-mainBlack"
                  }`}
                  onClick={() => routerPush("upload")}
                >
                  Upload product
                </div>
                <div
                  className={`py-2 px-4 rounded-full cursor-pointer ${
                    dataShown === "inventory" && "bg-mainBlack text-mainWhite"
                  } ${
                    dataShown !== "inventory" && "bg-gray-100 text-mainBlack"
                  }`}
                  onClick={() => routerPush("inventory")}
                >
                  Inventory
                </div>
              </div>
              <Button variant="link" onClick={() => routerPush("logout")}>
                Log out
              </Button>
            </div>
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
                            <DropdownMenuItem
                              key={index}
                              onClick={() => setMonth(month)}
                            >
                              <Button
                                variant="ghost"
                                className="text-xs h-5 p-0"
                              >
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
                            {Year}{" "}
                            <ChevronDown className="w-3 h-3"></ChevronDown>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-mainWhite flex flex-col p-2 rounded-lg shadow-md">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <DropdownMenuItem
                              key={index}
                              onClick={() => setYear(String(2024 - index))}
                            >
                              <Button
                                variant="ghost"
                                className="text-xs h-5 p-0"
                              >
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
                            {statusFilter}{" "}
                            <ChevronDown className="w-3 h-3"></ChevronDown>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-mainWhite flex flex-col p-2 rounded-lg shadow-md">
                          {statusOptions.map((status) => (
                            <DropdownMenuItem
                              key={status}
                              onClick={() => setStatusFilter(status)}
                            >
                              <Button
                                variant="ghost"
                                className="text-xs h-5 p-0"
                              >
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
                                <p className="text-xs font-medium">
                                  {invoice.name}
                                </p>
                                <p className="text-xs font-light text-muted-foreground">
                                  {invoice.category}
                                </p>
                                <p className="text-[10px] font-light text-muted-foreground">
                                  x {invoice.quantity}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-light">
                            {invoice.invoice.slice(0,7)}
                          </TableCell>
                          <TableCell className="font-light">
                            {invoice.date}
                          </TableCell>
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
                                      handleStatusChange(
                                        invoice.invoice.slice(6,7),
                                        status
                                      )
                                    }
                                  >
                                    {status}
                                  </DropdownMenuItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                          <TableCell className="text-right font-light">
                            ${roundToFixed(invoice.quantity * invoice.price, 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
                            onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                            }
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
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                          />
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </div>
          </div>
        </div>
    </div>
  );
};

function roundToFixed(num, decimals) {
  return Number(num.toFixed(decimals));
}

export default Page;