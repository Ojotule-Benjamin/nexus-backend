import cloudinary from "cloudinary";
import type { Request, Response } from "express";
import multer from "multer";
import { STATUS } from "@/constants/statusCodes";
import { ApiResponse } from "@/utils/ApiResponse";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) {
    return ApiResponse.error({
      message: "No file uploaded",
      res,
      status: STATUS.BAD_REQUEST,
    });
  }
  try {
    const stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          return ApiResponse.error({
            error: error.message || "'Error uploading to Cloudinary'",
            message: "File upload failed",
            res,
            status: STATUS.INTERNAL_ERROR,
          });
        }
        return ApiResponse.success({
          data: { url: result?.secure_url },
          message: "File uploaded successfully",
          res,
        });
      },
    );

    stream.end(req.file.buffer);
  } catch (error) {
    return ApiResponse.error({
      error: error instanceof Error ? error.message : "Unknown error",
      message: "File upload failed",
      res,
      status: STATUS.INTERNAL_ERROR,
    });
  }
};
