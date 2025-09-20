import { Router } from "express";
import {
  initiateAuth,
  handleCallback,
  getCurrentUser,
  logout,
  checkAuthStatus,
  refreshTokens,
  checkTokenStatus,
} from "./discord";

const router: Router = Router();

router.get("/discord", initiateAuth);
router.get("/discord/callback", handleCallback);

router.get("/me", getCurrentUser);
router.get("/status", checkAuthStatus);
router.get("/token-status", checkTokenStatus);
router.post("/logout", logout);
router.post("/refresh-tokens", refreshTokens);

router.get("/failure", (req, res) => {
  res.status(401).json({
    success: false,
    message: "Authentication failed",
  });
});

export default router;
