import express from "express";
import dotenv from "dotenv";
import validUrl from "valid-url";

import config from "./configs";
import {
  createShortUrlService,
  getLongUrlService,
} from "./services/url.service";
import { connectToDB } from "./configs/mongodb-client";
import { MongoError } from "./interface";

dotenv.config();

const app = express();
const port = config.PORT;
app.use(express.json());

// Shorten URL endpointshortener
app.post("/shorten", async (req, res) => {
  try {
    const { url } = req.body;

    // Check if url exists
    if (!url) res.status(400).json({ error: "LongUrl is required" });

    // Validate url
    if (!validUrl.isHttpsUri(url))
      res.status(406).json({ error: "Invalid URL" });

    const doc = await createShortUrlService(url);

    res.status(201).json({
      shortUrl: `http://localhost:${port}/${doc.shortUrlId}`,
      longUrl: doc.longUrl,
      createdAt: doc.createdAt.toISOString(),
    });
  } catch (err) {
    const mongoErr = err as MongoError;
    const message = mongoErr?.message;

    if (message.includes("dup")) {
      res
        .status(500)
        .json({ error: "DUPLICATE_LONG_URL: Long URL already exists" });
    }

    res.status(500).json({ error: "An error occured" });
  }
});

// Expand URL endpoint
app.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    if (!shortId) res.status(400).json({ error: "ShortId is required" });

    const doc = await getLongUrlService(shortId);

    if (!doc) res.status(404).send("Not found");

    res.redirect(doc?.longUrl as string);
  } catch (err) {
    const mongoErr = err as MongoError;
    const message = mongoErr?.message;
    console.error(err);

    res.status(500).json({ error: message });
  }
});

app.listen(port, async () => {
  await connectToDB();
  console.log(`Connected successfully on port ${port}`);
});
