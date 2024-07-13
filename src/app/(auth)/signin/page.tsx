"use client";

import { ModeToggle } from "@/components/Toggle";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {signIn} from "next-auth/react"
import { signInSchema } from "@/schemas/signInSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Link from "next/link";

function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const {toast} = useToast()
  const form = useForm({
    resolver: zodResolver(signInSchema),
  });
  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      const response = await signIn('credentials',{
        redirect:false,
        identifier: data.email,
        password: data.password, 
      })
      if (response?.error) {
        if (response.error === 'CredentialsSignin') {
          toast({
            title: 'Login Failed',
            description: 'Incorrect username or password',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Error',
            description: response.error,
            variant: 'destructive',
          });
        }
      }
  
      if (response?.url) {
        toast({
          title: "Success",
          description:"Logged in Successfully"
        })
        router.replace('/dashboard');
      }
      setIsLoading(false)
    } catch (error) {

      console.log("Error while submitting the form", error);
      toast({
        title: "Failed",
        description: "Error while submitting the form",
        variant: "destructive",
      });
      setIsLoading(false)
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg border-2">
        <ModeToggle></ModeToggle>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Login
          </h1>
          <p className="mb-4">Enter your credentials to start your journey!</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      {...field}
                      className="rounded-x"
                    />
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
                      className="rounded-xl"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
            <Button type="submit">
              {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin">
                      Please Wait
                      </Loader2>
                    </>
                  ):(
                    "Sign In"
                  )}
            </Button>
            </div>
            
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
