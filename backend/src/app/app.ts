import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import {Routes} from "./routes/routes";

export class Application {
	start() {
		const app = express();
		const routes = new Routes();
		app.use(helmet());
		app.use(cors());
		app.use(morgan("dev"));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({extended: false}));
		app.use("/api", routes.path());

		return app;
	}
}
