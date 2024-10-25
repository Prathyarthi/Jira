import { Loader } from "lucide-react"

function loading() {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <Loader className="size-6 animate-spin text-muted-foreground" />
        </div>
    )
}

export default loading