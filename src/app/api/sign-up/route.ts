import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { success } from "zod";

//If user exists and is verified -> success: false, do nothing
//If user does not exits -> hash the password, save the new registered User
//If user exists but is not verified -> hash the password, verify

export async function POST(request: Request) {
    await dbConnect();

    try {
        const {username, email, password} = await request.json();
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "User is already registered and verified"
            }, {status: 400})
        }

        const existingUserByEmail = await UserModel.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "User with this email already exists and is verified."
                }, {status: 400})
            }else {
                const hashedPassword = await bcrypt.hash(password, 10);   //If user wants to change is password (while Verification)
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);   //Expire in 1 hour from the current time we got using Date();

            const newUser = new UserModel({
                    username,
                    email, 
                    password: hashedPassword,
                    verifyCode,
                    verifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
            })

            await newUser.save();
        }

        //send verification email
        const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success) {                //Email response returns us .success 
            return Response.json({
                success: false,
                message: emailResponse.message
            },{status: 500})
        }
            return Response.json({
                success: true,
                message: "User registered successfully. Verify your Email"
            },{status: 200})


    } catch (error) {
        console.error('Error registering User', error);
        return Response.json(
            {
                success: false,
                message: "Error registering User"
            },
            {status: 500}
        )
    }
}
