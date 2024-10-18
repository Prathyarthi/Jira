import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { signinSchema } from "../components/schemas";

const app = new Hono()
    .post("/signin", zValidator("json", signinSchema), (c) => {
        return c.json({
            success: "ok",
            message: "Signed in successfully",
        })
    })

export default app