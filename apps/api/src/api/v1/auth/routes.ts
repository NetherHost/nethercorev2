import { Router } from "express";
import {
  discordAuthController,
  discordCallbackController,
  getCurrentUserController,
  logoutController,
  checkAuthController,
  refreshTokensController,
  checkTokenStatusController,
} from "./discord";

const router: Router = Router();

// oauth routes for discord
router.get("/discord", discordAuthController);
router.get("/discord/callback", discordCallbackController);

router.get("/me", getCurrentUserController);
router.get("/status", checkAuthController);
router.get("/token-status", checkTokenStatusController);
router.post("/logout", logoutController);
router.post("/refresh-tokens", refreshTokensController);

// for failure
router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication failed",
  });
});

export default router;
