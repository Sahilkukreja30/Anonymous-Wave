import resend from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";


export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous Messanger |  Verify Your email',
            react: VerificationEmail({username: username,otp: verifyCode})
          })
        return {success: true, message:"Verification email sent successfully"}
    } catch (error) {
        console.error(error);
        
        return {success: false, message:"Verification email not send"}
    }
}