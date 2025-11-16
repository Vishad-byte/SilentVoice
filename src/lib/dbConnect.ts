import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {  //we dont care about the type of data coming in return from the promise
    console.log("🗄️ Attempting to connect to MongoDB...");
    console.log("📍 MongoDB URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ Missing!");
    
    if(connection.isConnected){
        console.log("✓ Already connected to the database");
        return;
    }

    if (!process.env.MONGODB_URI) {
        console.error("❌ MONGODB_URI is not set in environment variables!");
        throw new Error("MONGODB_URI is required");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, {});
        connection.isConnected = db.connections[0].readyState;  
        console.log("✅ Database connected successfully!");
    } catch (error) {
        console.log("❌ Database connection failed:", error);
        process.exit(1);
    }
}   

export default dbConnect;