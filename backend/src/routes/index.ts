import { Router } from "express";
import userRoutes from "./user_Routes.js";
import chatRoutes from "./chat_Routes.js";

const appRouter = Router();

appRouter.use("/user", userRoutes); // domain/api/v1/user
appRouter.use("/chats", chatRoutes); // domain/api/v1/chats

export default appRouter;
