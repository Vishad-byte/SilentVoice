import { getServerSession } from "next-auth";    
import { authOptions  } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";                
import { success } from "zod";
import mongoose, { mongo } from "mongoose";

export async function GET (request:Request) {
    const session = await getServerSession(authOptions);
    const user: User = session?.user ;            

    if(!session || !session.user){
        return Response.json({
            success: false,
            message: "Not Authenticated"
        }, { status: 401 })
    }

    const userId = new mongoose.Types.ObjectId(user._id);    //convert user._id from string to object such that it cold not create any problem when doing the pipelines

    try {
        const user = await UserModel.aggregate([
            { $match: { id: userId } },
            { $unwind: '$messages' },        //to unwind messages from array to objects
            { $sort: { 'messages.createdAt': -1} },
            { $group: {_id: '$_id', messages: {$push: '$messages'}} }
        ])

        if(!user || user.length === 0){
            return Response.json({
                success: false,
                messages: "User not found"
            }, { status: 401 })
        }

        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
        
    } catch (error) {
        
    }

}