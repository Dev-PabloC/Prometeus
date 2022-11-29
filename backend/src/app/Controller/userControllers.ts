import {Request, Response} from "express";
import {prisma} from "../../database/dataSource";
import * as bcrypt from "bcrypt";
import {createUserDto, updateUserDto} from "../utils/interface";
import {getDataTokenPromise} from "../utils/promises";

export class UserController {
	async createUser(req: Request, res: Response) {
		try {
			const {username, email, password} = req.body as createUserDto;

			if (!username || !email || !password) {
				return res.status(400).send({message: "Bad Request"});
			}
			await prisma.user
				.create({
					data: {
						username: username,
						email: email,
						password: password,
					},
				})
				.then(() => {
					return res.status(201).send({message: "User created"});
				})
				.catch((err) => {
					if (err.message.includes("Unique constraint failed on the fields: (`username`)")) {
						return res.status(400).send({message: "username already exist"});
					} else if (err.message.includes("Unique constraint failed on the fields: (`email`)")) {
						return res.status(400).send({message: "email already exist"});
					} else {
						return res.status(500).send(err.message);
					}
				});
		} catch (error) {
			return res.status(500).send(error);
		}
	}

	async getAllUser(req: Request, res: Response) {
		try {
			const resultGetUser = await prisma.user.findMany({
				select: {
					id: true,
					username: true,
					email: true,
					password: false,
					products: true,
					Cart: true,
				},
			});

			return res.status(200).json(resultGetUser);
		} catch (error) {
			return res.status(500).send(error);
		}
	}
	async getUniqueUser(req: Request, res: Response) {
		try {
			const {_id} = req.params;
			const resultGetUniqueUser = await prisma.user.findFirst({
				where: {
					id: _id,
				},
				select: {
					id: true,
					username: true,
					email: true,
					password: false,
					products: true,
					Cart: true,
				},
			});

			return res.status(200).json(resultGetUniqueUser);
		} catch (error) {
			return res.status(500).send(error);
		}
	}
	async updateUser(req: Request, res: Response) {
		try {
			const updateUserData = req.body as updateUserDto;

			const {_id} = req.params;
			const token = req.body as {token: string};
			const {userId} = (await getDataTokenPromise(String(token))) as {
				userId: string;
			};
			if (_id === userId) {
				await prisma.user.update({
					where: {id: _id},
					data: {
						...updateUserData,
					},
				});

				return res.status(200).send({message: "User updated"});
			}
			return res.status(401).send({message: "Acess denied"});
		} catch (error) {
			return res.status(500).send(error);
		}
	}
	async deleteUser(req: Request, res: Response) {
		try {
			const {_id} = req.params;
			const token = req.body as {token: string};
			const {userId} = (await getDataTokenPromise(String(token))) as {
				userId: string;
			};
			if (_id === userId) {
				await prisma.user.delete({
					where: {
						id: _id,
					},
				});

				return res.status(200).send({message: "User deleted"});
			}
			return res.status(401).send({message: "Acess denied"});
		} catch (error) {
			return res.status(500).send(error);
		}
	}
}
