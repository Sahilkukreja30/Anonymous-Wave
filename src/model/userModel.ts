import mongoose,{Schema,Document} from "mongoose";

export interface Message extends Document{
    content: string,
    createdAt: Date
}

const messageSchema: Schema<Message> = new Schema({
    content: {
        type:String,
        required:true
    },
    createdAt: {
        type:Date,
        required: true,
        default: Date.now()
    }
})

export interface User extends Document{
    username: string,
    email:string,
    password:string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isAcceptingMessage: boolean,
    isVerified: boolean
    messages: Message[]

}

const UserSchema: Schema<User> = new Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    }
    ,
    password:{
        type:String,
        required:[true,"Please enter a password"]
    },
    verifyCode:{
        type:String,
        required:true
    },
    verifyCodeExpiry:{
        type:Date,
        required:true
    },
    isAcceptingMessage:{
        type:Boolean,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    messages:[messageSchema]
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User",UserSchema)
export default UserModel


