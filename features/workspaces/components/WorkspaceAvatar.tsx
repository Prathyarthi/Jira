import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface WorkspaceAvatarProps {
    image?: string
    name: string
    className?: string
}

function WorkspaceAvatar({ image, name, className }: WorkspaceAvatarProps) {

    if (image) {
        return (
            <div className={cn(className, "size-10 relative rounded-md overflow-hidden")}>
                < Image src={image} alt={name} fill className="object-cover" />
            </div >
        )
    }

    return (
        <Avatar className={cn(className, "size-10 rounded-md")}>
            <AvatarFallback className="text-white bg-blue-600 font-semibold text-lg rounded-md">
                {name.charAt(0).toUpperCase()}
            </AvatarFallback>
        </Avatar>
    )
}

export default WorkspaceAvatar