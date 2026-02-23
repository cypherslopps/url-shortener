import mongoose, { Schema } from "mongoose";
import { generateId } from "../utils";

const urlShortnerSchema = new Schema({
  shortUrlId: {
    type: String,
    unique: true,
    index: true,
    default: () => generateId(7),
  },

  longUrl: {
    type: String,
    unique: true,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Url = mongoose.model("Url", urlShortnerSchema);

export default Url;
