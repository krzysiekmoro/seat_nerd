import express, { Request, Response } from "express";
import { requireAuth } from "@seat-nerd/common";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {}
);

export { router as showOrderRouter };
