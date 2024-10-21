import { Button } from "@/components/ui/button";
import { useCurrent } from "@/features/auth/api/use-current";
import { useLogout } from "@/features/auth/api/use-logout";
import { UserButton } from "@/features/auth/components/UserButton";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {


  return (
    <div>
      <UserButton />
    </div>
  )
}
