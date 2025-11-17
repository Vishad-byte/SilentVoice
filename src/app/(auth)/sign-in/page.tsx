'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"
import { useState } from "react"

const Page = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        setIsSubmitting(true);
        try {
            const result = await signIn('credentials', {
                redirect: false,
                identifier: data.identifier,
                password: data.password,
            });

            if (result?.error) {
                toast.error("Login failed", { 
                    description: result.error 
                });
                setIsSubmitting(false);
                return;
            }

            if (result?.ok) {
                toast.success("Login successful!", {
                    description: "Redirecting to dashboard..."
                });
                
                // Use window.location for a full page reload to ensure session is picked up
                window.location.href = "/dashboard";
                return;
            }

            // Fallback
            toast.error("Something went wrong", {
                description: "Please try again"
            });
            setIsSubmitting(false);
        } catch (err) {
            console.error("Sign-in error:", err);
            toast.error("Unexpected error", {
                description: "Please try again"
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-lg shadow-sm p-10 space-y-8 border border-gray-200">
                    <div className="text-center space-y-2">
                        <h1 className="text-5xl font-bold tracking-tight text-black leading-tight">
                            Join The Silent Voice
                        </h1>
                        <p className="text-gray-600 text-base">Sign in. Speak Freely. Stay Unheard</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

                            <FormField
                                control={form.control}
                                name="identifier"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-black font-normal text-base">Email/Username</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="email/username" 
                                                className="h-12 bg-white border-gray-300 text-black placeholder:text-gray-400 focus:border-black focus:ring-1 focus:ring-black transition-all rounded-md"
                                                disabled={isSubmitting}
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
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button 
                                type="submit" 
                                className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Signing in..." : "Sign In"}
                            </Button>
                        </form>
                    </Form>

                    <div className="text-center pt-4">
                        <p className="text-gray-600">
                            New here? Create your account{' '}
                            <Link 
                                href="/sign-up" 
                                className="text-blue-600 hover:underline font-medium"
                            >
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page