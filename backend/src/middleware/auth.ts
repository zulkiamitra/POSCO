import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.header("Authorization");
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing auth token." });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.user = { id: payload.id, email: payload.email, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
