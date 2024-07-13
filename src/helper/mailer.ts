import nodemailer from "nodemailer"



export const sendEmail = async (emailId:string,username:string,verifyCode:string) => {
    const email = process.env.EMAIL
    const pass = process.env.EMAIL_PASS
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth : {
            user: email,
            pass: pass
        }
    })
    const mailOptions = {
        from: email,
        to: emailId,
        subject: "Anonymous Wave |  Verify Your email",
        text:"Verify Your email",
        html: `Verification Code is ${verifyCode}`
    }

    try {
        await transporter.sendMail(mailOptions)
    } catch (error) {
        console.log("A error occured while sending mail");
        
    }
}