import { UserButton } from "@/features/auth/components/UserButton"
import Image from "next/image"
import Link from "next/link"

const StandaloneLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="bg-neutral-100 min-h-screen">
            <div className="mx-auto max-w-screen-2xl p-4">
                <nav className="flex justify-between items-center h-[73px]">
                    <Link href="/">
                        <Image src="/logo.svg" alt="logo" height={50} width={50} />
                    </Link>

                    <UserButton />
                </nav>
                <div className="flex flex-col justify-center items-center py-4">
                    {children}
                </div>
            </div>
        </main>
    )
}

export default StandaloneLayout