import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT ?? 4000),
  webOrigin: process.env.WEB_ORIGIN ?? "http://localhost:5173",
  jwtIssuer: process.env.JWT_ISSUER ?? "electrozone",
  adminApiKey: process.env.ADMIN_API_KEY ?? "dev-admin-key",
  geminiApiKey: process.env.GEMINI_API_KEY ?? "",
  geminiModel: process.env.GEMINI_MODEL ?? "gemini-1.5-flash",
  isProd: process.env.NODE_ENV === "production",
};