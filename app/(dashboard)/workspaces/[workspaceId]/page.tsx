import { getCurrent } from "@/features/auth/actions"
import { redirect } from "next/navigation"

async function page() {

  const user = await getCurrent()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div>page</div>
  )
}

export default page