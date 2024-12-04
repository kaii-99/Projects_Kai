"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  AuthCredentialsValidator,
  TAuthCredentialsValidator,
} from "@/lib/validators/account-credentials-validator";
import { createConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import { useState } from "react";

const Page = () => {

  const [errorMessage, setErrorMessage] = useState(''); 
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAuthCredentialsValidator>({
    resolver: zodResolver(AuthCredentialsValidator),
  });

  const onSubmit = async({
    email,
    password,
    password2,
  }: TAuthCredentialsValidator) => {
    alert("Form submitted!");
    console.log(email+" "+password+" "+email.split('@')[1]);
    console.log("submitted");
    const username = email.split('@')[0];
    const formattedUsername = username.charAt(0).toUpperCase() + username.slice(1).toLowerCase();
    let role;

    if(email.split('@')[1] == 'e.ntu.edu.sg'){
      role = 'Student'}
     else if(email.split('@')[1] == 'ntu.edu.sg'){
      role = 'Staff'}
      else{
      role = 'Normal'}

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          formattedUsername,
          password,
          role,
        }),
      });

      const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    if (response.ok) {
      if(data.success == true)
        {
          console.log("Registration successful", data);
          router.push("/log-in"); 
          setErrorMessage(''); 
        }
        else{
          console.log("Registration unsuccessful", data);
          setErrorMessage("NOTE: Email has been taken.");
        }
    } else {
      console.error("Error registering user", data);
    }
  } else {
    const text = await response.text();
    console.error("Unexpected response format", text);
  }
} catch (error) {
  console.error("Error submitting form", error);
}
  };

  return (
    <div>
      <div className="w-full h-screen">
        <Header></Header>
        <div className="flex flex-col items-center w-full py-40">
          <div className="flex flex-col items-center gap-8 w-[500px]">
            <h1 className="font-bold text-3xl text-black">Sign Up</h1>
            <form
              className="grid gap-6 w-full"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="email" className="text-black font-bold">Email</Label>
                <Input
                  {...register("email")}
                  placeholder="you@example.com"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10 text-black"
                  )}
                ></Input>
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
                 {errorMessage && (
                  <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="password" className="text-black font-bold">Password</Label>
                <Input
                  {...register("password")}
                  placeholder="Password"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10 text-black"
                  )}
                ></Input>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="password2" className="text-black font-bold">Confirm Password</Label>
                <Input
                  {...register("password2")}
                  placeholder="Password"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10 text-black"
                  )}
                ></Input>
                {errors.password2 && (
                  <p className="text-red-500 text-sm">{errors.password2?.message}</p>
                )}
              </div>
              <Button className="w-full h-10" type="submit">Sign Up</Button>
            </form>
            {/* <div className="flex gap-3 w-full items-center">
              <div className="bg-mainBlack h-[1px] w-full"></div>
              <p className="font-bold text-md">or</p>
              <div className="bg-mainBlack h-[1px] w-full"></div>
            </div>
            <Link href="/log-in" className="w-full h-10">
              <Button className="w-full h-10" variant="outline">
                Continue as Guest
              </Button>
            </Link> */}
            <Link
              className={buttonVariants({ variant: "link" })}
              href="/log-in"
            >
              Have an account? Log in!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
