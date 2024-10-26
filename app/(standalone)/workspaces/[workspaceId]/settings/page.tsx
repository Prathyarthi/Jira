import { getCurrent } from "@/features/auth/actions"
import { getWorkspace } from "@/features/workspaces/actions"
import EditWorkspace from "@/features/workspaces/components/EditWorkspace"
import { redirect } from "next/navigation"

async function WorkspaceSettings({ params }: { params: { workspaceId: string } }) {

    const user = await getCurrent()

    if (!user) {
        redirect('/sign-in')
    }

    const initialValues = await getWorkspace({ workspaceId: params.workspaceId })

    if (!initialValues) {
        redirect(`/workspaces/${params.workspaceId}`)
    }

    return (
        <div className="w-full max-w-xl">
            <EditWorkspace initialValues={initialValues} />
        </div>
    )
}

export default WorkspaceSettings