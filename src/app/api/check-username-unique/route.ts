import connectDb from "@/lib/db";
import UserModel from "@/model/userModel";
import { usernameValidation } from "@/schemas/signUpSchema";
import {z} from "zod"


const usernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    
    await connectDb();
    
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const result = usernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', '):"Invalid query parameters"
            },{status:500})
        }

        const {username} = result.data
        const existingUser = await UserModel.findOne({username: username, isVerified: true})
        console.log(existingUser);
        
        if(existingUser?.isVerified){
            return Response.json({
                success:false,
                message:"Username is already taken"
            },{
                status:400
            })
        }else{
            return Response.json({
                success:true,
                message:"Username is Unique"
            })
        }
    } catch (error:any) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Something went wrongs"
        })
        
    }
}