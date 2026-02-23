import Redis, { Redis as RedisClient, RedisKey } from "ioredis";
import config from ".";

let client: RedisClient | null = null;
let isConnecting = false;

export const getClient = async (): Promise<RedisClient> => {
  if (client) return client;

  if (isConnecting) {
    await new Promise((r) => setTimeout(r, 50));
    return getClient();
  }

  isConnecting = true;

  try {
    client = new Redis(config.REDIS_URL, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    client.on("connect", () => {
      console.log("Redis → connected");
    });

    client.on("ready", async () => {
      try {
        await client?.config("SET", "maxmemory", "2gb");
        await client?.config("SET", "maxmemory-policy", "allkeys-lru");

        console.log(
          "Redis eviction configured: allkeys-lru with maxmemory 2gb"
        );

        const current = await client?.config("GET", "maxmemory-policy");
        console.log("Current maxmemory-policy:", current);
      } catch (err) {
        console.warn(
          "Failed to configure Redis eviction (may be read-only replica?):",
          err
        );
      }
    });

    client.on("error", (err) => {
      console.error("Redis error:", err);
    });

    client.on("close", () => {
      console.warn("Redis → connection closed");
    });

    client.on("reconnecting", () => {
      console.log("Redis → attempting to reconnect...");
    });

    await client.ping();

    return client;
  } catch (err) {
    client = null;
    throw err;
  } finally {
    isConnecting = false;
  }
};

export const setCache = async (
  key: string,
  value: string | number | object,
  ttlSeconds?: number
) => {
  const redis = await getClient();
  const strValue =
    typeof value === "object" ? JSON.stringify(value) : String(value);

  if (ttlSeconds) {
    return redis.set(key, strValue, "EX", ttlSeconds);
  }
  return redis.set(key, strValue);
};

export const getCache = async <T = string>(key: string): Promise<T | null> => {
  const redis = await getClient();
  const value = await redis.get(key);
  if (!value) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
};

export const delCache = async (key: RedisKey) => {
  const redis = await getClient();
  return redis.del(key);
};

export const prxpireCache = async (key: RedisKey, ttlSeconds: number) => {
  const redis = await getClient();
  redis.pexpire(key, ttlSeconds);
};

export const incrCache = async (key: string) => {
  const redis = await getClient();
  return redis.incr(key);
};

export const closeRedis = async () => {
  if (client) {
    await client.quit().catch(() => client?.disconnect());
    client = null;
    console.log("Redis → connection closed gracefully");
  }
};
