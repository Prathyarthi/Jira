import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "@/config";
import { ID } from "node-appwrite";

const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const databases = c.get("databases")

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID
        )

        return c.json({
            success: true,
            data: workspaces
        })
    })
    .post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async (c) => {
        const databases = c.get("databases")
        const user = c.get("user")
        const storage = c.get("storage")

        const { name, image } = c.req.valid("form")

        let uploadImageUrl: string | undefined;

        if (image instanceof File) {
            const file = await storage.createFile(
                IMAGES_BUCKET_ID,
                ID.unique(),
                image
            )

            const arrayBuffer = await storage.getFilePreview(
                IMAGES_BUCKET_ID,
                file.$id
            )

            uploadImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`
        }

        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userId: user.$id,
                image: uploadImageUrl
            }
        )

        return c.json({
            success: true,
            message: "Workspace created successfully",
            data: workspace
        })
    })

export default app