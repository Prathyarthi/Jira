import Image from "next/image"
import Link from "next/link"
import { DottedSeparator } from "./dotted-separator"
import Navigation from "./Navigation"

function Sidebar() {
    return (
        <aside className="h-full bg-neutral-100 p-4 w-full">
            <Link href="/">
                <Image src="" alt="logo" width={164} height={48} />
            </Link>
            <DottedSeparator />
            <Navigation />
        </aside>
    )
}

export default Sidebar