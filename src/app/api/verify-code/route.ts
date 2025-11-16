import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log(' Database connected successfully');

    const body = await request.json();
    console.log(' Request body received:', body);

    const { username, code } = body;
    if (!username || !code) {
      console.error(' Missing username or code in request body');
      return NextResponse.json(
        { success: false, message: 'Username or code missing' },
        { status: 400 }
      );
    }

    const decodedUsername = decodeURIComponent(username);
    console.log(' Decoded username:', decodedUsername);

    const user = await UserModel.findOne({ username: decodedUsername });
    console.log(' User fetched from DB:', user ? user.username : 'User not found');

    if (!user) {
      console.warn(' No user found with this username');
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Check if the code is correct and not expired
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    console.log(' Code valid:', isCodeValid);
    console.log(' Code not expired:', isCodeNotExpired);
    console.log(' Code expiry:', user.verifyCodeExpiry);

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      console.log(' User verified successfully');

      return NextResponse.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );
    }

    if (!isCodeNotExpired) {
      console.warn(' Code expired for user:', decodedUsername);
      return NextResponse.json(
        {
          success: false,
          message:
            'Verification code has expired. Please sign up again to get a new code.',
        },
        { status: 400 }
      );
    }

    console.warn(' Incorrect verification code for user:', decodedUsername);
    return NextResponse.json(
      { success: false, message: 'Incorrect verification code' },
      { status: 400 }
    );
  } catch (error: unknown) {
    console.error(' ERROR verifying user:', error);
    const err = error instanceof Error ? error : new Error(String(error));
    return NextResponse.json(
      {
        success: false,
        message: err.message || 'Error verifying user',
        stack: err.stack,
      },
      { status: 500 }
    );
  }
}


// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';
// import { NextResponse } from "next/server";

// export async function POST(request: Request) {
//   return NextResponse.json({ message: "Route loaded!" }, { status: 200 });
// }
