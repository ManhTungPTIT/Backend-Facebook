import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = process.env.DATABASE_URL_PROD;
  console.log("Running in production");
} else {
  process.env.DATABASE_URL = process.env.DATABASE_URL_DEV;
  console.log("Running in dev");
}
