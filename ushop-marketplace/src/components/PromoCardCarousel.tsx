"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import PromoCards from "./PromoCard";
import { products } from "@/app/productsData";

const PromoCardCarousel = () => {
  const promoItems = products.filter((item) => Boolean(item.promo));
  return (
    <Carousel className="w-full relative px-0">
      <CarouselContent className="px-0 -ml-4 ">
        {promoItems.map((item) => (
          <CarouselItem key={item.id} className="basis-1/8 pl-4">
            <PromoCards
              name={item.name}
              price={item.price}
              images={item.images}
              disc={item.disc}
              id={item.id}
              category={item.category}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-opacity-15" />
      <CarouselNext className="bg-opacity-15" />
    </Carousel>
  );
};

export default PromoCardCarousel;
