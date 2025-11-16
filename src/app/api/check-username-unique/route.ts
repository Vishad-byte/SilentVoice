import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request){
    
    await dbConnect();
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')   //localhost:3000/api/cuu?username=hitesh?phone=android?    specifically choose the username params from the requested url
        };
        //validation with zod
        const result = UsernameQuerySchema.safeParse(queryParam);
        console.log(result);  //TODO: remove
        if(!result.success) {
            // Use issues array (Zod v4 recommended approach)
            const usernameErrors = result.error.issues
                .filter(issue => issue.path[0] === 'username')
                .map(issue => issue.message);
            return Response.json({
                success: false,
                message: usernameErrors?.length>0? usernameErrors.join(','): 'Invalid query parameters',
            }, { status: 400 })
        }

        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if(existingVerifiedUser){
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, {status: 400})
        }

        return Response.json({
            success: true,
            message: "Username is available"
        }, {status: 200})

        
    } catch (error) {
        console.error("Error checking username", error);
        return Response.json(
            {
                success: false,
                message: "Error checking username"
            },
            { status: 500 }
        )
    }
}