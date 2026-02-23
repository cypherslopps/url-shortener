import mongoose, { HydratedDocument, InferSchemaType, Schema } from "mongoose";

export type UrlPlain = InferSchemaType<typeof urlShortnerSchema>;
export type UrlDocument = HydratedDocument<UrlPlain>;
export type UrlModel = mongoose.Model<UrlDocument>;

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
  },

  clicks: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const Url = mongoose.model<UrlDocument>("Url", urlShortnerSchema);

export default Url;
