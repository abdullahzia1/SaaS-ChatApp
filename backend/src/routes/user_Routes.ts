import { Router, Request, Response, NextFunction } from "express";
import {
  getAllUsers,
  userLogin,
  userSignup,
  verifyUser,
} from "../controllers/user_Controller.js";
import {
  loginValidator,
  signUpValidator,
  validate,
} from "../utils/validators.js";
import { verifyToken } from "../utils/token_Manager.js";

const userRoutes = Router();

userRoutes.get("/", getAllUsers);
userRoutes.post("/signup", validate(signUpValidator), userSignup);
userRoutes.post("/login", validate(loginValidator), userLogin);
userRoutes.get("/auth-status", verifyToken, verifyUser);

export default userRoutes;
