
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

async function connectDb(): Promise<void> {
    if(connection.isConnected){
        console.log("Database is connected");
        return
        
    }
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "",{})
        // console.log(db);
        // console.log("After printing db details");
        // console.log(db.connections);
        connection.isConnected = db.connections[0].readyState
        
        console.log("DB connected successfully");
        
         
    } catch (error) {
        console.log("Db connection failed");
        // process.exit()
        
    }
}

export default connectDb