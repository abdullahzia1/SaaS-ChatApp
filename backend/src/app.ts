import express from "express";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

//dev dep. only
app.use(morgan("dev"));

app.use("/api/v1", appRouter);

export default app;
