import { Request, NextFunction, Response } from "express"; // Only import Response
import User from "../models/User.js";
import { compare, hash } from "bcrypt";

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

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = User.findOne({ email });
    if (!existingUser) {
      const hashedPass = await hash(password, 10);
      const user = new User({ name, email, password: hashedPass });
      await user.save();
      return res.status(200).json({ message: "OK", id: user._id.toString() });
    }
    return res.status(401).send("User Already exists");
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
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
    return res.status(200).json({ message: "Ok", id: user._id.toString() });
  } catch (error) {
    // Handle errors appropriately
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
