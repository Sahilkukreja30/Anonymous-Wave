"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {useCompletion} from 'ai/react'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
const page = () => {
  const [message, setMessage] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  const { toast } = useToast();
  const params = useParams<{ username: string }>();
  const form = useForm({
    resolver: zodResolver(messageSchema),
  });
  const username = params.username;

  

  const onSubmit = async (data: any) => {

  };
  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };
  return (
    <div className="container mx-auto p-6 min-h-screen rounded max-w-4xl">
      <div>
        <h1 className="font-bold text-4xl md:text-4xl text-center">
          Public Profile Link
        </h1>
      </div>
      <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <div className="text-center">
                    <Textarea
                      placeholder="Write your anonymous message here"
                      className="w-[50rem]"
                      {...field}
                    />
                  </div>
                  
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center">
            {isLoading ? (
              <Button>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit">
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
};

export default page