"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Page = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login submitted:", email, password);
    alert("Login submitted:"+ email+ password)

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (response.ok) {
          if(data.success == true)
          {
            console.log("Login successful", data);
            setErrorMessage(''); 
            router.push(`/?id=${data.id}`); 
          }
          else{
            console.log("Login unsuccessful", data);
            setErrorMessage("NOTE: Invalid email or password.");
          }
        } else {
          console.error("Login failed", data.message);
        }
      } else {
        const text = await response.text();
        console.error("Unexpected response format", text);
      }
    } catch (error) {
      console.error("Error submitting login form", error);
    }
  };

  return (
    <div>
      <div className="w-full h-screen">
        <Header></Header>
        <div className="flex flex-col items-center w-full py-40">
          <div className="flex flex-col items-center gap-8 w-[500px]">
            <h1 className="font-bold text-3xl text-black">Log In</h1>
            <form className="grid gap-6 w-full" onSubmit={onSubmit}>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="email" className="text-black font-bold">Email</Label>
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10 text-black"
                  )}
                ></Input>

              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="password" className="text-black font-bold">Password</Label>
                <Input
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10 text-black"
                  )}
                ></Input>
              </div>
              {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              <Button type="submit" className="w-full h-10" >Log In</Button>
            </form>
            
            <div className="flex gap-3 w-full items-center">
              <div className="bg-mainBlack h-[1px] w-full"></div>
              <p className="font-bold text-md text-black">or</p>
              <div className="bg-mainBlack h-[1px] w-full"></div>
            </div>
            <Link href="/" className="w-full h-10">
              <Button className="w-full h-10 text-black" variant="outline">
                Continue as Guest
              </Button>
            </Link>
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/sign-up"
            >
              Don't have an account? Sign Up!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
