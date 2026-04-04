import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = process.env.DATABASE_URL_PROD;
} else {
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
}
