"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { verifySchema } from "@/schemas/verifySchema";
import { ModeToggle } from "@/components/Toggle";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function VerifyAccount() {
  const [isSubmit, setIsSubmit] = useState(false)
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      setIsSubmit(true)
      const response = await axios.post<ApiResponse>(`/api/verifyCode`, {
        username: params.username,
        code: data.code,
      });

      toast({
        title: "Success",
        description: response.data.message,
      });

      router.replace("/signin");
      setIsSubmit(false);
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Verification Failed",
          description:
            axiosError.response?.data.message ??
            "An error occurred. Please try again.",
          variant: "destructive",
        });
        setIsSubmit(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-lg border-2">
        <ModeToggle></ModeToggle>
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmit}
              className="text-bold bg-gradient-to-r from-purple-600 to-sky-400"
            >
              {isSubmit ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin">
                    Please Wait
                  </Loader2>
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
