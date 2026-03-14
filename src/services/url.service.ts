import {
  getCache,
  incrCache,
  prxpireCache,
  setCache,
} from "../configs/redis.config";
import { MongoError } from "../interface";
import { Url, UrlDocument } from "../models/Shortner";
import { generateId } from "../utils";

export async function createShortUrlService(
  longUrl: string,
  retries: number = 3
): Promise<UrlDocument> {
  const shortUrlId = generateId(7);

  try {
    const doc = await Url.create({ shortUrlId, longUrl });

    // Set Redis Cache for 90 days
    await setCache(shortUrlId, longUrl, 7776000);
    return doc;
  } catch (err) {
    const mongoErr = err as MongoError;
    if (
      mongoErr.code === 11000 &&
      mongoErr.keyValue &&
      mongoErr.keyValue.shortUrlId &&
      retries > 0
    ) {
      return createShortUrlService(longUrl, retries - 1);
    }
    throw err;
  }
}

export async function getLongUrlService(
  shortUrlId: string
): Promise<UrlDocument | null | { longUrl: string }> {
  // Get and return Cache if it exists
  const cache = await getCache(shortUrlId);
  if (cache) {
    // Increment Clicks
    const clicksKey = `clicks:${shortUrlId}`;
    await incrCache(clicksKey);

    const clicks = parseInt((await getCache(clicksKey)) || "0", 10);

    if (clicks > 1000) {
      await prxpireCache(shortUrlId, 30 * 24 * 60 * 60 * 1000);
    }

    return { longUrl: cache };
  }

  // Else read DB
  const doc = await Url.findOne({ shortUrlId });

  if (!doc) return null;

  await Url.updateOne({ _id: doc._id }, { $inc: { clicks: 1 } });

  return doc;
}
