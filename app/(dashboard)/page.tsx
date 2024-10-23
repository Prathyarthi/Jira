import { getCurrent } from "@/features/auth/actions";
import CreateWorkspace from "@/features/workspaces/components/CreateWorkspace";
import { redirect } from "next/navigation";

export default async function Home() {

  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspace />
    </div>
  )
}
