import { Message } from "@/model/User";

export interface ApiRespnse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>

}