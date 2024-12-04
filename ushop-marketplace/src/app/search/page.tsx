"use client";

//import { products } from "../productsData";
import { useEffect, useState } from "react";
import ProductCards from "@/components/ProductCards";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function Page({ searchParams }) {
  const [allItems, setAllItems] = useState([]);
  const { id ,  search } = searchParams;  // Fetch the ID from the search params
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
            id: id,
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
  }, [id]); // Only fetch the user role when 'id' changes

  useEffect(() => {
    if (isStudentStaff === null) return; // Wait until role is determined
    
    // Fetching data from API endpoint
    const getSearch = async () => {
      try {
        const response = await fetch(`/api/get_search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            role: isStudentStaff,
            search,
          }),
        });
        const data = await response.json();
        console.log(data);
        // Assuming data is in the format { success: true, count: 5 }
        if (data.success && Array.isArray(data.result)) {
          setAllItems(data.result); // Extracting the count from the response
        } else {
          console.error("Unexpected response format:", data);
          setAllItems([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setAllItems([]);
      }
    }

    getSearch();
  }, [id,isStudentStaff,search]);

  console.log(allItems);

  return (
    <>
    <Navbar id={id}/>
      <div className="px-40 gap-4 flex flex-col py-6 relative z-10 top-[148px]">
        <div className="text-left text-sm text-mainGrey">
          <Link href={`./?id=${id}`} className="underline hover:color-darkRed">
            Home
          </Link>
        </div>
        <div className="text-left text-5xl font-bold text-darkRed">
          Search Result
        </div>
      </div>

      <hr />
      <div className="w-full px-40 py-36 gap-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {allItems.length > 0 ? (
            allItems.map((product) => (
                <ProductCards
                  key={product.id+product.name+product.category}
                  name={product.name + " " + product.size}
                  id={product.id}
                  images={product.images}
                  price={product.price}
                  disc={product.disc}
                  category={product.category}
                  liked={product.liked}
                  userid={product.userID}
                  quantity={product.quantity}
                />
              ))
            ) : (
                <p className="text-muted-foreground text-center text-sm">
                    Unable to find related product.
                </p>
            )
        }
      </div>
    </>
  );
}
