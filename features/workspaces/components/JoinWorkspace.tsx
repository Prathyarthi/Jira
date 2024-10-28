"use client"

import { DottedSeparator } from "@/components/dotted-separator"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useJoinWorkspace } from "../api/use-join-workspace"
import { useInviteCode } from "../hooks/use-invite-code"
import { useWorkspaceId } from "../hooks/use-workspace-id"
import { useRouter } from "next/navigation"

interface JoinWorkspaceProps {
    initialValues: {
        name: string
    }
}

function JoinWorkspace({ initialValues }: JoinWorkspaceProps) {

    const router = useRouter()

    const workspaceId = useWorkspaceId()

    const { mutate, isPending } = useJoinWorkspace()

    const inviteCode = useInviteCode()

    const onSubmit = () => {
        mutate({
            param: { workspaceId },
            json: { code: inviteCode }
        }, {
            onSuccess: ({ data }) => {
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Join Workspace
                </CardTitle>
                <CardDescription>
                    You&apos;ve been invited to join <strong>{initialValues.name}</strong>
                </CardDescription>
            </CardHeader>

            <div className="px-7">
                <DottedSeparator />
            </div>

            <CardContent className="p-7">
                <div className="flex flex-col gap-2 lg:flex-row justify-between items-center">
                    <Button variant="secondary" type="button" asChild className="w-full lg:w-fit" disabled={isPending}>
                        <Link href="/">
                            Cancel
                        </Link>
                    </Button>

                    <Button size="lg" className="w-full lg:w-fit" type="button" onClick={onSubmit} disabled={isPending}>
                        Join Workspace
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default JoinWorkspace