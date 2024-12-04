"use client";

import { useEffect, useState } from "react";
import Products from "@/components/Products";
import Navbar from "@/components/Navbar";

export default function Page({ searchParams }) {
  const [accessoryItems, setAccessoryItems] = useState([]);
  const { id } = searchParams;  // Fetch the ID from the search params
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
    const getAccessorys = async () => {
      try {
        const response = await fetch(`/api/get_products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            category: 'accessories',
            id: id,
            role: isStudentStaff,
          }),
        });
        const data = await response.json();
        // Assuming data is in the format { success: true, count: 5 }
        if (data.success) {
          setAccessoryItems(data.result); // Extracting the count from the response
        } else {
          console.error(data.error); // Handle error in the response
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getAccessorys();
  }, [id,isStudentStaff]);

  return (
    <>
    <Navbar id={id}/>
    <Products title="Accessories" products={accessoryItems} userid={id}/>
    </>
  );
}

