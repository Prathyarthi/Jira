import { redirect } from "next/navigation"
import { getCurrent } from "@/features/auth/queries"
import { CreateWorkspace } from "@/features/workspaces/components/CreateWorkspace"

const WorkspaceCreationPage = async () => {

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

export default WorkspaceCreationPage