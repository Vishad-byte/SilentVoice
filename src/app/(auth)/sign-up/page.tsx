'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signupSchema";
import axios, {AxiosError} from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

const page = () => {

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [debouncedUsername] = useDebounceValue(username, 300);

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
                    setUsernameMessage(reponse.data.messages)
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
            router.replace(`/verify/${data.username}`);
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm p-10 space-y-8 border border-gray-200">
                    <div className="text-center space-y-2">
                        <h1 className="text-5xl font-bold tracking-tight text-black leading-tight">
                            Join The Silent Voice
                        </h1>
                        <p className="text-gray-600 text-base">Speak Freely. Stay Unheard</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-normal text-base">Username</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input 
                                                    placeholder="username" 
                                                    className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all rounded-md"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e)
                                                        setUsername(e.target.value)
                                                    }}
                                                />
                                                {isCheckingUsername && (
                                                    <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-gray-400" />
                                                )}
                                                {!isCheckingUsername && username && usernameMessage && (
                                                    usernameMessage.includes('available') || usernameMessage.includes('unique') ? (
                                                        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <XCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-red-600" />
                                                    )
                                                )}
                                            </div>
                                        </FormControl>
                                        {usernameMessage && (
                                            <p className={`text-sm mt-1 ${usernameMessage.includes('available') || usernameMessage.includes('unique') ? 'text-green-600' : 'text-red-600'}`}>
                                                {usernameMessage}
                                            </p>
                                        )}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-normal text-base">Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="email" 
                                                className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-normal text-base">Password</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="password" 
                                                placeholder="password" 
                                                className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all rounded-md"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                                        Please wait
                                    </>
                                ) : (
                                    'Signup'
                                )}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center pt-4">
                        <p className="text-gray-600">
                            Already a member?{' '}
                            <Link 
                                href="/sign-in" 
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page