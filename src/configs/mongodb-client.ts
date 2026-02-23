import mongoose from "mongoose";
import config from ".";

export async function connectToDB() {
  try {
    await mongoose.connect(config.MONGODB_CONNECTION_STRING);
    console.log("Connected Sucessfully to MongoDB server");
  } catch (error) {
    console.error("Could not connect to MongoDB", error);
    process.exit(1);
  }
}
