import { Message } from "@/model/User";

export interface ApiRespnse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>
    // Optional debug/meta information (used during dev to surface external service responses)
    meta?: any   //TODO: remove this meta before deployment

}