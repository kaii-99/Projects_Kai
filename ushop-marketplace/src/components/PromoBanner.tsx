"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Image from "next/image";

const PromoBanner = () => {
  const [isPromoHovered, setPromoHovered] = useState(false);

  return (
    <Carousel
      opts={{ loop: true }}
      className="w-full relative"
      onMouseEnter={() => setPromoHovered(true)}
      onMouseLeave={() => setPromoHovered(false)}
    >
      <CarouselContent>
        {Array.from({ length: 3 }).map((_, index) => (
          <CarouselItem key={index}>
            <div className="p-1">
              <Card className="p-0 overflow-hidden shadow-none border-none">
                <CardContent className="flex aspect-[6/1] items-center justify-center p-0">
                  <img
                    src={`/images/promo-${index + 1}.png`}
                    className="w-full"
                  ></img>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>

      {isPromoHovered && <CarouselPrevious className="absolute left-6 " />}
      {isPromoHovered && <CarouselNext className="absolute right-6" />}
    </Carousel>
  );
};

export default PromoBanner;
