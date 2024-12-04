"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ArrowLeft, Container, Lock, Trash, Truck, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import { useRouter } from 'next/navigation';


function totalPrice(items: any, mode: string) {
  let totalprice = 0;

  for (const item of items) {
    totalprice += parseFloat(item.price);
  }

  if (mode === "self") {
    return totalprice.toFixed(2);
  }
  else {
    return (totalprice+5).toFixed(2);
  }
}



export default function Page({ searchParams }) {
  const router = useRouter();
  const { id , mode  } = searchParams;
  console.log(id+mode);

  const [cartItems, setCartItems] = useState([]);
  const [Name, setName] = useState('');
  const [expDate, setExpDate] = useState('');
  const [CardNum, setCardNum] = useState('');
  const [CVCNum, setCVCNum] = useState('');
  const [Postal, setPostal] = useState('');
  const [Address, setAddress] = useState('');

  const placeOrder = async () => {
    try {
      const response = await fetch(`/api/place_order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id, 
          collectionMode: mode,
          Name: Name,
          CardNum: CardNum,
          expDate: expDate,
          CVCNum: CVCNum,
          Address: Address,
          Postal: Postal
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success("Thank you for your order!", {
          position: 'top-right',
          duration: 3000
        });
        router.push(`/?id=${id}`);

      } else {
        console.error(data.error); // Handle error in the response
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const getCartItems = async () => {
    try {
      const response = await fetch(`/api/get_cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: id,
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

  useEffect(() => {
    // Get cart items
    getCartItems();
  }, []);

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
      <Navbar id={id}/>
      <div className="justify-center">
      <div className="flex flex-col h-screen z-10 pb-28">
        <div className="flex w-full h-full items-center justify-center my-16 relative z-10 top-[100px]">
          <div className="flex h-full bg-mainWhite rounded-2xl overflow-hidden border-[1px] border-gray-200 shadow-sm mx-36">
            {/* left side */}
            <div className=" justify-between min-w-[500px] h-full flex flex-col gap-4 overflow-hidden p-8 max-w-xl">
              <div className="w-full h-full flex flex-col gap-4 overflow-hidden ">
                <h1 className="text-2xl text-mainBlack font-bold">
                  Payment details
                </h1>
                <div className="gap-4 flex flex-col">
                  <div className="grid w-full items-center gap-1.5 text-mainBlack">
                    <Label className="text-xs" htmlFor="name">
                      Name on card
                    </Label>
                    <Input 
                    type="name" 
                    id="name" 
                    placeholder="Your name" 
                    value={Name}
                        onChange={(e) => {
                          let value = e.target.value; // Remove non-numeric characters
                        
                          setName(value); // Update the state with the formatted value
                        }}
                    />
                  </div>
                  <div className="flex-col gap-2 flex">
                    <div className="grid w-full items-center gap-1.5 text-mainBlack">
                      <Label className="text-xs" htmlFor="number">
                        Card number
                      </Label>
                      <Input
                        type="cardNum"
                        id="cardNum"
                        placeholder="1234 XXXX XXXX XXXX"
                        maxLength={19}      // Sets the input limit to 16 characters
                        value={CardNum}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

                            // Insert spaces after every 4 digits
                            if (value.length > 4) {
                              value = value.slice(0, 4) + ' ' + value.slice(4);
                            }
                            if (value.length > 9) {
                              value = value.slice(0, 9) + ' ' + value.slice(9);
                            }
                            if (value.length > 14) {
                              value = value.slice(0, 14) + ' ' + value.slice(14);
                            }
                          
                            setCardNum(value); // Update the state with the formatted value
                          }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="grid w-full items-center gap-1.5 text-mainBlack">
                        <Label className="text-xs" htmlFor="date">
                          Expiry date
                        </Label>
                        <Input
                          type="expDate"
                          id="expDate"
                          placeholder="MM/YY"
                          maxLength={5}                       // Limits input to 5 characters
                          value={expDate}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters

                            // If length is more than 2 and there's no slash, add it after the first two digits
                            if (value.length > 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                          
                            setExpDate(value); // Update the state with the formatted value
                          }}
                        />
                      </div>
                      <div className="grid w-full items-center gap-1.5 text-mainBlack">
                        <Label className="text-xs" htmlFor="CVCNum">
                          CVC
                        </Label>
                        <Input 
                        type="CVCNum" 
                        id="CVCNum" 
                        placeholder="XXX" 
                        maxLength={3}      // Sets the input limit to 3 characters
                        value={CVCNum}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                          
                            setCVCNum(value); // Update the state with the formatted value
                          }}
                        />
                      </div>
                    </div>
                    {mode === "delivery" && (
                    <div>
                    <div className="grid w-full items-center gap-1.5 text-mainBlack">
                      <Label className="text-xs" htmlFor="address">
                        Billing address
                      </Label>
                      <Input
                        type="address"
                        id="address"
                        placeholder="Your address (including street name, block, unit no.)"
                        value={Address}
                        onChange={(e) => {
                          let value = e.target.value; // Remove non-numeric characters
                        
                          setAddress(value); // Update the state with the formatted value
                        }}
                      />
                    </div>
                    <div className="grid w-full items-center gap-1.5 text-mainBlack">
                      <Label className="text-xs" htmlFor="Postal">
                        Postal code
                      </Label>
                      <Input 
                      type="PostalCode" 
                      id="PostalCode" 
                      placeholder="Postal code" 
                      maxLength={6}      // Sets the input limit to 3 characters
                      value={Postal}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
                        
                          setPostal(value); // Update the state with the formatted value
                        }}
                      />
                    </div>
                    </div>
                  )}
                  </div>
                </div>
              </div>
              <Button onClick={() => {placeOrder()}} className="py-6 px-5 rounded-full"><Lock className="w-3 h-3 mr-2"></Lock>Pay Now</Button>
            </div>

            {/* right side */}
            <div className="min-w-[500px] h-full flex flex-col gap-4 overflow-hidden p-8 bg-slate-100 text-mainBlack">
              <h1 className="text-lg text-mainBlack font-semibold">
                Order summary
              </h1>
              <div className="flex flex-col pb-4 gap-2 text-mainBlack w-full border-b-[1px]">
                {cartItems.map((product) => (
                  <div className="flex gap-3 w-full">
                    <Image
                      width={56}
                      height={56}
                      src={product.images[0]}
                      alt={`producId-${product.id}`}
                      className="object-cover aspect-square rounded-md"
                    ></Image>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{product.name + " " + product.sizes}</p>
                        <p className="text-xs font-light text-muted-foreground">
                          {product.category}
                        </p>
                      </div>
                      <p className="text-sm font-medium">
                        ${product.price.toFixed(2)}{" "}
                        <span className="text-xs font-light text-muted-foreground">
                          x {product.quantity}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between w-full pb-3">
                <p className="text-md font-medium">Total</p>
                <p className="text-md font-bold">
                  ${totalPrice(cartItems, mode)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
    ): (
      <div className="flex justify-center items-center h-screen">
    <p className="text-center text-black font-bold">Access denied.</p>
  </div>
    )
    
  );
};
