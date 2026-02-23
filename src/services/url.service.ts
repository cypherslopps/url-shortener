import { MongoError } from "../interface";
import { Url } from "../models/Shortner";
import { generateId } from "../utils";

export async function createShortUrlService(
  longUrl: string,
  retries: number = 3
) {
  const shortUrlId = generateId(7);

  try {
    return await Url.create({ shortUrlId, longUrl });
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

export async function getLongUrlService(shortUrlId: string) {
  const doc = await Url.findOne({ shortUrlId });

  if (!doc) return null;

  // get from cache
  // const linkData = getCache(cachekey)

  // setCache(cacheKey, {
  //   ...linkData,
  //   click: linkData.click + 1
  // })

  await Url.updateOne({ _id: doc._id }, { $inc: { clicks: 1 } });

  return doc;
}
