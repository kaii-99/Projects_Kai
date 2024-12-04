"use client";

import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, RotateCcw } from "lucide-react";
import { SetStateAction, useState, useEffect } from "react";
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
import Footer from "@/components/Footer";

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


//const invoices = [
//  {
//    images: ["/images/seasonal-black-1.png", "/images/seasonal-black-2.png"],
//    name: "Seasonal Tee - Black",
//    invoice: "N7UU5001",
//    category: "Tops",
//    id: "promo-seasonal-black",
//    date: "2024-01-01",
//    status: "Confirmed",
//    quantity: 1,
//    price: 10.99,
//  },
//  {
//    images: ["/images/seasonal-pink-1.png", "/images/seasonal-pink-2.png"],
//    name: "Seasonal Tee - Pink",
//    invoice: "N7UU5002",
//    category: "Tops",
//    id: "promo-seasonal-pink",
//    date: "2024-01-02",
//    status: "Pending",
//    quantity: 1,
//    price: 10.99,
//  },
//  {
//    images: ["/images/seasonal-black-1.png", "/images/seasonal-black-2.png"],
//    name: "Seasonal Tee - Black",
//    invoice: "N7UU5003",
//    category: "Tops",
//    id: "promo-seasonal-black",
//    date: "2024-02-01",
//    status: "Cancelled",
//    quantity: 1,
//    price: 10.99,
//  },
//];

const ITEMS_PER_PAGE = 8;

export default function Page({ searchParams }) {

  const { id  } = searchParams;

  const [Month, setMonth] = useState("Month");
  const [Year, setYear] = useState("Year");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterUp, setFilterUp] = useState(false);
  const [invoicesData, setInvoices] = useState([]);
  const [isStudentStaff, setIsStudentStaff] = useState<boolean | null>(null); // Initialize as null for loading state

  useEffect(() => {
    if (isStudentStaff === null) return; // Wait until role is determined
    // Fetching data from API endpoint
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/order_history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: id,
            role: isStudentStaff,
          }),
        });
        const data = await response.json();
        console.log("Fetched Data:", data);
        setInvoices(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id,isStudentStaff]);

  console.log("Data: ", invoicesData);

  // Filter and sort the invoices based on the selected month, year, and sorting order.
  const filteredInvoices = [...invoicesData]
    .filter((invoice) => {
      const invoiceDate = new Date(invoice.date);
      const selectedMonthIndex = months.indexOf(Month);
      const selectedYear = parseInt(Year, 10);

      const matchesMonth =
        Month === "Month" || invoiceDate.getMonth() === selectedMonthIndex;
      const matchesYear =
        Year === "Year" || invoiceDate.getFullYear() === selectedYear;

      return matchesMonth && matchesYear;
    })
    .sort((a, b) => {
      return filterUp ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check if the user is logged in
  useEffect(() => {
   const checkUserStatus = async () => {
     try {
       const response = await fetch('/api/session'); 
       const data = await response.json();
       if (response.ok && data.user.username) {
         setIsLoggedIn(true); // User is logged in
         if (data.user.role === "Student" || data.user.role === "Staff") {
          setIsStudentStaff(true);
        } else {
          setIsStudentStaff(false);
        }
       } else {
         setIsLoggedIn(false); // User is not logged in
       }
     } catch (error) {
       console.error("Error checking user session:", error);
       setIsLoggedIn(false); // Handle error by considering user as logged out
     } finally {
      setLoading(false);
    }
   };
  
   checkUserStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-black font-bold">Loading...</p>
      </div>
    );
  }

  return (
    isLoggedIn ? (
      <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
      <Navbar id={id}/>
      </div>
      <div className="justify-center">
      
      <div className="container mx-auto p-6 pb-36 relative z-50 top-[130px]">
        <div className="justify-center">
          
            <h1 className="text-2xl text-mainBlack font-bold">My purchase</h1>
            <hr></hr>
            <br></br>
            { invoicesData === null || invoicesData.length === 0 ?(
              <p className="text-center col-span-full text-lg text-gray-500">No purchase yet</p>
            ) : (
              <>
                <div className="flex items-center justify-between">

                  <div className="flex gap-2 items-center">
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
                  </div>
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
                    )
                    }
                  </Button>
                </div>
                <div className="p-5 rounded-2xl overflow-hidden border-[1px] border-gray-200 shadow-sm">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="w-[300px]">Item</TableCell>
                        <TableCell>Invoice</TableCell>
                        <TableCell>Date <p className="text-[10px] text-muted-foreground mt-[-2px]">(YYYY-MM-DD)</p></TableCell>
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
                          <TableCell className="font-light">
                            {invoice.id}
                          </TableCell>
                          <TableCell className="font-light">{invoice.date}</TableCell>
                          <TableCell
                            className={`font-light ${
                              invoice.status === "Pending" && "text-yellow-600"
                            } ${
                              invoice.status === "Cancelled" && "text-primaryRed-600"
                            } ${invoice.status === "Confirmed" && "text-green-600"}`}
                          >
                            {invoice.status}
                          </TableCell>
                          <TableCell className="text-right font-light">
                            ${roundToFixed(invoice.quantity * invoice.price, 2).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
                              handlePageChange(Math.min(totalPages, currentPage + 1))
                            }
                          />
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
            </>)}
            <br></br>
            <hr></hr>
            <br></br>
        </div>
      </div>
    </div>
    </>
    ):(
      <div className="flex justify-center items-center h-screen">
    <p className="text-center text-black font-bold">Access denied.</p>
  </div>
    )
    
  );
}

function roundToFixed(num, decimals) {
  return Number(num.toFixed(decimals));
}
