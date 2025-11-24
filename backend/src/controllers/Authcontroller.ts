// src/controllers/AuthController.ts
import type { Request, Response } from "express";
import { AuthService } from "../services/AuthService.js";

export const AuthController = {
  async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login(username, password);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
};
