"use client"

import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import { DottedSeparator } from '@/components/dotted-separator'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'

import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage
} from '@/components/ui/form'
import { signupSchema } from './schemas'
import { useSignup } from '../api/use-signup'

function SignupComponent() {

    const { mutate, isPending } = useSignup()

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
        }
    })

    const onSubmit = (data: z.infer<typeof signupSchema>) => {
        mutate({ json: data })
    }

    return (
        <Card className='w-full h-full md:w-[487px] border-none shadow-none'>
            <CardHeader className='flex justify-center items-center text-center p-7'>
                <CardTitle className='text-2xl'>Sign Up</CardTitle>
                <CardDescription>By signing up you agree to the
                    <Link href="/privacy">
                        <span className='text-blue-700'>{" "}terms and conditions</span>
                    </Link>
                </CardDescription>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField name="name" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} type='name' placeholder='Name' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="email" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} type='email' placeholder='Email' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField name="password" control={form.control} render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input {...field} type='password' placeholder='Password' />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <Button disabled={isPending} size='lg' className='w-full'>Sign up</Button>
                    </form>
                </Form>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7 flex flex-col gap-y-4'>
                <Button disabled={isPending} variant="secondary" size="lg" className='w-full'>
                    <FcGoogle className='mr-2 size-5' />
                    Login with Google
                </Button>
                <Button disabled={isPending} variant="secondary" size="lg" className='w-full'>
                    <FaGithub className='mr-2 size-5' />
                    Login with Github
                </Button>
            </CardContent>
            <div className='px-7'>
                <DottedSeparator />
            </div>
            <CardContent className='p-7 flex justify-center items-center'>
                <p>
                    Already have an account?
                    <Link href="/sign-in" className='text-blue-700 ml-2'>Sign In</Link>
                </p>
            </CardContent>
        </Card>
    )
}

export default SignupComponent