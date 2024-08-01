import { Configuration } from "openai";
import dotenv from "dotenv";
dotenv.config();

export const configureOpenAI = () => {
  const config = new Configuration({
    apiKey: process.env.OPENAI_SECRET,
    organization: process.env.OPENAI_ORGANIZATION_ID,
  });
};
