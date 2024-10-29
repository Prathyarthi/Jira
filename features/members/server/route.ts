import { sessionMiddleware } from "@/lib/sessionMiddleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { getMembersSchema, updateRoleSchema } from "../schemas";
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

                const user = await users.get(member.userId)

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
    .delete("/:memberId", sessionMiddleware, async (c) => {
        const { memberId } = c.req.param()
        const user = c.get("user")
        const databases = c.get("databases")

        const memberToDelete = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId
        )

        const allMembersInWorkspace = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("workspaceId", memberToDelete.workspaceId)]
        )

        const member = await getMember({
            databases,
            workspaceId: memberToDelete.workspaceId,
            userId: user.$id
        })

        if (!member) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

        if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

        if (allMembersInWorkspace.total === 1) {
            return c.json({
                error: "Cannot delete last member"
            }, 400)
        }

        await databases.deleteDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId
        )

        return c.json({
            success: true,
            message: "Member deleted successfully",
            data: { $id: memberToDelete.$id }
        })
    })
    .patch("/:memberId", sessionMiddleware, zValidator("json", updateRoleSchema), async (c) => {
        const { memberId } = c.req.param()
        const { role } = c.req.valid("json")
        const user = c.get("user")
        const databases = c.get("databases")

        const memberToUpdate = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId
        )

        const allMembersInWorkspace = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal("workspaceId", memberToUpdate.workspaceId)]
        )

        const member = await getMember({
            databases,
            workspaceId: memberToUpdate.workspaceId,
            userId: user.$id
        })

        if (!member) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

        if (member.role !== MemberRole.ADMIN) {
            return c.json({
                error: "Unauthorized"
            }, 401)
        }

        if (allMembersInWorkspace.total === 1) {
            return c.json({
                error: "Cannot downgrade the only member"
            }, 400)
        }

        await databases.updateDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberId,
            {
                role
            }
        )

        return c.json({
            success: true,
            message: "Member updated successfully",
            data: { $id: memberToUpdate.$id }
        })
    })

export default app