"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "./ui/accordion";
import { useState, useEffect } from "react";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";

type FilterState = {
  price: [number, number];
  size: string[];
};

type FilterAccordionProps = {
  onFilterChange: (newFilters: FilterState) => void;
};

const Filter: React.FC<FilterAccordionProps> = ({ onFilterChange }) => {
  const [selectedPrice, setSelectedPrice] = useState<[number, number]>([0, 100]); 
  const [selectedSize, setSelectedSize] = useState<string[]>(["XS", "S", "M", "L", "XL", "One Size"]);
  //const [selectedColor, setSelectedColor] = useState<string[]>(["Black", "Red", "Navy", "Grey", "Blue", "Green", "Beige", "White", "Pink", "Purple"]);
  const [maxPrice, setMaxPrice] = useState(100)

  const handleSliderChange = (newValues: number[]) => {
    const newMaxPrice = newValues[0];
    setMaxPrice(newMaxPrice);
    setSelectedPrice([0, newMaxPrice]);
  }

  const handleInputChange = (value: string) => {
    const newValue = parseInt(value, 10);
    if (!isNaN(newValue) && newValue >= 0 && newValue <= 100) {
      setMaxPrice(newValue);
      setSelectedPrice([0, newValue]); 
    }
  }

  useEffect(() => {
    handleFilterChange();
  }, [selectedPrice, selectedSize]);

  const handleFilterChange = () => {
    onFilterChange({
      price: selectedPrice,
      size: selectedSize,
    });
  };

  return (
    <div className="w-full lg:w-64 p-4">
      <Accordion type="multiple" className="space-y-4">

        {/* Price Filter */}
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              <label>Price Range: ${selectedPrice[0]} - ${selectedPrice[1]}</label>
              <Slider
                value={[maxPrice]}
                max={100}
                step={1}
                onValueChange={handleSliderChange}
                className="w-full"
              />
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="min-price">Min Price</Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={0}
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor="max-price">Max Price</Label>
                  <Input
                    id="max-price"
                    type="number"
                    min={0}
                    max={100}
                    value={maxPrice}
                    onChange={(e) => handleInputChange(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Showing items priced $0 - ${maxPrice}
              </p>
            </div>
        </AccordionContent>
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {["XS", "S", "M", "L", "XL", "One Size"].map((size) => (
                <label key={size}>
                <Checkbox
                  checked={selectedSize.includes(size)}
                  onCheckedChange={() => {
                    const newSizeSelection = selectedSize.includes(size)
                    ? selectedSize.filter((s) => s !== size)
                      : [...selectedSize, size];
                    setSelectedSize(newSizeSelection);
                  }}
                />{" "}
                {size}
              </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        {/*<AccordionItem value="color">
          <AccordionTrigger>Color</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col space-y-2">
              {["Black", "Red", "Navy", "Grey", "Blue", "Green", "Beige", "White", "Pink", "Purple"].map((color) => (
              <label key={color}>
                <Checkbox
                  checked={selectedColor.includes(color)}
                  onCheckedChange={() => {
                    const newColorSelection = selectedColor.includes(color)
                      ? selectedColor.filter((c) => c !== color)
                      : [...selectedColor, color];
                    setSelectedColor(newColorSelection);
                  }}
                />{" "}
                {color}
              </label>
            ))}
            </div>
          </AccordionContent>
        </AccordionItem>*/}

        {/* Clear Filter Button */}
        <Button 
          className="mt-10 bg-beige"
          variant="outline"
          onClick={() => {
            setSelectedPrice([0, 100]);
            setSelectedSize(["XS", "S", "M", "L", "XL", "One Size"]);
            //setSelectedColor(["Black", "Red", "Navy", "Grey", "Blue", "Green", "Beige", "White", "Pink", "Purple"]);
          }}
        >
          Clear Filter
        </Button>
      </Accordion>
    </div>
  );
};

export default Filter;
