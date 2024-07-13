import connectDb from "@/lib/db";
import UserModel from "@/model/userModel";
import bcryptjs from "bcryptjs"
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
import { NextRequest } from "next/server";
import { sendEmail } from "@/helper/mailer";


// connectDb()

export async function POST(request: NextRequest){
    await connectDb()
    try {
        const {username,email,password} = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserVerifiedByUsername){
            return Response.json({
                message:"User already exist",
                success: false

            },{
                status:400
            })
        }
        const existingUserByEmail = await UserModel.findOne({email})
        console.log(existingUserByEmail);
        
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Already Verified"
                },{
                    status:400
                })
            }else{
                const hashedPassword = await bcryptjs.hash(password,10)
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+ 3600000)
                await existingUserByEmail.save()
            }
        }
        else{
            const hashedPassword = await bcryptjs.hash(password,10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password:hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isAcceptingMessage: true,
                isVerified: false,
                message: []
            })
            await newUser.save()
            console.log("user saved successfully");
            
        }
        
        //send verification email
        const response = await sendEmail(
            email,
            username,
            verifyCode
        )
        console.log(response);
        
        return Response.json({
            success: true,
            message: "Email sent"
        },{
            status:200
        })
        
    } catch (error) {
        console.log("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        },{
            status:500
        })
        
    }
}

