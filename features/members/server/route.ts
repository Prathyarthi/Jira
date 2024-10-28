import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getMembersSchema } from "../schemas";
import { createAdminClient } from "@/lib/appwrite";
import { getMember } from "../utils";
import { MemberRole } from "../types";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { Query } from "node-appwrite";

const app = new Hono()
    .get("/", sessionMiddleware, zValidator("query", getMembersSchema), async (c) => {
        const { users } = await createAdminClient()

        const databases = c.get("databases")
        const user = c.get("user")

        const { workspaceId } = c.req.valid("query")

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

        const members = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("workspaceId", workspaceId)]
        )

        const populatedMembers = await Promise.all(
            members.documents.map(async (member) => {
                return {
                    ...member,
                    name: user.name,
                    email: user.email
                }
            })
        )

        return c.json({
            success: true,
            data: {
                ...members,
                documents: populatedMembers
            }
        })
    })

export default app