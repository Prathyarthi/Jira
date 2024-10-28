"use client"

import { RiAddCircleFill } from "react-icons/ri"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import WorkspaceAvatar from "@/features/workspaces/components/WorkspaceAvatar"
import { useRouter } from "next/navigation"
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal"

export const WorkspaceSwitcher = () => {

    const workspaceId = useWorkspaceId()

    const router = useRouter()

    const { data: workspaces } = useGetWorkspaces()

    const handleOnSelect = (workspaceId: string) => {
        router.push(`/workspaces/${workspaceId}`)
    }

    const { open } = useCreateWorkspaceModal()

    return (
        <div className="flex flex-col gap-y-2">
            <div className="flex justify-between items-center">
                <p className="text-xs uppercase text-neutral-500">Workspaces</p>
                <RiAddCircleFill onClick={open} className="text-neutral-500 cursor-pointer hover:opacity-75 transition" />
            </div>

            <Select onValueChange={handleOnSelect} value={workspaceId}>
                <SelectTrigger className="w-full bg-neutral-200 font-medium p-1 h-12 text-[14px]">
                    <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                    {workspaces?.documents.map((workspace) => (
                        <SelectItem key={workspace.$id} value={workspace.$id}>
                            <div className="flex justify-start items-center gap-3 font-medium">
                                <WorkspaceAvatar name={workspace.name} image={workspace.image} />
                                <span className="truncate">{workspace.name}</span>
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}