import cloudinary from "cloudinary";
import cookieParser from "cookie-parser";
import express, { type NextFunction, type Request, type Response } from "express";
import { API_CONFIG, config, getApiPath } from "@/config/config";
import { connectDB } from "@/config/connectDB";
import { features } from "@/constants/index";
import { STATUS } from "@/constants/statusCodes";
import authRoutes from "@/routes/auth.route";
import uploadRoutes from "@/routes/upload.route";
import type { AppError } from "@/utils/AppError";

const app = express();

const port = process.env.PORT || 2000;

cloudinary.v2.config({
  api_key: process.env.CLOUNDINARY_API_KEY,
  api_secret: process.env.CLOUNDINARY_API_SECRET_KEY,
  cloud_name: process.env.CLOUNDINARY_CLOUD_NAME,
});

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.get(getApiPath("/features"), (_req: Request, res: Response) => {
  return res.status(STATUS.OK).json({
    features: features,
    message: "Features fetched successfully",
  });
});

app.use(getApiPath("/auth"), authRoutes);
app.use(getApiPath("/upload"), uploadRoutes);

app.use((error: AppError, _req: Request, res: Response, _next: NextFunction) => {
  res.status(error.status || 500).json({
    message: error.message || "An error occurred",
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    status: error.status,
  });
});

// Only start the server if this file is run directly (not imported)
if (require.main === module) {
  app.listen(port, () => {
    connectDB(config.DATABASE_URL || "");
    console.log(
      `Server is running at http://localhost:${port}${API_CONFIG.basePath}/${API_CONFIG.version}`,
    );
  });
}

export default app;
