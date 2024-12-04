import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MinusCircle, PlusCircle } from "lucide-react";
import { SetStateAction, useState } from "react";
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

const ITEMS_PER_PAGE = 8;

const AdminUpload = () => {
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
    <div className="w-[1350px] flex flex-col gap-4 py-8 px-32">
      <h1 className="text-2xl font-bold">Upload Product</h1>
      <form className="flex flex-col gap-4">
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
                <SelectLabel className="text-xs">Category</SelectLabel>
                <SelectItem value="tops">Tops</SelectItem>
                <SelectItem value="bottom">Bottoms</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
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
            onChange={(e) => setImage1(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <Label className="text-xs" htmlFor="picture">
            Product image 2
          </Label>
          <Input
            type="file"
            id="picture2"
            className="text-xs text-muted-foreground"
            onChange={(e) => setImage2(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <Label className="text-xs" htmlFor="picture">
            Product image 3
          </Label>
          <Input
            type="file"
            id="picture3"
            className="text-xs text-muted-foreground"
            onChange={(e) => setImage3(e.target.files?.[0] || null)}
          />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <Label className="text-xs" htmlFor="stock">
            Stock
          </Label>
          <div className="flex p-2 gap-2 rounded-sm border-[1px] border-gray-200 items-center">
            <MinusCircle
              className={`w-4 h-4 ${counter === 0 && `hidden`}`}
              onClick={() => setCounter(counter - 1)}
            ></MinusCircle>
            <p className="text-xs">{counter}</p>
            <PlusCircle
              className={"w-4 h-4"}
              onClick={() => setCounter(counter + 1)}
            ></PlusCircle>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <Label className="text-xs" htmlFor="description">
            Product description
          </Label>
          <Textarea placeholder="Type your product description here." />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <Label className="text-xs" htmlFor="description">
            Sizes
          </Label>
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
            Promotion
          </Label>
          <Switch id="promo" onClick={() => setPromo(!isPromo)}></Switch>
        </div>

        {isPromo && (
          <div className="flex flex-col items-start gap-1.5">
            <Label className="text-xs" htmlFor="disc">
              Dicount
            </Label>
            <Input
              type="disc"
              id="disc"
              placeholder="5%"
              value={disc}
              onChange={(e) => setDisc(e.target.value)}
            />
          </div>
        )}
        <Button type="submit" className="h-12">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default AdminUpload;
