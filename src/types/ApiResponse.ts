import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcceptingMessage?: boolean;
    messages?: Array<Message>
    // Optional debug/meta information (used during dev to surface external service responses)
    meta?: Record<string, unknown>   //TODO: remove this meta before deployment

}