"use client";
import React, { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModeToggle } from "@/components/Toggle";
import Link from "next/link";

const page = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  const debounced = useDebounceCallback(setUsername, 400);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setIsCheckingUsername(true);
        // setUsernameMessage("");
        try {
          const response = await axios.get<ApiResponse>(
            `/api/check-username-unique?username=${username}`
          );
          
          let message = response.data.message
          setUsernameMessage(message);
          
        } catch (error) {
          console.error("Error occured while checking username: ", error);
        } finally {
          setIsCheckingUsername(false);
          // console.log(usernameMessage);
        }
      }
      setIsCheckingUsername(false);
    };
    checkUsername();
  }, [username]);

  const onSubmit = async (data: any) => {
    setIsSubmit(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      toast({
        title: "success",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmit(false);
    } catch (error) {
      console.log("Error while submitting the form", error);
      toast({
        title: "Failed",
        description: "User already Exists",
        variant: "destructive",
      });
      setIsSubmit(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      
      <div className="w-full max-w-md p-4 space-y-8 rounded-2xl shadow-2xl border">
      <ModeToggle></ModeToggle>
        <div className="">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-4xl mb-6">
              Join Anonymous Wave
            </h1>
            <p className="mb-4">Sign up to start your anonymous adventure</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Username"
                        className="rounded-xl bg-transparent"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debounced(e.target.value);
                        }}
                      />
                    </FormControl>
                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                    {!isCheckingUsername && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'?"text-red-600": "text-green-400"} ml-3`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Email" {...field} className="rounded-xl bg-transparent"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        className="rounded-xl bg-transparent"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="text-center">
                <Button type="submit" className="">
                  {isSubmit ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please Wait
                      </Loader2>
                    </>
                  ) : (
                    "SignUp"
                  )}
                </Button>
              </div>
            </form>
          </Form>
          <p className="text-center p-1">
            Already a User?
            <Link href={"/signin"} className="font-bold text-blue-700"> Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;

// function zodResolver(
//   signUpSchema: ZodObject<
//     { username: ZodString; email: ZodString; password: ZodString },
//     "strip",
//     ZodTypeAny,
//     { username: string; email: string; password: string },
//     { username: string; email: string; password: string }
//   >
// ):
//   | import("react-hook-form").Resolver<
//       import("react-hook-form").FieldValues,
//       any
//     >
//   | undefined {
//   throw new Error("Function not implemented.");
// }
