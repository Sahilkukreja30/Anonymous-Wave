import connectDb from "@/lib/db";
import UserModel from "@/model/userModel";
import { log } from "console";
import { verify } from "crypto";


export async function POST(request: Request){

    await connectDb()
    try {
        const {username, code} = await request.json()
        const decodedUsername = decodeURIComponent(username)
        console.log(username);
        console.log(decodedUsername);
        
        const user = await UserModel.findOne({username: decodedUsername})
        console.log(user)
        if(!user){
            return Response.json({
                success:false,
                message:"User not Found"
            },{status:400})
        }

        const validCode = user.verifyCode === code
        const codeExpiry = new Date(user.verifyCodeExpiry) > new Date()

        if(validCode && codeExpiry){
            user.isVerified = true
            await user.save()
            return Response.json({
                success:true,
                message:"User Verified Successfully"
            },{status:200})
        }else if(!codeExpiry){
            return Response.json({
                success:false,
                message:"Expiry Date passed please sign up again to verify"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Incorrect Code"
            },{status:400})
        }

    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Veirfication failed"
        },{status:500})
    }
}