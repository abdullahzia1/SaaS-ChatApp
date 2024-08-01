import { Router } from "express";
import { verifyToken } from "../utils/token_Manager.js";
import { chatValidator, validate } from "../utils/validators.js";
import { generateChatCompletion } from "../controllers/chat_Controller.js";

const chatRoutes = Router();

chatRoutes.post(
  "/new",
  validate(chatValidator),
  verifyToken,
  generateChatCompletion
);

export default chatRoutes;
