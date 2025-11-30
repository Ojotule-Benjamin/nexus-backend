import type { NextFunction, Response } from "express";
import { STATUS } from "@/constants/statusCodes";
import type { AuthRequest } from "@/types/index.ds";
import { ApiResponse } from "@/utils/ApiResponse";

export const permit = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return ApiResponse.error({
        message: "Forbidden: You don't have enough permissions to access this resource.",
        res,
        status: STATUS.FORBIDDEN,
      });
    }
    next();
  };
};
