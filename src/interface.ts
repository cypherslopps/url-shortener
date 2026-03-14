export interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

export interface ClickJobData {
  shortCode: string;
  originalUrl: string;
  timestamp: number;
  ip?: string;
  userAgent?: string;
}
