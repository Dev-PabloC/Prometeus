import {Request, Response} from "express";
import cookie from "js-cookie";
import {getDataTokenPromise} from "../utils/promises";
import {prisma} from "../../database/dataSource";

export class CartController {
	async IncrementProductInCart(req: Request, res: Response) {
		try {
			const {productId} = req.params;
			const token = req.body as {token: string};
			const {userId} = (await getDataTokenPromise(String(token))) as {
				userId: string;
			};

			await prisma.user.update({
				where: {id: userId},
				data: {
					Cart: {
						create: {
							products: {
								connect: {
									id: productId,
								},
							},
						},
					},
				},
			});
			const result = await prisma.user.findFirst({
				where: {id: userId},
				select: {Cart: true},
			});
			return res.status(204).json(result);
		} catch (error) {
			return res.status(500).send(error);
		}
	}
	async decrementProductInCart(req: Request, res: Response) {
		try {
			const {productId} = req.params;
			const token = req.body as {token: string};
			const {userId} = (await getDataTokenPromise(String(token))) as {
				userId: string;
			};

			await prisma.user.update({
				where: {id: userId},
				data: {
					Cart: {
						disconnect: {
							id: productId,
						},
					},
				},
			});
		} catch (error) {
			return res.status(500).send(error);
		}
	}
}
