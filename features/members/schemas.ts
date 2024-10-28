import { z } from "zod";

export const getMembersSchema = z.object({
    workspaceId: z.string(),
})