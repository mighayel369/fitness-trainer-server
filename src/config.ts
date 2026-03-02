import dotenv from 'dotenv';

dotenv.config();

interface Env {
  NODE_ENV?: string;
  PORT?: number;
  MONGO_URL: string;
  MAIL_USER?: string;
  MAIL_PASSWORD?: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLIENT_URL:string;
  COOKIE_MAX_AGE: number;
  ADMIN_PERCENT:number;
  RAZORPAY_ID:string;
  RAZORPAY_SECRET:string;
  ADMIN_WALLET:string
}

const ensureEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const getConfig = (): Env => {
  return {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    MONGO_URL: ensureEnv('MONGO_URL'),
    MAIL_USER: process.env.MAIL_USER,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    JWT_SECRET: ensureEnv('JWT_SECRET'),
    JWT_REFRESH_SECRET: ensureEnv('JWT_REFRESH_SECRET'),
    GOOGLE_CLIENT_ID: ensureEnv('GOOGLE_CLIENT_ID'),
    GOOGLE_CLIENT_SECRET: ensureEnv('GOOGLE_CLIENT_SECRET'),
    CLOUDINARY_CLOUD_NAME: ensureEnv('CLOUDINARY_CLOUD_NAME'),
    CLOUDINARY_API_KEY: ensureEnv('CLOUDINARY_API_KEY'),
    CLOUDINARY_API_SECRET: ensureEnv('CLOUDINARY_API_SECRET'),
    CLIENT_URL:ensureEnv('CLIENT_URL'),
    COOKIE_MAX_AGE: Number(ensureEnv("COOKIE_MAX_AGE")),
    ADMIN_PERCENT:Number(ensureEnv("ADMIN_PERCENT")),
    RAZORPAY_ID:ensureEnv("RAZORPAY_KEYID"),
    RAZORPAY_SECRET:ensureEnv("RAZORPAY_KEYSECRET"),
    ADMIN_WALLET:ensureEnv("ADMIN_WALLET")
  };
};

const config = getConfig();

export default config;
