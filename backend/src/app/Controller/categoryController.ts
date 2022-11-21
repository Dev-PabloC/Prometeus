import { prisma } from "../../database/dataSource";
import { Request, Response } from "express"
import { createCategory, updateCategory } from "../utils/interface"

export class CategoryController {
    async createCategory(req: Request, res: Response) {
        try {
            const { name } = req.body as createCategory
            if (!name) {
                return res.status(400).send({ message: "Bad request" })
            }



            await prisma.category.create({
                data: {
                    name: name
                }
            }).then(() => {
                return res.status(201).send({ message: "Category created" })
            }).catch((err) => {
                return res.status(500).send({ message: "category name already exist" })
            })


        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async getAllCategory(req: Request, res: Response) {
        try {
            const resultGetCategory = await prisma.category.findMany()

            return res.status(200).json(resultGetCategory)
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async getUniqueCategory(req: Request, res: Response) {
        try {
            const { _id } = req.params
            const resultGetUniqueCategory = await prisma.category.findFirst({
                where: {
                    id: _id
                }
            })

            return res.status(200).json(resultGetUniqueCategory)
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async updateCategory(req: Request, res: Response) {
        try {
            const { _id } = req.params
            const updateCategoryData = req.body as updateCategory
            await prisma.category.update({
                where: {
                    id: _id
                }, data: {
                    ...updateCategoryData
                }
            })

            return res.status(200).send({ message: "Category updated" })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async deleteCategory(req: Request, res: Response) {
        try {
            const { _id } = req.params
            await prisma.category.delete({
                where: {
                    id: _id
                }
            })

            return res.status(200).send({ message: "Category deleted" })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async insertProductInCategory(req: Request, res: Response) {
        try {
            const { _id, productId } = req.params
            await prisma.category.update({
                where: { id: _id },
                data: {
                    products: {
                        connect: { id: productId }
                    }
                }
            })

            return res.status(200).send({ message: `${productId} insert into ${_id}` })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
    async removingProductInCategory(req: Request, res: Response) {
        try {
            const { _id, productId } = req.params
            await prisma.category.update({
                where: { id: _id },
                data: {
                    products: {
                        disconnect: { id: productId }
                    }
                }
            })
        } catch (error) {
            return res.status(500).send(error)
        }
    }
}