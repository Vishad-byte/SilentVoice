import mongoose from 'mongoose';
import { projectCompilationEventsSubscribe } from 'next/dist/build/swc/generated-native';

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {} 

async function dbConnect(): Promise<void> {                   // we dont care about the return type of out promise from dbConnect therefore using void
    if(connection.isConnected){                               // optimisation to check whether the db is already connected or not   
        console.log("Already connected to the database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})

        connection.isConnected = db.connections[0].readyState;

        console.log("DB is connected successfully");
    } catch (error) {
        console.log("DB connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;
