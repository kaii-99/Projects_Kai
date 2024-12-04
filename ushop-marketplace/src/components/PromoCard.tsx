"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

interface PromoCardsProps {
  name: string;
  images: string[];
  id: string | number;
  price: number;
  disc: string;
  category: string;
}

const PromoCards: React.FC<PromoCardsProps> = ({
  name,
  id,
  images,
  price,
  disc,
  category
}) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <Link className="w-[192px] overflow-hidden block" href={`/${category?.toLowerCase()}/${id}`}>
      <div className="flex flex-col gap-1">
        <div
          className="w-full aspect-[2/3] relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
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
        </div>
        <p className="text-sm text-mainBlack">{name}</p>
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <p className="text-primaryRed-600 font-semibold text-md">
              ${price.toFixed(2)}
            </p>
            <div className="text-xs text-primaryRed-600 border-primaryRed-600 border-[1px] rounded-[2px] flex items-center justify-center h-4 w-9">
              -{disc}
            </div>
          </div>
          {/* add to cart button */}
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
        </div>
      </div>
    </Link>
  );
};

export default PromoCards;
