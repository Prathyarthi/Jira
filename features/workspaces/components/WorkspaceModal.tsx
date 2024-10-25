"use client"

import { ResponsiveModal } from "@/components/ResponsiveModal";
import CreateWorkspace from "./CreateWorkspace";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

function WorkspaceModal() {

    const { isOpen, setIsOpen, close } = useCreateWorkspaceModal()

    return (
        <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
            <CreateWorkspace onCancel={close} />
        </ResponsiveModal>
    )
}

export default WorkspaceModal