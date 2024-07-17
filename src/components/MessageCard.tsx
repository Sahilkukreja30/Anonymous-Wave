import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dayjs from "dayjs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { Message } from "@/model/userModel";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { useToast } from "./ui/use-toast";
import { X } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type messageCardProps = {
  message: Message;
  onmessageDelete: (messageId: any) => void;
};
const MessageCard = ({ message, onmessageDelete }: messageCardProps) => {
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  setTimeout(() => {
    setLoadingSkeleton(true);
  }, 3000);
  const { toast } = useToast();
  const handleDelete = async () => {
    const response = await axios.delete<ApiResponse>(
      `api/delete-message/${message._id}`
    );
    toast({
      title: response.data.message,
      description: "Hii",
    });
    onmessageDelete(message._id);
  };

  return (
    <Card className="card-bordered">
      {loadingSkeleton ? (
        <>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{message.content}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="btn bg-red-500 text-white btn-circle">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this message.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="text-sm">
              {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
            </div>
          </CardHeader>
          <CardContent></CardContent>
        </>
      ) : (
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-[125px] w-[250px] rounded-xl " />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default MessageCard;
