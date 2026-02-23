import mongoose, { Schema } from "mongoose";

const urlShortnerSchema = new Schema({
  shortUrlId: {
    type: String,
    unique: true,
    index: true,
  },

  longUrl: {
    type: String,
    unique: true,
    required: true,
  },s

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Url = mongoose.model("Url", urlShortnerSchema);

export default Url;
