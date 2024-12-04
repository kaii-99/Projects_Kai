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
import Navbar from "@/components/Navbar";

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

export default function Page({ searchParams }) {
  const { id } = searchParams;  // Fetch the ID from the search params
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

  const [dataShown, setDataShown] = useState("upload");

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
        router.push(`/admin_CheckOrder?id=${id}`);
    }
    else if (link === "upload") {
        router.push(`/admin_InventoryUpload?id=${id}`);
    }
    else if (link === "inventory") {
        router.push(`/admin_Inventory?id=${id}`);
    }
    else {
        router.push("/admin");
    }
  }

  const [counterStock, setCounterStock] = useState(10);

  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [disc, setDisc] = useState("");

  // State for image files
  const [imageURL1, setImageURL1] = useState<string | null>(null);
  const [image1, setImage1] = useState<File | null>(null);
  const [imageURL2, setImageURL2] = useState<string | null>(null);
  const [image2, setImage2] = useState<File | null>(null);

  // Handle size checkbox changes
  const handleSizeChange = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const [isLoggedInAdminAccount, setIsLoginInAdminAccount] = useState(false);
  const [loading, setLoading] = useState(true);
  // Function to check if the user is logged in and an admin
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/session'); 
        const data = await response.json();
        if (response.ok && data.user.username && data.user.role == 'Admin') {
          setIsLoginInAdminAccount(true); // User is logged in and admin
        } else {
          setIsLoginInAdminAccount(false); // User is not logged in or admin
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setIsLoginInAdminAccount(false); // Handle error 
      } finally {
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const handleSubmit = async (
    productName: string, 
    price: string, 
    category: string,
    counter: number,
    sizes: string[],
    imageURL1: string | null,
    imageURL2: string | null,
    description: string,
    disc: string
  ) => {
    if (!imageURL1 || !imageURL2) {
      alert("Image URL is required");
      return;
    }

    const newProduct = {
      name: productName,
      price: parseFloat(price),
      category: category,
      quantity: counter,
      sizes: sizes,
      imageurl1: imageURL1,
      imageurl2: imageURL2,
      description: description,
      disc: disc+'%',
    };
    console.log(newProduct);

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
        setCounterStock(10);
        setDescription("");
        setSizes([]);
        setDisc("");
        setImageURL1(null);
        setImage1(null);
        setImageURL2(null);
        setImage2(null);
        window.location.reload(); // Refresh the page
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-black font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <>
    <Navbar id={id}/>
    <div className="mt-24" />
    {isLoggedInAdminAccount? (
      <div className="flex justify-center flex-col text-mainBlack">
          <div>
            <div className="flex flex-col gap-4 p-8 w-full items-center">
              <div className="flex justify-between items-center w-full">
              <div></div>
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
                <div></div>
              </div>
                <div className="w-[1350px] flex flex-col gap-4 py-8 px-32">
                  <h1 className="text-2xl font-bold">Upload Product</h1>
                  <form className="flex flex-col gap-4"
                  onSubmit={async (e) => {
                    e.preventDefault(); // Prevent default form submission behavior
                    await handleSubmit(productName, price, category, counterStock, sizes, imageURL1, imageURL2, description, disc);
                  }}>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="name">
                        Product name
                      </Label>
                      <Input
                        type="productName"
                        id="productName"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="price">
                        Price (SGD)
                      </Label>
                      <Input
                        type="price"
                        id="price"
                        placeholder="Product price (in SGD)"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="category">
                        Product category
                      </Label>
                      <Select
                        value={category}
                        onValueChange={(value) => setCategory(value)}
                      >
                        <SelectTrigger className="w-[300px] text-s text-muted-foreground">
                          <SelectValue placeholder="Select product category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel className="text-xs">
                              Category
                            </SelectLabel>
                            <SelectItem value="tops">Tops</SelectItem>
                            <SelectItem value="bottom">Bottoms</SelectItem>
                            <SelectItem value="accessories">
                              Accessories
                            </SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="picture">
                        Product image 1
                      </Label>
                      <Input
                        type="file"
                        id="picture1"
                        className="text-xs text-muted-foreground"
                        onChange={(e) => {
                          const file1 = e.target.files?.[0] || null;
                          if (file1) {
                            const imageUrl1 = file1.name; // Use the file name instead of the blob URL
                            setImageURL1(imageUrl1);  // Update the image URL state
                            setImage1(file1);        // Update the image file state
                          } else {
                            setImageURL1(null); // Ensure imageURL is null if no file is selected
                          }
                        }}
                      />
                      {imageURL1 && (
                        <p className="text-xs mt-2">
                          Image URL: {imageURL1}  {/* Display the image URL */}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="picture">
                        Product image 2
                      </Label>
                      <Input
                        type="file"
                        id="picture2"
                        className="text-xs text-muted-foreground"
                        onChange={(e) => {
                          const file2 = e.target.files?.[0] || null;
                          if (file2) {
                            const imageUrl2 = file2.name; // Use the file name instead of the blob URL
                            setImageURL2(imageUrl2);  // Update the image URL state
                            setImage2(file2);        // Update the image file state
                          } else {
                            setImageURL2(null); // Ensure imageURL is null if no file is selected
                          }
                        }}
                      />
                      {imageURL2 && (
                        <p className="text-xs mt-2">
                          Image URL: {imageURL2}  {/* Display the image URL */}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="stock">
                        Stock
                      </Label>
                      <div className="flex p-2 gap-2 rounded-sm border-[1px] border-gray-200 items-center">
                        <MinusCircle
                          className={`w-4 h-4 ${counterStock === 0 && `hidden`}`}
                          onClick={() => setCounterStock(counterStock - 1)}
                        ></MinusCircle>
                        <p className="text-xs">{counterStock}</p>
                        <PlusCircle
                          className={"w-4 h-4"}
                          onClick={() => setCounterStock(counterStock + 1)}
                        ></PlusCircle>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="description">
                        Product description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Type your product description here."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1.5">
                      <Label className="text-xs" htmlFor="description">
                        Sizes
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="size-xs"
                          onCheckedChange={() => handleSizeChange("XS")}
                        />
                        <label className="text-xs" htmlFor="size">
                          XS
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="size-s"
                          onCheckedChange={() => handleSizeChange("S")}
                        />
                        <label className="text-xs" htmlFor="size">
                          S
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="size-m"
                          onCheckedChange={() => handleSizeChange("M")}
                        />
                        <label className="text-xs" htmlFor="size">
                          M
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="size-l"
                          onCheckedChange={() => handleSizeChange("L")}
                        />
                        <label className="text-xs" htmlFor="size">
                          L
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="size-xl"
                          onCheckedChange={() => handleSizeChange("XL")}
                        />
                        <label className="text-xs" htmlFor="size">
                          XL
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="size-xxl"
                          onCheckedChange={() => handleSizeChange("XXL")}
                        />
                        <label className="text-xs" htmlFor="size">
                          XXL
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label className="text-xs" htmlFor="promo">
                        Promotion (%)
                      </Label>
                      <Input
                        type="disc"
                        id="disc"
                        placeholder="Discount Percentage (Without %)"
                        value={disc}
                        onChange={(e) => setDisc(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="h-12">
                      Submit
                    </Button>
                  </form>
                </div>
            </div>
          </div>
      </div> 
    ) : (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-black font-bold">Access denied.</p>
      </div>
    )}
  </>
  );
};

function roundToFixed(num, decimals) {
  return Number(num.toFixed(decimals));
}
