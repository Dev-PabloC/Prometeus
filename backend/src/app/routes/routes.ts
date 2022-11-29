import {Router} from "express";
import {Middlewares} from "../middlewares/middleware";
import {UserController} from "../Controller/userControllers";
import {CategoryController} from "../Controller/categoryController";
import {AuthController} from "../Controller/authController";
import {ProductController} from "../Controller/productController";
import {CartController} from "../Controller/cartController";

export class Routes {
	private userController = new UserController();
	private categoryController = new CategoryController();
	private authController = new AuthController();
	private middleware = new Middlewares();
	private productController = new ProductController();
	private cartController = new CartController();

	path() {
		const route = Router();
		route.use("/users", this.users());
		route.use("/category", this.category());
		route.use("/auth", this.auth());
		route.use("/products", this.products());

		return route;
	}

	private users() {
		const route = Router();
		route.post("/", this.userController.createUser);
		route.get("/", this.userController.getAllUser);
		route.get("/:_id", this.userController.getUniqueUser);
		route.patch("/:_id", this.middleware.tokenMiddleware, this.userController.updateUser);
		route.delete("/:_id", this.middleware.tokenMiddleware, this.userController.deleteUser);

		return route;
	}

	private auth() {
		const route = Router();

		route.post("/login", this.authController.loginUser);
		return route;
	}

	private category() {
		const route = Router();

		route.post("/", this.middleware.adminMiddleware, this.categoryController.createCategory);
		route.get("/", this.categoryController.getAllCategory);
		route.get("/:_id", this.categoryController.getUniqueCategory);
		route.patch("/:_id", this.middleware.adminMiddleware, this.categoryController.updateCategory);
		route.delete("/:_id", this.middleware.adminMiddleware, this.categoryController.deleteCategory);
		route.patch("/:_id/:productId", this.categoryController.insertProductInCategory);
		route.patch("/:_id/:productId", this.categoryController.removingProductInCategory);
		return route;
	}

	private products() {
		const route = Router();

		route.post("/", this.middleware.tokenMiddleware, this.productController.createProduct);
		route.get("/", this.productController.getAllProducts);
		route.get("/:_id", this.productController.getUniqueProduct);
		route.patch("/:_id", this.middleware.tokenMiddleware, this.productController.updateProduct);
		route.delete("/:_id", this.middleware.tokenMiddleware, this.productController.deleteProduct);

		return route;
	}

	private cart() {
		const route = Router();

		route.post("/:productId", this.middleware.tokenMiddleware, this.cartController.IncrementProductInCart);
		route.patch("/:productId", this.middleware.tokenMiddleware, this.cartController.decrementProductInCart);

		return route;
	}
}
