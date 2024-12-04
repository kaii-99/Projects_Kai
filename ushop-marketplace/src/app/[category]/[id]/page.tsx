"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from 'next/navigation';
import { products } from "../../productsData"; 
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel";
import ProductCards from "@/components/ProductCards";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { toast, Toaster } from "sonner";

type ProductPageProps = {
  params: { category: string; id: string };
};

const ProductPage = ({ params }: ProductPageProps) => {
  const productId = params.id;
  const productCat = params.category;
  const searchParams = useSearchParams(); // Use to get query params
  const userid = searchParams.get("id"); // Extract `id` from query parameters
  const router = useRouter();  // Initialize the router

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoveIconClicked, setLoveIconClicked] = useState(false);
  const [selectedSize, setSelectedSize] = useState(""); 
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentURL, setCurrentURL] = useState("");
  // State for user role
  const [isStudentStaff, setIsStudentStaff] = useState<boolean | null>(null); // Initialize as null for loading state
  useEffect(() => {
    // Fetch user role first
    const fetchUserRole = async () => {
      try {
        const response = await fetch(`/api/UserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: userid,
          }),
        });
        const data = await response.json();
        console.log("role: ", data);
        if (data.success) {
          if (data.rows[0].Role === "Student" || data.rows[0].Role === "Staff") {
            setIsStudentStaff(true);
          } else {
            setIsStudentStaff(false);
          }
        } else {
          console.error(data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchUserRole();
  }, [userid]); // Only fetch the user role when 'id' changes

  useEffect(() => {

    if (typeof window !== "undefined") {
      setCurrentURL(window.location.href);
    }

    if (isStudentStaff === null) return; // Wait until role is determined

    // Fetching data from API endpoint
    const getProductDetails = async () => {
      try {
        console.log(productCat);
        console.log(productId);
        console.log(userid);

        const response = await fetch(`/api/get_products_details`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: productCat,
            id: productId,
            userid: userid,
            role: isStudentStaff,
          }),
        });
        const data = await response.json();
        console.log(data);
        // Assuming data is in the format { success: true, count: 5 }
        if (data.success) {
          setProduct(data.result); // Extracting the count from the response
          setSelectedSize(data.result.size);
          setLoveIconClicked(data.result.liked);
        } else {
          // Find the product by ID;
          console.error(data.error); // Handle error in the response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    getProductDetails();
  }, [productCat, productId, userid, isStudentStaff]);
  // Function to change the selected size
  const changeSize = async (size) => {
    try {
      const response = await fetch(`/api/change_size`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: productCat,
          name: product.name, // Assuming product has a 'name' field
          size: size
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setProduct(data.result);
        setSelectedSize(data.result.size);
        router.push(`/${data.result.category?.toLowerCase()}/${data.result.id}?id=${userid}`);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //UPDATE WISHLIST
  const UpdateWishlistList = async (liked: boolean) => {

    const mode = liked ? "add" : "delete";
    
    try {
      const response = await fetch('/api/update-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userid,
          ItemId: Number(product.id),
          category: String(product.category),
          mode: mode,
        }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        setLoveIconClicked(!isLoveIconClicked);
        // Redirect to the updated wishlist page after successful removal
        //router.replace(currentURL);
        //router.refresh();
        window.location.reload();
      } else {
        console.error('Failed to update wishlist:', data.error);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  const updateCart = async (productName: string) => {
    try {
      const response = await fetch(`/api/update_cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId: product.id,
          category: product.category,
          id: userid,
          mode: "add"
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(productName + " added to cart!", {
          position: 'top-right',
          duration: 3000,
          onAutoClose: () => {window.location.reload()}
        });
      } else {
        toast.error("Error saving to cart: " + data.error, {
          position: 'top-right',
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  if (!product) {
    return (
      <>
        <div className="h-screen">
          <div className="flex flex-col gap-8 items-center justify-center h-full pb-32 pt-32">  
            <Image
              src="/images/page-not-found.svg"
              width="500"
              height="690"
              alt="not-found"
            ></Image>
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-mainBlack text-2xl font-bold">
                Oops! This page doesn&apos;t exist.
              </h1>
              <p className="text-mainBlack font-light w-[500px] text-center">
                It looks like the link you followed may be broken or the page
                has been moved. Double-check the URL or head back to the
                homepage.
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }
  console.log(product);
  return (
    <>
    <Navbar id={userid}/>
      <div className="container mx-auto p-6 mb-20 py-32">
        {/* Header Section */}
        <div className="text-left py-9 pl-16 text-sm text-mainGrey">
          <Link href={`./?id=${userid}`} className="underline hover:color-darkRed">
            Home
          </Link>
          &nbsp;&nbsp; &gt; &nbsp;&nbsp;
          <Link
            href={`/${product.category?.toLowerCase()}?id=${userid}`}
            className="underline hover:color-darkRed"
          >
            {product.category}
          </Link>
          &nbsp;&nbsp; &gt; &nbsp;&nbsp;
          <Link href="" className="underline hover:color-darkRed">
            {product.name}
          </Link>
        </div>
        <div className="flex flex-col lg:flex-row mb-6">
          {/* Product Image */}
          <div className="w-full lg:w-3/5">
            <Carousel className="w-full max-w-4xl">
              <div className="flex space-x-4">
                {/* Carousel Thumbnails */}
                <div className="w-1/4 space-y-4">
                  {product.images?.map((image, index) => (
                    <div
                      key={index}
                      className={`cursor-pointer transition-all ${
                        index === currentIndex ? "border-primary" : "border-transparent"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    >
                      <img src={image} alt={`Thumbnail ${index}`} className="w-full aspect-square object-cover" />
                    </div>
                  ))}
                </div>

                {/* Main Image */}
                <div className="w-3/4 h-full">
                  <CarouselContent>
                    {product.images?.map((image, index) => (
                      <CarouselItem key={index} className={index === currentIndex ? "" : "hidden"}>
                        <div className="p-1 w-full h-full">
                          <img
                            src={image}
                            alt={`Product Image ${index}`}
                            className="h-[45rem] w-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </div>
              </div>
            </Carousel>
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-2/5 lg:pl-10">
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="mb-4 font-semibold">
              <p
                className={`${
                  product.disc === "0%" ? "text-mainBlack" : "text-primaryRed-600"
                } font-semibold text-md`}
              >
                ${((product.price * (1 - parseFloat(product.disc) / 100)).toFixed(2))}
              </p>
              {product.disc === "0%" ? null : (
                <div className="text-xs text-primaryRed-600 border-primaryRed-600 border-[1px] rounded-[2px] flex items-center justify-center h-4 w-9">
                  -{product.disc}
                </div>
              )}
            </div>

            {/* add to cart button */}
            {product.stock > 0 ? (
              <Button onClick={() => updateCart(product.name)} className="h-[35px] flex rounded-full" variant="outline">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.33333 4.66667L4.452 10.2613C4.51244 10.5637 4.67581 10.8358 4.9143 11.0312C5.15278 11.2267 5.45165 11.3335 5.76 11.3333H12.1267C12.4573 11.3333 12.7762 11.2105 13.0213 10.9886C13.2665 10.7667 13.4204 10.4617 13.4533 10.1327L13.8533 6.13267"
                    stroke="black"
                    stroke-width="1.33333"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M3.33333 4.66667L2.79333 2.50467C2.75722 2.3605 2.67397 2.23254 2.5568 2.1411C2.43964 2.04967 2.29528 2 2.14667 2H1.33333M5.33333 14H6.66667M10.6667 14H12"
                    stroke="black"
                    stroke-width="1.33333"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.5714 6.42857H9.42857V8.57143C9.42857 8.80714 9.23571 9 9 9C8.76429 9 8.57143 8.80714 8.57143 8.57143V6.42857H6.42857C6.19286 6.42857 6 6.23571 6 6C6 5.76429 6.19286 5.57143 6.42857 5.57143H8.57143V3.42857C8.57143 3.19286 8.76429 3 9 3C9.23571 3 9.42857 3.19286 9.42857 3.42857V5.57143H11.5714C11.8071 5.57143 12 5.76429 12 6C12 6.23571 11.8071 6.42857 11.5714 6.42857Z"
                    fill="black"
                    stroke="black"
                    stroke-width="0.2"
                  />
                </svg>
              </Button>
              ):(
              <p>Out of stock</p>
            )}
            

            {/* Product Description */}
            <div className="mt-4">
              <h2 className="text-xl font-bold mb-2">Product Description</h2>
              <p className="text-gray-600">
                {/* Add dynamic description or other info based on the product */}
                {product.description}
              </p>
            </div>
            
            {/* Stock left, Size, Like Button */}
            <div className="mt-4">
              <strong>Available Sizes:</strong>
              <div className="flex space-x-2 mt-1">
                {product.sizes.map((size, index) => (
                  <Button
                    variant="selection"
                    key={index}
                    className={`text-black ${
                      selectedSize === size ? "bg-darkGrey text-black" : "bg-gray-200"
                    }`}
                    onClick={() => changeSize(size)} // Handles size selection
                  >
                    {size}
                  </Button>
                ))}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Selected Size: {selectedSize}
              </p>
            </div>

            {/* <div className="mt-4">
              <strong>Available Colours:</strong>
              {/* <div className="flex space-x-2 mt-1">
                {product.colours.map((colour, index) => (
                  <Button
                    variant="selection"
                    key={index}
                    className={`text-black ${
                      selectedColour === colour ? "bg-darkGrey text-black" : "bg-gray-200"
                    }`}
                    onClick={() => setSelectedColour(colour)} 
                    value={selectedColour}
                  >
                    {colour}
                  </Button> 
                  <div className="flex space-x-2 mt-1">
                    {/* {product.colours.map((colour, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColour(colour)}
                        className={`w-8 h-8 rounded-full border border-gray-300 transition ${
                          selectedColour === colour ? "ring-2 ring-offset-2 ring-gray-500" : ""
                        }`}
                        style={{ backgroundColor: colour.toLowerCase() }} 
                        aria-label={colour} 
                      />
                ))} 
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Selected Colour: {selectedColour}
              </p>
            </div> */}

            <div className="mt-4">
              <p className="text-md font-bold mb-2 text-darkRed">
                Stock: {product.stock}
              </p>
            </div>
              
            {/* heart */}
            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-mainWhite bg-opacity-65">
              <Heart
                className={`w-5 h-5 ${
                  isLoveIconClicked && `stroke-none fill-primaryRed-600`
                }`}
                onClick={() => UpdateWishlistList(!product.liked)}
              ></Heart>
            </div>

            {/* size chart */}
            <div className="mt-4">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="sizechart">
                  <AccordionTrigger><span className="font-bold text-base">Size Chart</span></AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2">
                      <table className="border-solid border-1 border-black p-1 text-center">
                        <tr className="border-solid border-b-2 border-black">
                          <th>Size</th>
                          <th>Chest <span className="text-xs italic text-darkRed">(INCH)</span></th>
                          <th>Body Length <span className="text-xs italic text-darkRed">(INCH)</span></th>
                          <th>Shoulder to Shoulder <span className="text-xs italic text-darkRed">(INCH)</span></th>
                          <th>Sleeves Length <span className="text-xs italic text-darkRed">(INCH)</span></th>
                        </tr>
                        <tr className="border-b-2">
                          <td>XS</td>
                          <td>17"</td>
                          <td>24"</td>
                          <td>15"</td>
                          <td>6.5"</td>
                        </tr>
                        <tr className="border-b-2">
                          <td>S</td>
                          <td>18"</td>
                          <td>25"</td>
                          <td>16"</td>
                          <td>7"</td>
                        </tr>
                        <tr className="border-b-2">
                          <td>M</td>
                          <td>20"</td>
                          <td>27"</td>
                          <td>18"</td>
                          <td>8"</td>
                        </tr>
                        <tr className="border-b-2">
                          <td>L</td>
                          <td>21"</td>
                          <td>28"</td>
                          <td>19"</td>
                          <td>8.5"</td>
                        </tr>
                        <tr>
                          <td>XL</td>
                          <td>23"</td>
                          <td>30"</td>
                          <td>21"</td>
                          <td>9.5"</td>
                        </tr>
                    </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* {products.slice(0, relatedProduct).map((product) => ( */}
          {products
            .filter(
              (p) => p.category === product.category && p.id !== product.id
            )
            .map((relatedProduct) => (
            <ProductCards
              key={relatedProduct.id}
              name={relatedProduct.name}
              id={relatedProduct.id}
              images={relatedProduct.images}
              price={relatedProduct.price}
              disc={relatedProduct.disc}
              category={relatedProduct.category}
            />
          ))}
        </div>
        <Toaster />
      </div>
    </>
  );
};

export default ProductPage;
