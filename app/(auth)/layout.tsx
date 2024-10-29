"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

function AuthLayout({ children }: { children: React.ReactNode }) {

    const pathname = usePathname()


    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center">
                    <Image src="/logo.svg" height={30} width={30} alt="logo" />
                    <Button asChild variant="secondary">
                        <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
                            {pathname === "/sign-in" ? "Sign Up" : "Sign In"}
                        </Link>
                    </Button>
                </nav>
                <div className="flex flex-col justify-center items-center pt-4 md:pt-14">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default AuthLayout