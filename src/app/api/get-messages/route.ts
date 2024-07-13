import connectDb from '@/lib/db';
import UserModel from '@/model/userModel';
import mongoose from 'mongoose';
import { User } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

export async function GET(request: Request) {
  await connectDb();
  console.log("");
  
  const session = await getServerSession(authOptions);
  const _user: User = session?.user as User;
  // console.log(_user);
  

  if (!session || !_user) {
    return Response.json(
      { success: false, message: 'Not authenticated' },
      { status: 401 }
    );
  }
  const userId = new mongoose.Types.ObjectId(_user._id);
  
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: '$messages' },
      { $sort: { 'messages.createdAt': -1 } },
      { $group: { _id: '$_id', messages: { $push: '$messages' } } },
    ]).exec();
    
    
    if (!user || user.length === 0) {
      console.log("Inside if");
      
      return Response.json(
        { message: 'Currently No messages', success: false },
        { status: 404 }
      );
    }
    
    return Response.json(
      { messages: user[0].messages },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('An unexpected error occurred:', error);
    return Response.json(
      { message: 'Internal server error', success: false },
      { status: 500 }
    );
  }
}