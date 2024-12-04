"use client";  // Ensure this component is treated as a client component

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createConnection } from '@/lib/db';

export default function Page({ searchParams }) {
    const router = useRouter();  // Initialize the router
    const { id, removeItemId, category } = searchParams;  // Get wishlist ID and item to remove

    const [isProcessing, setIsProcessing] = useState(true); // Track if the removal is in progress
  
    // Remove item and redirect
    useEffect(() => {
      const handleRemoveAndRedirect = async () => {
        try {
          const response = await fetch('/api/update-wishlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id,
              ItemId: Number(removeItemId),
              category: String(category),
              mode: "delete",
            }),
          });
  
          const data = await response.json();
          console.log('Reload');
          if (data.success) {
            console.log('Reload');
            // Redirect to the updated wishlist page after successful removal
            router.push(`/wishlist?id=${id}`);
            router.refresh();
          } else {
            console.error('Failed to update wishlist:', data.error);
          }
        } catch (error) {
          console.error('Error in removing wishlist item:', error);
        } finally {
          setIsProcessing(false);  // Set processing to false when done
        }
      };
  
      handleRemoveAndRedirect();
    }, [id, removeItemId, category, router]);
  
    // Optionally show a loading message or spinner
    return <div>Processing your request, please wait...</div>;
}
