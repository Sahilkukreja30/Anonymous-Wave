import UserModel from "@/model/userModel";
import connectDb from "@/lib/db";
import { NextRequest } from "next/server";
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { any } from "zod";
import mongoose from "mongoose";


export async function DELETE(req: NextRequest,{params}:{params: {messageid: string}}){
    const messageid = params.messageid
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User
    if (!session || !user) {
        return Response.json(
          { success: false, message: 'Not authenticated' },
          { status: 401 }
        );
    }
    const updatedMessageId = new mongoose.Types.ObjectId(messageid)
    
    try {
        await connectDb()
        const updateResult = await UserModel.updateOne(
            {username:user.username},
            {$pull: {messages: {_id: updatedMessageId}}}
        )
        
        
        if(updateResult.modifiedCount === 0){
            return Response.json({
                success: false,
                message: "Result not updated"
            },{
                status:404
            })
        }

        return Response.json({
            success:true,
            message: "Message Deleted"
        },{
            status:200
        })
    } catch (error) {
        console.error('An unexpected error occurred:', error);
        return Response.json(
        { message: 'Message error', success: false },
        { status: 500 }
    );
    }
}