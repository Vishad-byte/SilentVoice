'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema";
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"

const page = () => {

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300);

    const router = useRouter();

    //zod implementation

    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: ''
        }
    })

    useEffect(() =>{
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const reponse = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`);
                    setUsernameMessage(reponse.data.messages) //TODO: console axios response
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username")
                } finally {
                    setIsCheckingUsername(false)
                }
            }
        }
        checkUsernameUnique();
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);

        try {
            const response = await axios.post<ApiResponse>('/api/sign-up', data);
            toast.success("Success", {
                description: response.data.message 
            })
            router.replace(`/verify/${username}`); //check
            setIsSubmitting(false)
        } catch (error) {
            console.error("Error in signing-up of user", error);
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast.error("Sign-up error", {
                description: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Silent Voice
                    </h1>
                    <p className="mb-4">Speak freely. Stay unheard</p>
                </div>
                
            </div>
        </div>
    )
}

export default page

