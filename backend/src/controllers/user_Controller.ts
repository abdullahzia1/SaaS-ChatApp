import { Request, NextFunction, Response } from "express"; // Only import Response
import User from "../models/User.js";
import { compare, hash } from "bcrypt";
import { createToken } from "../utils/token_Manager.js";
import { COOKIE_NAME } from "../utils/constants.js";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await User.find();
    return res.status(200).json({ message: "OK", users });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// USER SIGNUP
export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).send("User Already exists");
    }

    const hashedPass = await hash(password, 10);
    const user = new User({ name, email, password: hashedPass });
    await user.save();

    res.clearCookie(COOKIE_NAME, {
      domain: "localhost",
      httpOnly: true,
      signed: true,
      path: "/",
    });
    const token = createToken(user._id.toString(), email, "1d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });
    return res
      .status(200)
      .json({ message: "OK", name: user.name, email: user.email });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//User Login
export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send("User is not registered.");
    }
    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).send("Password did not match");
    }

    res.clearCookie(COOKIE_NAME, {
      domain: "localhost",
      httpOnly: true,
      signed: true,
      path: "/",
    });
    const token = createToken(user._id.toString(), email, "1d");

    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    res.cookie(COOKIE_NAME, token, {
      path: "/",
      domain: "localhost",
      expires,
      httpOnly: true,
      signed: true,
    });
    return res
      .status(200)
      .json({ message: "Ok", name: user.name, email: user.email });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await User.findById({ email: res.locals.jwtData.id });
    if (!user) {
      return res
        .status(401)
        .send("User is not registered or Token Malfunctioned.");
    }
    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permissions did not match");
    }

    return res
      .status(200)
      .json({ message: "Ok", name: user.name, email: user.email });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
