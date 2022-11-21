import { verify } from "jsonwebtoken";
import cookie from "js-cookie"
import { Request, Response, NextFunction } from "express";
import { getDataTokenPromise } from "../utils/promises";

export class Middlewares {

    async tokenMiddleware(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body as { token: string }

            if (token) {
                next()
            }

            return res.status(401).send({ message: "User not authenticate" })
        } catch (error) {
            return res.status(500).send(error)
        }
    }

    async adminMiddleware(req: Request, res: Response, next: NextFunction) {
        const { token } = req.body as { token: string }

        const { admin } = await getDataTokenPromise(token) as { admin: boolean }

        if (admin === true) {
            next()
        }

        return res.status(401).send({ message: "Acess denied" })
    }
}