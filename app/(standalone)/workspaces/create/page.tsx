import { getCurrent } from "@/features/auth/actions"
import CreateWorkspace from "@/features/workspaces/components/CreateWorkspace"
import { redirect } from "next/navigation"

async function page() {

    const user = await getCurrent()

    if (!user) {
        redirect('/sign-in')
    }

    return (
        <div className="w-full lg:max-w-lg">
            <CreateWorkspace />
        </div>
    )
}

export default page