import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        const sendResult = await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Silent Voice Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        // Log the response from Resend for debugging (do not log secrets)
        console.log('Resend send result:', sendResult);

        return {success: true, message: 'Verification email sent successfully', meta: { sendResult }};
        
    } catch (emailError) {
        // Log full error for debugging; include message in API response meta so callers can see the cause
        console.error('Error sending verification email', emailError);
        const errorMessage = emailError instanceof Error ? emailError.message : String(emailError);
        return {success: false, message: 'Failed to send verification email', meta: { error: errorMessage }};
    }
}