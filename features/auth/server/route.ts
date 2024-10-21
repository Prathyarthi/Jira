import { Hono } from "hono";
import { zValidator } from '@hono/zod-validator'
import { signinSchema, signupSchema } from "../components/schemas";
import { createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";
import { deleteCookie, setCookie } from "hono/cookie";
import { sessionMiddleware } from "@/lib/sessionMiddleware";

const app = new Hono()
    .post("/signup", zValidator("json", signupSchema), async (c) => {
        const { name, email, password } = c.req.valid("json")

        const { account } = await createAdminClient()

        const user = await account.create(
            ID.unique(),
            email,
            password,
            name
        )

        const session = await account.createEmailPasswordSession(
            email,
            password
        )

        setCookie(c, AUTH_COOKIE, session.secret, {
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30
        })

        return c.json({
            success: true,
            message: "Signed up successfully",
            data: user
        })
    })
    .post("/signin", zValidator("json", signinSchema), async (c) => {

        const { email, password } = c.req.valid("json")

        const { account } = await createAdminClient()

        const session = await account.createEmailPasswordSession(
            email,
            password
        )

        setCookie(c, AUTH_COOKIE, session.secret, {
            httpOnly: true,
            path: "/",
            secure: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 30
        })

        return c.json({
            success: "ok",
            message: "Signed in successfully",
        })
    })
    .get("/current", sessionMiddleware, (c) => {
        const user = c.get("user")

        return c.json({
            success: true,
            data: user
        })
    })
    .post("/logout", sessionMiddleware, async (c) => {

        const account = c.get("account")
        deleteCookie(c, AUTH_COOKIE)
        await account.deleteSession("current")

        return c.json({
            success: true
        })
    })

export default app