import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";

const app = new Hono()
    .get("/", sessionMiddleware, async (c) => {
        const databases = c.get("databases")
        const user = c.get("user")

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("userId", user.$id)]
        )

        if (members.total === 0) {
            return c.json({ data: { documents: [], total: 0 } })
        }

        const workspaceIds = members.documents.map((member) => member.workspaceId)

        const workspaces = await databases.listDocuments(
            DATABASE_ID,
            WORKSPACES_ID,
            [
                Query.orderDesc("$createdAt"),
                Query.contains("$id", workspaceIds)
            ]
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
                image: uploadImageUrl,
                inviteCode: generateInviteCode(6)
            }
        )

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                userId: user.$id,
                workspaceId: workspace.$id,
                role: MemberRole.ADMIN
            }
        )

        return c.json({
            success: true,
            message: "Workspace created successfully",
            data: workspace
        })
    })

export default app