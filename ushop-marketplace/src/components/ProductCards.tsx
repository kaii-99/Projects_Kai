"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Heart } from "lucide-react";
import { toast, Toaster } from "sonner";

interface ProductCardsProps {
  name: string;
  images: string[];
  id: string | number;
  price: number;
  disc: string;
  category: string;
  userid: string;
  liked: boolean;
  quantity: number;
}

const ProductCards: React.FC<ProductCardsProps> = ({
  name,
  images,
  id,
  price,
  disc,
  category,
  userid,
  liked,
  quantity,
}) => {
  const router = useRouter();  // Initialize the router
  const [isHovered, setHovered] = useState(false);
  const [isLoveIconClicked, setLoveIconClicked] = useState(liked);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [currentURL, setCurrentURL] = useState("");

  // Function to check if the user is logged in
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/session'); 
        const data = await response.json();
        if (response.ok && data.user.username) {
          setIsLoggedIn(true); // User is logged in
        } else {
          setIsLoggedIn(false); // User is not logged in
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setIsLoggedIn(false); // Handle error by considering user as logged out
      }
    };

    checkUserStatus();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentURL(window.location.href);
    }
  }, []);

  //console.log("Current URL:", currentURL);
  const updateCart = async (productName: string, e: React.MouseEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/update_cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId: id,
          category: category,
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

  const UpdateWishlistList = async (liked: boolean) => {
  
    // Check if any parameter is undefined
    if (userid === undefined || id === undefined || category === undefined) {
      console.error("Parameters cannot be undefined:", { userid, id, category });
      return; // Exit the function early if any required parameter is missing
    }
    const mode = liked ? "add" : "delete";
    setLoading(true);
    try {
      const response = await fetch('/api/update-wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userid,
          ItemId: Number(id),
          category: String(category),
          mode: mode,
        }),
      });
      const data = await response.json();
      if (data.success) {
        console.log(data);
        setLoveIconClicked(!isLoveIconClicked);
        console.log('Reload');
        // Redirect to the updated wishlist page after successful removal
        window.location.reload();
      } else {
        console.error('Failed to update wishlist:', data.error);
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative ">
      {/* heart */}
      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-mainWhite bg-opacity-65 absolute top-4 right-4 z-20">
        {isLoggedIn ? (
          <Heart
            className={`w-5 h-5 ${
              isLoveIconClicked && `stroke-none fill-primaryRed-600`
            }`}
            onClick={() => UpdateWishlistList(!isLoveIconClicked)}
          ></Heart>
        ):(
          <Link href="/log-in">
          <Heart
            className={`w-5 h-5 ${
              isLoveIconClicked && `stroke-none fill-primaryRed-600`
            }`}
            onClick={() => UpdateWishlistList(!isLoveIconClicked)}
          ></Heart>
          </Link>
        )}
        
      </div>
      
      <Link
        className="w-full  overflow-hidden block p-2 pb-4 rounded-sm hover:shadow-md z-10"
        href={`/${category?.toLowerCase()}/${id}?id=${userid}`}
      >
        <div className="flex flex-col gap-1">
          <div
            className="w-full aspect-[2/3] relative"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {images.length > 1 ? (
              <>
                <Image
                  src={images[1]}
                  alt={name}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className={`absolute transition-all duration-100 ease-in-out ${
                    isHovered ? "block" : "hidden"
                  }`}
                ></Image>
                <Image
                  src={images[0]}
                  alt={name}
                  fill={true}
                  style={{ objectFit: "cover" }}
                  className={`absolute transition-all duration-100 ease-in-out ${
                    isHovered ? "hidden" : "block"
                  }`}
                ></Image>
              </>
            ) : (
              <Image
                src={images[0]}
                alt={name}
                fill={true}
                style={{ objectFit: "cover" }}
                className={`absolute transition-all duration-100 ease-in-out `}
              ></Image>
            )}
          </div>
          <p className="text-sm text-mainBlack">{name}</p>
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <p
                className={`${
                  disc === "0%" ? "text-mainBlack" : "text-primaryRed-600"
                } font-semibold text-md`}
              >
                ${((price * (1 - parseFloat(disc) / 100)).toFixed(2))}
              </p>
              {disc === "0%" ? null : (
                <div className="text-xs text-primaryRed-600 border-primaryRed-600 border-[1px] rounded-[2px] flex items-center justify-center h-4 w-9">
                  -{disc}
                </div>
              )}
            </div>

            {/* add to cart button */}
            {quantity > 0 ? (
              isLoggedIn ? (
              <Button onClick={(e) => updateCart(name,e)} className="h-[26px] flex rounded-full" variant="outline">
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
              ) : (
                <Link href="/log-in">
                <Button className="h-[26px] flex rounded-full" variant="outline">
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
              </Link>
              )
            ):(
              <p>Out of stock</p>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCards;
