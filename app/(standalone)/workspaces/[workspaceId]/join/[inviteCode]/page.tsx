import { getCurrent } from "@/features/auth/queries"
import JoinWorkspace from "@/features/workspaces/components/JoinWorkspace"
import { getWorkspaceInfo } from "@/features/workspaces/queries"
import { redirect } from "next/navigation"


async function page({ params }: { params: { workspaceId: string } }) {

  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  const initialValues = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  })

  if (!initialValues) {
    redirect("/")
  }

  return (
    <div className="w-full max-w-xl">
      <JoinWorkspace initialValues={initialValues} />
    </div>
  )
}

export default page