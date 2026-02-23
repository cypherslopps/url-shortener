import express from "express";
import dotenv from "dotenv";
import validUrl from "valid-url";

import config from "./configs";
import { connectToDB } from "./configs/mongodb-client";
import { generateId } from "./utils";
import Url from "./models/Shortner";

dotenv.config();

const app = express();
const port = config.PORT;
app.use(express.json());

// Shorten URL endpointshortener
app.post("/shorten", async (req, res) => {
  const { url } = req.body;

  // Check if url exists
  if (!url) res.status(400).json({ message: "URL does not exist" });

  // Validate url
  if (!validUrl.isHttpsUri(url))
    res.status(406).json({ message: "Invalid URL" });

  try {
    // Store URL + LongURL to DB
    await Url.create({ longUrl: url });

    res.json({
      shortUrl: "http://localhost:port}/shortId}",
      longUrl: "",
      createdAt: "",
    });
  } catch (err) {}
});

// Expand URL endpoint
app.get("/:shortId", () => {});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, async () => {
  await connectToDB();
  console.log(`Connected successfully on port ${port}`);
});
