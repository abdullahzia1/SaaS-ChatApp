import { Router } from "express";
import { getAllUsers } from "../controllers/user_Controller.js";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);

export default userRoutes;
