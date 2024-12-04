"use client";

import ProductCards from "@/components/ProductCards";
import Link from "next/link";
import React, { useState } from "react";
import Filter from "@/components/Filter";

type Product = {
  id: number;
  name: string;
  price: number;
  images: string;
  category: string;
  stock: number;
  sizes: string[];
  colours: string[];
  description: string[],
  liked: boolean,
  count?: number
}

type ProductsProps = {
  title: string;
  products: Product[];
  userid: string;
};


const Products: React.FC<ProductsProps> = ({ title, products, userid }) => {
  const [filters, setFilters] = useState({
    price: [0, 100],
    size: ["XS", "S", "M", "L", "XL"],
  });

  console.log(products);
  

  const handleFilterChange = (newFilters: { price: [number, number]; size: string[]; color: string[] }) => {
    setFilters(newFilters);
  };

  const filteredProducts = products.filter((product) => {
    // Apply Price Filter
    const matchesPrice = product.price >= filters.price[0] && product.price <= filters.price[1];

    // Apply Size Filter
    const matchesSize = filters.size.length ? filters.size.some((size) => product.sizes.includes(size)) : true;

    //// Apply Color Filter
    //const matchesColor = filters.color.length ? filters.color.some((color) => product.colours.includes(color)) : true;

    return matchesPrice && matchesSize && product.category;
  });

  console.log(products);
  console.log(userid);

  return (
    <>
      <div className="w-[1350px] px-40 gap-4 flex flex-col py-6 relative z-10 top-[148px]">
        {/* Breadcrumb */}
        <div className="text-left text-sm text-mainGrey">
          <Link href={`./?id=${userid}`} className="underline hover:color-darkRed">
            Home
          </Link>
          &nbsp;&nbsp; &gt; &nbsp;&nbsp;
          <Link href="" className="underline hover:color-darkRed">
            {title}
          </Link>
        </div>
        <div className="text-left text-5xl font-bold text-darkRed">{title}</div>
      </div>
  
      <hr />
  
      <div className="w-80% px-40 py-36 flex">
        {/* Filter */}
        <div className="w-1/4 pr-8 ">
          <Filter onFilterChange={handleFilterChange} />
        </div>
  
        {/* Product Listings */}
        <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:space-x-5">
            {filteredProducts.map((product) => (
              <ProductCards
                key={product.id}
                name={product.name}
                id={product.id}
                images={product.images}
                price={product.price}
                disc={product.disc}
                category={product.category}
                liked={product.liked}
                userid={userid}
                quantity={product.quantity}
              />
            ))}
        </div>
      </div>
    </>

  );
}

export default Products;