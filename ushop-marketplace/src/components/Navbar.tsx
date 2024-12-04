"use client";
// Ghost
import { SearchIcon, Trash, XIcon } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useRouter } from 'next/navigation';
import { toast, Toaster } from "sonner";

export var globalIsBannerClosed: boolean;

let isStudentStaff = true;
let isLoggedIn = true;

const Navbar = ({ id }: { id: string }) => {
  // State for wishlist count
  const [wishlistCount, setwishlistCount] = useState(0);
  // State for shoppingcart count
  const [shoppingcartCount, setshoppingcartCount] = useState(0);
  const [Search, setSearch] = useState('');
  
  // State for user role
  const [isStudentStaff, setIsStudentStaff] = useState<boolean | null>(null); // Initialize as null for loading state
  const [cartItems, setCartItems] = useState([]);

  const deleteCartItem = async (productCat: string, productId: number, productName: string) => {
    console.log('delete cart item!');
    try {
      const response = await fetch(`/api/update_cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItemId: productId,
          category: productCat,
          id: id,
          mode: "delete"
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(productName + " deleted from cart!", {
          position: 'top-right',
          duration: 30,
          onAutoClose: () => {window.location.reload()}
        });
      } else {
        toast.error("Error deleting from cart: " + data.error, {
          position: 'top-right',
          duration: 3000
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const SearchProduct = async () => {
    router.push(`/search?id=${id}&search=${Search}`);
  }
  
  useEffect(() => {
    // Fetching data from API endpoint
    const fetchWishlistCount = async () => {
      try {
        const response = await fetch(`/api/wishlist_length`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        const data = await response.json();
        // Assuming data is in the format { success: true, count: 5 }
        if (data.success) {
          setwishlistCount(data.count); // Extracting the count from the response
        } else {
          console.error(data.error); // Handle error in the response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchShoppingCartCount = async () => {
      try {
        const response = await fetch(`/api/shoppingcart_length`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        const data = await response.json();
        // Assuming data is in the format { success: true, count: 5 }
        if (data.success) {
          setshoppingcartCount(data.count); // Extracting the count from the response
        } else {
          console.error(data.error); // Handle error in the response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const fetchUserRole = async () => {
      try {
        const response = await fetch(`/api/UserData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
          }),
        });
        const data = await response.json();
        console.log(data);
        // Assuming data is in the format { success: true, count: 5 }
        if (data.success) {
          if (data.rows[0].Role === "Student" || data.rows[0].Role === "Staff") {
            setIsStudentStaff(true); // Update the state properly
            //console.log("True");
          } else {
            setIsStudentStaff(false);
            //console.log("False");
          }
        } else {
          console.error(data.error); // Handle error in the response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    

    fetchWishlistCount();
    fetchShoppingCartCount();
    fetchUserRole();
    
  }, [id]);

  console.log(wishlistCount);
  const [isBannerClosed, setBannerClosed] = useState(false);

  // Sync the global variable whenever isBannerClosed changes
  useEffect(() => {
    globalIsBannerClosed = isBannerClosed;
  }, [isBannerClosed]);

  useEffect(() => {
    console.log(isStudentStaff);
    if (isStudentStaff === null) return; // Wait until role is determined
    
    const getCartItems = async () => {
      try {
        const response = await fetch(`/api/get_cart`, {
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
  
        if (data.success) {
          setCartItems(data.result); 
        } else {
          console.error(data.error); // Handle error in the response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getCartItems();
  }, [id,isStudentStaff]);


  //const cartItems = [
  //  {
  //    id: "promo-seasonal-black",
  //    name: "Seasonal Tee - Black",
  //    price: 10.99,
  //    category: "Tops",
  //    images: ["/images/seasonal-black-1.png", "/images/seasonal-black-2.png"],
  //    stock: 20, // Adjust as needed
  //    sizes: ["XS", "S", "M", "L"],
  //    colours: ["Black"],
  //    description: "Comfortable Seasonal Tee in Black",
  //    promo: true,
  //    disc: "5%",
  //  },
  //  {
  //    id: "promo-os-blue",
  //    name: "Oversized - Blue",
  //    price: 10.99,
  //    category: "Tops",
  //    images: ["/images/os-blue-1.png", "/images/os-blue-2.png"],
  //    stock: 10, // Adjust as needed
  //    sizes: ["M", "L", "XL"],
  //    colours: ["Blue"],
  //    description: "Comfortable Oversized Tee in Blue",
  //    promo: true,
  //    disc: "5%",
  //  },
  //];

  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminAccount, setIsAdminAccount] = useState(false);

  // Function to check if the user has admin role
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const response = await fetch('/api/session'); 
        const data = await response.json();
        if (response.ok && data.user.username && data.user.role == 'Admin') {
          setIsAdminAccount(true); // User is admin role
          console.log("admin access in " + data.user.role);
        } else {
          setIsAdminAccount(false); // User is not admin
          console.log("admin access" + data.user.role);
        }
      } catch (error) {
        console.error("Error checking user session:", error);
        setIsAdminAccount(false); // Handle error by considering user as non-admin
      }
    };

    checkUserRole();
  }, []);


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

    const handleIsLoggedIn = () => {
      if (isLoggedIn) {
        router.push(`/wishlist?id=${id}`); // Redirect to checkout page if logged in
      } else {
        router.push("/log-in"); // Redirect to login page if not logged in
      }
    };

    const handleIsLoggedInCheckOut = () => {
      if (isLoggedIn) {
        router.push(`/checkout?id=${id}`); // Redirect to checkout page if logged in
      } else {
        router.push("/log-in"); // Redirect to login page if not logged in
      }
    };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'GET',
      });

      if (response.ok) {
        console.log("Logged out successfully");
        router.push('/log-in');  // Redirect to login page after logout
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };


  return (
    <div className="flex flex-col gap-0 fixed z-50 w-[100%] top-0">
      {/* top navbar */}
      <div className="flex px-16 py-3 justify-between items-center bg-beige z-50">
        <Link href={`/?id=${id}`}>
          <Image
            src={"/images/logo.png"}
            alt="Logo"
            height={48}
            width={100}
          ></Image>
        </Link>
        <div className="flex gap-0 rounded-sm overflow-hidden border-mainBlack border-[1px]">
          <Input
            type="search"
            placeholder="Search your favourites products"
            className="w-[500px] rounded-none shadow-none border-none font-light"
            value={Search}
                        onChange={(e) => {
                          let value = e.target.value; // Remove non-numeric characters
                        
                          setSearch(value); // Update the state with the formatted value
                        }}
          ></Input>
          <Button onClick={() => {SearchProduct()}} className="bg-mainBlack p-2 rounded-none flex">
            <SearchIcon className="text-white h-fill w-6"></SearchIcon>
          </Button>
        </div>

        <div className="flex items-center gap-6 z-50">
          {/* icon account */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="special"
                className="flex gap-2 items-center px-[10px] rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="20"
                  viewBox="0 0 18 20"
                  fill="none"
                >
                  <path
                    d="M1 19V18C1 14.69 3.69 12 7 12H11C14.31 12 17 14.69 17 18V19"
                    stroke="black"
                    strokeOpacity="0.87"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.99988 9C6.78988 9 4.99988 7.21 4.99988 5C4.99988 2.79 6.78988 1 8.99988 1C11.2099 1 12.9999 2.79 12.9999 5C12.9999 7.21 11.2099 9 8.99988 9Z"
                    stroke="black"
                    strokeOpacity="0.87"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-36 bg-mainWhite mt-2 flex flex-col p-2 rounded-lg shadow-md z-[70]">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/log-in"
                    className={`${buttonVariants({
                      variant: "ghost",
                    })} w-full `}
                  >
                    <DropdownMenuItem className="text-mainBlack text-sm" onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    href={`/history?id=${id}`}
                    className={`${buttonVariants({
                      variant: "ghost",
                    })} w-full `}
                  >
                    <DropdownMenuItem className="text-mainBlack text-sm">
                      My purchase
                    </DropdownMenuItem>
                  </Link>

                  {isAdminAccount ? (

                      <Link
                      href={`/admin_CheckOrder?id=${id}`}
                      className={`${buttonVariants({
                        variant: "ghost",
                      })} w-full `}
                      >
                      <DropdownMenuItem className="text-mainBlack text-sm">
                        Admin Page
                      </DropdownMenuItem>
                      </Link>
                    
                  ):(null)} 
                  
                </>
              ) : (
                <>
                  <Link
                    href="/log-in"
                    className={`${buttonVariants({
                      variant: "ghost",
                    })} w-full `}
                  >
                    <DropdownMenuItem className="text-mainBlack text-sm">
                      Sign in
                    </DropdownMenuItem>
                  </Link>
                  <Link
                    href="/sign-up"
                    className={`${buttonVariants({ variant: "ghost" })} w-full`}
                  >
                    <DropdownMenuItem className="text-mainBlack text-sm">
                      Sign up
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          {/* icon cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="special"
                className="flex gap-2 items-center px-[10px] rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="21"
                  height="20"
                  viewBox="0 0 21 20"
                  fill="none"
                >
                  <path
                    d="M4 5H17.79C18.0694 5.00001 18.3457 5.05857 18.6011 5.17191C18.8565 5.28524 19.0854 5.45083 19.2729 5.65801C19.4603 5.86519 19.6023 6.10936 19.6897 6.37478C19.777 6.64019 19.8078 6.92097 19.78 7.199L19.18 13.199C19.1307 13.6925 18.8997 14.1501 18.532 14.4829C18.1642 14.8157 17.686 15 17.19 15H7.64C7.17747 15.0002 6.72918 14.84 6.37144 14.5469C6.01371 14.2537 5.76866 13.8456 5.678 13.392L4 5Z"
                    stroke="black"
                    strokeOpacity="0.87"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 5L3.19 1.757C3.13583 1.54075 3.01095 1.34881 2.83521 1.21166C2.65946 1.0745 2.44293 1.00001 2.22 1H1M7 19H9M15 19H17"
                    stroke="black"
                    strokeOpacity="0.87"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="text-sm font-medium text-mainBlack">
                  {shoppingcartCount ?? 0}
                </div>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-mainWhite text-mainBlack rounded-tl-xl rounded-bl-xl">
              <SheetTitle className="text-xl">My Cart</SheetTitle>
              {cartItems.length > 0 ? (
                <div className="pt-4 flex flex-col gap-4 items-center">
                  <div className="flex flex-col w-full gap-2">
                    {cartItems.map((product) => (
                      <div className="relative">
                        <Link
                          href={`/${product.category?.toLowerCase()}/${product.id}?id=${id}`}
                          className="flex gap-3 w-full p-3 bg-mainWhite rounded-lg border-[1px] border-gray-100 hover:border-gray-200 hover:bg-gray-100"
                        >
                          <Image
                            src={product.images[0]}
                            alt="product image"
                            width={80}
                            height={80}
                            className="aspect-square object-cover rounded-sm"
                          ></Image>
                          <div className="flex items-center justify-between w-full gap-4">
                            <div className="flex flex-col justify-between h-full w-[170px] ">
                              <div className="flex flex-col gap-1 overflow-hidden">
                                <p className="font-medium text-sm">
                                  {product.name+ " " + product.sizes}
                                </p>
                                <p className="font-light text-xs text-muted-foreground truncate overflow-hidden ">
                                  {product.description}
                                </p>
                              </div>

                              <div className="flex gap-2 items-center">
                                <p
                                  className={`${
                                    product.disc === "0%"
                                      ? "text-mainBlack"
                                      : "text-primaryRed-600"
                                  } font-semibold text-lg`}
                                >
                                  ${product.price.toFixed(2)}
                                </p>
                                {product.disc === "0%" ? null : (
                                  <div className="text-xs text-primaryRed-600 border-primaryRed-600 border-[1px] rounded-[2px] flex items-center justify-center h-4 w-9">
                                    -{product.disc}
                                  </div>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  x {product.quantity} 
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                        <Trash onClick={() => deleteCartItem(product.category,product.id,product.name)} className="absolute w-4 h-4 right-4 top-[calc(50%-8px)]"></Trash>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={handleIsLoggedInCheckOut}
                    className={`${buttonVariants({
                      variant: "default",
                    })} w-full h-12`}
                  >
                    Checkout
                  </Button>
                </div>
              ) : (
                <div className="h-full flex flex-col gap-5 items-center justify-center">
                  <Image
                    width="240"
                    height="300"
                    src="/images/empty-cart.svg"
                    alt="empty-cart"
                  ></Image>
                  <div className="flex flex-col gap-1 items-center mb-20">
                    <h3 className="font-semibold text-lg">
                      Your cart is empty
                    </h3>
                    <p className="text-muted-foreground text-center text-sm">
                      Whoops! Nothing to show here yet.
                    </p>
                  </div>
                </div>
              )}
            </SheetContent>
          </Sheet>
            <Button
              variant="special"
              className="flex gap-2 items-center px-[10px] rounded-full"
              onClick={handleIsLoggedIn}
            >
              {/* icon wishlist */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M16.5 3C14.76 3 13.09 3.81 12 5.09C10.91 3.81 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z"
                  fill="black"
                  fillOpacity="0.87"
                />
              </svg>
              <div className="text-sm font-medium text-mainBlack">
                {wishlistCount ?? 0}
              </div>
            </Button>
        </div>
      </div>

      {/* category navbar */}
      <div className="flex py-2 justify-center items-center gap-3 shadow-md z-40 bg-white">
        <Link title="view all page" href={`/all?id=${id}`}>
          <Button className="text-mainBlack" variant="ghost">
            View All
          </Button>
        </Link>
        <Link title="tops page" href={`/tops?id=${id}`}>
          <Button className="text-mainBlack" variant="ghost">
            Tops
          </Button>
        </Link>
        <Link title="bottoms page" href={`/bottoms?id=${id}`}>
          <Button className="text-mainBlack" variant="ghost">
            Bottoms
          </Button>
        </Link>
        <Link title="accessories page" href={`/accessories?id=${id}`}>
          <Button className="text-mainBlack" variant="ghost">
            Accessories
          </Button>
        </Link>
        <Link title="others page" href={`/others?id=${id}`}>
          <Button className="text-mainBlack" variant="ghost">
            Others
          </Button>
        </Link>
      </div>
      
      {/* Announcment that the price shown is promo for student/staff */}
      {isStudentStaff && !isBannerClosed && (
        <div className="flex justify-between items-center bg-emerald-400 text-mainBlack py-2 px-6 z-40">
          <XIcon className="w-3 h-3 opacity-0"></XIcon>
          <p className="text-center text-xs">
            The price shown is promo for{" "}
            <span className="font-semibold">Student/Staff</span> 🎉
          </p>
          <XIcon
            className="w-3 h-3"
            onClick={() => {
              setBannerClosed(true);
            }}
          ></XIcon>
        </div>
      )}
    <Toaster/>
    </div>
  );
};

export default Navbar;