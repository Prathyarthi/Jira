"use client"

import { ResponsiveModal } from "@/components/ResponsiveModal";
import CreateWorkspace from "./CreateWorkspace";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

function WorkspaceModal() {

    const { isOpen, setIsOpen } = useCreateWorkspaceModal()

    return (
        <ResponsiveModal open={true} onOpenChange={() => { }}>
            <CreateWorkspace />
        </ResponsiveModal>
    )
}

export default WorkspaceModal