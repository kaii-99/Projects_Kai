"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  RotateCcw,
  Edit,
  Trash2,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { SetStateAction, useEffect, useState } from "react";
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

interface Product {
  ID: number;
  Name: string;
  Price: number;
  Quantity: number;
  Discount: string;
  Image_URL: string;
  table: string;
  category: string;
}

const AdminInventory = () => {
  const [dataShown, setDataShown] = useState("top");
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingPrice, setEditingPrice] = useState<{ [key: number]: boolean }>({});
  const [newPrice, setNewPrice] = useState<{ [key: number]: string }>({});
  const [editingQuantity, setEditingQuantity] = useState<{ [key: number]: boolean }>({});
  const [newQuantity, setNewQuantity] = useState<{ [key: number]: string }>({});
  const [editingDiscount, setEditingDiscount] = useState<{ [key: number]: boolean }>({});
  const [newDiscount, setNewDiscount] = useState<{ [key: number]: string }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/inventory?table=${dataShown}`);
        const data = await response.json();
        if (data.success) {
          const parsedProducts = data.data.map((product: any) => ({
            ...product,
            Price: parseFloat(product.Price),
          }));
          
          setProducts(parsedProducts);
        } else {
          console.error('Error fetching products:', data.error);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [dataShown]);

  const handlePageChange = (pageNumber: SetStateAction<number>) => {
    setCurrentPage(pageNumber);
  };

  const handleRemoveProduct = async (id: number, table: string) => {
    try {
      const response = await fetch('/api/inventory', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table }),
      });
      const result = await response.json();
      if (result.success) {
        setProducts(products.filter((product) => product.ID !== id));
      } else {
        console.error('Error removing product:', result.error);
      }
    } catch (error) {
      console.error('Error removing product:', error);
    }
  };

  const handleEditPrice = (id: number) => {
    setEditingPrice({ ...editingPrice, [id]: true });
    const productToEdit = products.find((p) => p.ID === id);
    if (productToEdit) {
      setNewPrice({ ...newPrice, [id]: productToEdit.Price.toString() });
    }
  };

  const handleSavePrice = async (id: number, table: string) => {
    try {
      const newPriceValue = parseFloat(newPrice[id]);
      if (isNaN(newPriceValue)) {
        setErrorMessage('Invalid price value');
        return;
      }

      const productToUpdate = products.find((p) => p.ID === id);
      if (!productToUpdate) {
        setErrorMessage('Product not found');
        return;
      }

      const updatedData = {
        Price: newPriceValue,
        Quantity: productToUpdate.Quantity,
        Discount: productToUpdate.Discount
      };

      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table, product: updatedData }),
      });

      const result = await response.json();
      if (result.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.ID === id ? { ...product, Price: newPriceValue } : product
          )
        );
      } else {
        setErrorMessage('Error updating product: ' + result.error);
      }

      setEditingPrice({ ...editingPrice, [id]: false });
      setNewPrice({ ...newPrice, [id]: "" });
    } catch (error: unknown) {
      setErrorMessage('Error updating price: ' + (error instanceof Error ? error.message : 'An unexpected error occurred'));
    }
  };

  const handleEditQuantity = (id: number) => {
    setEditingQuantity({ ...editingQuantity, [id]: true });
    const productToEdit = products.find((p) => p.ID === id);
    if (productToEdit) {
      setNewQuantity({ ...newQuantity, [id]: productToEdit.Quantity.toString() });
    }
  };

  const handleSaveQuantity = async (id: number, table: string) => {
    try {
      const newQuantityValue = parseInt(newQuantity[id], 10);
      if (isNaN(newQuantityValue)) {
        setErrorMessage('Invalid quantity value');
        return;
      }

      const productToUpdate = products.find((p) => p.ID === id);
      if (!productToUpdate) {
        setErrorMessage('Product not found');
        return;
      }

      const updatedData = {
        Price: productToUpdate.Price,
        Quantity: newQuantityValue,
        Discount: productToUpdate.Discount
      };

      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table, product: updatedData }),
      });

      const result = await response.json();
      if (result.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.ID === id ? { ...product, Quantity: newQuantityValue } : product
          )
        );
      } else {
        setErrorMessage('Error updating product: ' + result.error);
      }

      setEditingQuantity({ ...editingQuantity, [id]: false });
      setNewQuantity({ ...newQuantity, [id]: "" });
    } catch (error: unknown) {
      setErrorMessage('Error updating quantity: ' + (error instanceof Error ? error.message : 'An unexpected error occurred'));
    }
  };

  const handleEditDiscount = (id: number) => {
    setEditingDiscount({ ...editingDiscount, [id]: true });
    const productToEdit = products.find((p) => p.ID === id);
    if (productToEdit) {
      setNewDiscount({ ...newDiscount, [id]: productToEdit.Discount.toString() });
    }
  };

  const handleSaveDiscount = async (id: number, table: string) => {
    try {
      const newDiscountValue = parseInt(newDiscount[id], 10);
      if (isNaN(newDiscountValue)) {
        setErrorMessage('Invalid Discount value');
        return;
      }

      const productToUpdate = products.find((p) => p.ID === id);
      if (!productToUpdate) {
        setErrorMessage('Product not found');
        return;
      }

      const updatedData = {
        Price: productToUpdate.Price,
        Quantity: productToUpdate.Quantity,
        Discount: newDiscountValue+"%",
      };

      console.log(updatedData);

      const response = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, table, product: updatedData }),
      });

      const result = await response.json();
      if (result.success) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product.ID === id ? { ...product, Discount: newDiscountValue +"%" } : product
          )
        );
      } else {
        setErrorMessage('Error updating product: ' + result.error);
      }

      setEditingDiscount({ ...editingDiscount, [id]: false });
      setNewDiscount({ ...newDiscount, [id]: "" });
    } catch (error: unknown) {
      setErrorMessage('Error updating Discount: ' + (error instanceof Error ? error.message : 'An unexpected error occurred'));
    }
  };

  return (
    <div className="w-[1350px] flex flex-col gap-2 p-8">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mb-4">
            {dataShown.charAt(0).toUpperCase() + dataShown.slice(1)}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {["top", "bottom", "accessories", "others"].map((category) => (
            <DropdownMenuItem key={category} onClick={() => setDataShown(category)}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="p-5 rounded-2xl overflow-hidden border-[1px] border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell className="w-[300px]">Item</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Total Quantity</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.ID}>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    <Image
                      width={48}
                      height={48}
                      alt="image"
                      src={product.Image_URL[0]}
                      className="object-cover aspect-square rounded-md"
                    />
                    <p className="text-xs font-medium">{product.Name + " " + product.Size}</p>
                  </div>
                </TableCell>
                <TableCell className="font-light">
                  {editingPrice[product.ID] ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={newPrice[product.ID] || ""}
                        onChange={(e) => setNewPrice({ ...newPrice, [product.ID]: e.target.value })}
                        className="border border-gray-300 rounded p-1 w-20"
                      />
                      <Button onClick={() => handleSavePrice(product.ID, product.category)} className="h-8 ml-2">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <span>${product.Price.toFixed(2)}</span>
                      <Edit onClick={() => handleEditPrice(product.ID)} className="ml-2 w-5 h-5 text-mainBlack cursor-pointer hover:text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-light">
                  {editingQuantity[product.ID] ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={newQuantity[product.ID] || ""}
                        onChange={(e) => setNewQuantity({ ...newQuantity, [product.ID]: e.target.value })}
                        className="border border-gray-300 rounded p-1 w-20"
                      />
                      <Button onClick={() => handleSaveQuantity(product.ID, product.category)} className="h-8 ml-2">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center pl-2">
                      <span>{product.Quantity}</span>
                      <Edit onClick={() => handleEditQuantity(product.ID)} className="ml-2 w-5 h-5 text-mainBlack cursor-pointer hover:text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-light">
                  {editingDiscount[product.ID] ? (
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={newDiscount[product.ID] || ""}
                        onChange={(e) => setNewDiscount({ ...newDiscount, [product.ID]: e.target.value })}
                        className="border border-gray-300 rounded p-1 w-20"
                      />
                      <Button onClick={() => handleSaveDiscount(product.ID, product.category)} className="h-8 ml-2">
                        Save
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center pl-2">
                      <span>{product.Discount}</span>
                      <Edit onClick={() => handleEditDiscount(product.ID)} className="ml-2 w-5 h-5 text-mainBlack cursor-pointer hover:text-muted-foreground" />
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right font-light text-mainBlack">
                  <Trash2 onClick={() => handleRemoveProduct(product.ID, product.category)} className="w-6 h-6 text-mainBlack cursor-pointer hover:text-muted-foreground" />
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
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
    </div>
  );
};

export default AdminInventory;
