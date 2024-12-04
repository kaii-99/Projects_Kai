import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Page = () => {
  return (
    <>
      <div className="w-full h-screen z-10">
        <div className="flex flex-col items-center w-full py-56">
          <div className="flex flex-col items-center gap-8 w-[500px]">
            <h1 className="font-bold text-3xl">Log In as Student/Staff</h1>
            <form className="grid gap-6 w-full">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="email">NTU Email</Label>
                <Input
                  placeholder="you@e.ntu.edu.sg"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10"
                  )}
                ></Input>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  placeholder="Your password"
                  className={cn(
                    { "focus-visible:ring-mainBlack": true },
                    "w-full h-10"
                  )}
                ></Input>
              </div>
            </form>
            <Button className="w-full h-10">Log In</Button>
            <div className="flex gap-3 w-full items-center">
              <div className="bg-mainBlack h-[1px] w-full"></div>
              <p className="font-bold text-md">or</p>
              <div className="bg-mainBlack h-[1px] w-full"></div>
            </div>
            <Link href="/log-in" className="w-full h-10">
              <Button className="w-full h-10" variant="outline">
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
    </>
  );
};

export default Page;
