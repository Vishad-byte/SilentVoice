import mongoose from "mongoose";
import { log } from "node:console";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {  //we dont care about the type of data coming in return from the promise
    if(connection.isConnected){
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        connection.isConnected = db.connections[0].readyState;  //TODO: console log db and connections 
        console.log("DB connected successfully");
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}   

export default dbConnect;