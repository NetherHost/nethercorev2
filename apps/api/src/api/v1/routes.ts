import { Router } from "express";
import healthRoutes from "./health/routes";
import authRoutes from "./auth/routes";
import botRoutes from "./bot/routes";

const router: Router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/bot", botRoutes);

export default router;
