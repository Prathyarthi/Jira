import { UserButton } from "@/features/auth/components/UserButton"
import MobileSidebar from "./MobileSidebar"

function Navbar() {
    return (
        <nav className="pt-4 px-6 flex justify-between items-center">
            <div className="lg:flex flex-col hidden">
                <h1 className="text-2xl font-semibold">Home</h1>
                <p className="text-muted-foreground">Monitor all your projects here!</p>
            </div>
            <MobileSidebar />
            <UserButton />
        </nav>
    )
}

export default Navbar