import { createServer } from "node:http";
import { Application } from "./app/app"


const app = new Application()

createServer(app.start()).listen(process.env.PORT, async () => {
    console.log("backend connected")
})