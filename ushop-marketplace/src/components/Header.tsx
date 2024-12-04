// Ghost
import { SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const cartCount = 0;
  const wishlistCount = 0;

  return (
    <div className="flex flex-col gap-0">
      {/* top navbar */}
      <div className="flex px-16 py-3 justify-between items-center bg-beige z-10">
        <Link href="./">
        <Image src={'/images/logo.png'} alt="Logo" height={48} width={100}></Image>
        </Link>
      </div>
      </div>
  );
};

export default Header;
