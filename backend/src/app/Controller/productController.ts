import cookie from 'js-cookie';
import { prisma } from "../../database/dataSource";
import { Request, Response } from "express"
import { createProduct, updateProduct } from "../utils/interface"
import { getDataTokenPromise } from "../utils/promises"



export class ProductController {
    async createProduct(req: Request, res: Response) {
        try {
            const { name, desc, value } = req.body as createProduct

            if (!name || !desc || !value) {
                return res.status(400).send({ message: "Bad Request" })
            }
            const token = req.body as { token: string }
            const { userId } = await getDataTokenPromise(String(token)) as { userId: string }
            await prisma.user.update({
                where: { id: userId },
                data: {
                    products: {
                        create: {
                            name: name,
                            desc: desc,
                            value: value,
                        }
                    }
                }
            })

            return res.status(201).send({ message: "Product created" })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async getAllProducts(req: Request, res: Response) {
        try {
            const resultGetProducts = await prisma.product.findMany()

            return res.status(200).json(resultGetProducts)
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async getUniqueProduct(req: Request, res: Response) {
        try {
            const { _id } = req.params

            const resultGetUniqueProduct = await prisma.product.findFirst({
                where: {
                    id: _id
                }
            })

            return res.status(200).json(resultGetUniqueProduct)
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async updateProduct(req: Request, res: Response) {
        try {
            const updateProductData = req.body as updateProduct
            const { _id } = req.params
            const token = req.body as { token: string }
            const { userId } = await getDataTokenPromise(String(token)) as { userId: string }

            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    products: {
                        update: {
                            where: { id: _id },
                            data: { ...updateProductData }
                        }
                    }
                }
            })

            return res.status(200).send({ message: "Product updated" })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async deleteProduct(req: Request, res: Response) {
        try {
            const { _id } = req.params
            const token = req.body as { token: string }
            const { userId } = await getDataTokenPromise(String(token)) as { userId: string }
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    products: {
                        delete: {
                            id: _id
                        }
                    }
                }
            })
            return res.status(200).send({ message: "product deleted" })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
}