import {prisma} from "../../database/dataSource";
import {Request, Response} from "express";
import {loginData} from "../utils/interface";
import cookie from "js-cookie";
import jwt from "jsonwebtoken";

const DayInMilliseconds = 1000 * 60 * 60 * 24;

export class AuthController {
	async loginUser(req: Request, res: Response) {
		try {
			const {email, password} = req.body as loginData;
			if (!email || !password) {
				return res.status(400).send({message: "Bad request"});
			}

			const result = await prisma.user.findFirst({where: {email: email}});

			if (!result) {
				return res.status(401).send({message: "Wrong email"});
			}

			if (result?.email === email && result?.password === password) {
				const token = await jwt.sign(
					{
						userId: result.id,
						username: result.username,
						admin: result?.admin,
					},
					String(process.env.JWT),
					{expiresIn: "1d"},
				);

				return res.status(200).send({message: "user login: true", token: token});
			}
			return res.status(401).send({message: "wrong password"});
		} catch (error) {
			return res.status(500).send(error);
		}
	}
}
