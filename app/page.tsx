"use client"

import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter()

  const { data, isLoading } = useCurrent()
  const { mutate } = useLogout()

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/signin')
    }
  }, [data])

  return (
    <div>
      Hey There!

      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  )
}
