import { Router } from "express";
import { botStatsService } from "../../../services/botStats";

const router: Router = Router();

router.post("/stats", (req, res) => {
  try {
    const { stats } = req.body;

    if (!stats) {
      return res.status(400).json({
        success: false,
        message: "Stats data is required",
      });
    }

    botStatsService.updateStats(stats);

    res.json({
      success: true,
      message: "Stats updated successfully",
    });
  } catch (error) {
    console.error("Error updating bot stats:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
