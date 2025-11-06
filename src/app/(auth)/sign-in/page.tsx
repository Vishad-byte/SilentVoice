'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Link from "next/link"
import { useState } from "react"
import { useDebounceValue } from 'usehooks-ts'
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const page = () => {

    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const debouncedUsername = useDebounceValue(username, 300);

    const router = useRouter();

    return (
        <div>page</div>
    )
}

export default page

