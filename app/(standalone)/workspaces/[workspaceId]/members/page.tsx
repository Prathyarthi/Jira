import { getCurrent } from "@/features/auth/queries"
import MembersList from "@/features/workspaces/components/MembersList"
import { redirect } from "next/navigation"

async function page() {

    const user = await getCurrent()

    if (!user) {
        redirect('/sign-in')
    }

    return (
        <div className="w-full max-w-xl">
            <MembersList />
        </div>
    )
}

export default page