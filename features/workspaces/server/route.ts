import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, joinWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { Workspace } from "../types";

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
    .patch("/:workspaceId", sessionMiddleware, zValidator("form", updateWorkspaceSchema), async (c) => {

        const databases = c.get("databases")
        const storage = c.get("storage")
        const user = c.get("user")

        const { workspaceId } = c.req.param()
        const { name, image } = c.req.valid("form")

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

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
        else {
            uploadImageUrl = image
        }

        const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                name,
                image: uploadImageUrl,
            }
        )

        return c.json({
            success: true,
            message: "Workspace updated successfully",
            data: workspace
        })
    })
    .delete("/:workspaceId", sessionMiddleware, async (c) => {
        const databases = c.get("databases")
        const user = c.get("user")

        const { workspaceId } = c.req.param()

        const member = await getMember({
            databases,
            workspaceId: c.req.param("workspaceId"),
            userId: user.$id
        })

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

        await databases.deleteDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        )

        return c.json({
            success: true,
            message: "Workspace deleted successfully",
            data: { $id: workspaceId }
        })
    })
    .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
        const databases = c.get("databases")
        const user = c.get("user")

        const { workspaceId } = c.req.param()

        const member = await getMember({
            databases,
            workspaceId: c.req.param("workspaceId"),
            userId: user.$id
        })

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

        const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId,
            {
                inviteCode: generateInviteCode(6)
            }
        )

        return c.json({
            success: true,
            message: "Workspace deleted successfully",
            data: workspace
        })
    })
    .post("/:workspaceId/join", sessionMiddleware, zValidator("json", joinWorkspaceSchema), async (c) => {
        const { workspaceId } = c.req.param()
        const { code } = c.req.valid("json")

        const databases = c.get("databases")
        const user = c.get("user")

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id
        })

        if (member) {
            return c.json({
                error: "Already a member"
            }, 400)
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceId
        )

        if (workspace.inviteCode !== code) {
            return c.json({
                error: "Invalid invite code"
            }, 400)
        }

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                workspaceId,
                userId: user.$id,
                role: MemberRole.MEMBER
            }
        )

        return c.json({
            success: true,
            message: "Joined workspace successfully",
            data: { data: workspace }
        })
    })

export default app