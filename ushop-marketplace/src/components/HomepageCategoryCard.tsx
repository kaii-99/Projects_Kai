"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface HomepageCategoryCardsProps {
  title: string;
  id: string;
  userid: string;
}

const HomepageCategoryCards: React.FC<HomepageCategoryCardsProps> = ({
  title,
  id,
  userid,
}) => {
  const [isHovered, setHovered] = useState(false);
  return (
    <Link className="w-full overflow-hidden" href={`/${id}?id=${userid}`}>
      <div
        className={`h-[420px] relative transition-shadow duration-200 ease-in ${
          isHovered ? "shadow-sm" : ""
        }`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={`/images/${id}.png`}
          alt={title}
          fill={true}
          style={{objectFit: "cover"}}
          className={` absolute category-card-image transition-transform duration-200 ease-in ${
            isHovered ? "transform scale-105" : ""
          }`}
        ></Image>
        {/* mask */}
        {!isHovered && (
          <div className="absolute w-full h-full flex items-center justify-center">
            <div className="absolute w-full h-full bg-mainBlack opacity-40"></div>
            <p className="font-semibold text-xl absolute text-mainWhite">{title}</p>
            
          </div>
        )}
      </div>
    </Link>
  );
};

export default HomepageCategoryCards;
