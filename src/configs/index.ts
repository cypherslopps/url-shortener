import dotenv from "dotenv";
dotenv.config();

interface Config {
  MONGODB_CONNECTION_STRING: string;
  PORT: string;
}

const config: Config = {
  MONGODB_CONNECTION_STRING: process.env.MONGODB_CONNECTION_DB_STRING!,
  PORT: process.env.PORT || "3000",
};

export default config;
