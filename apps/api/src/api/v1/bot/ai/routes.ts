import { Router } from "express";
import {
  getAISettings,
  createAISettings,
  updateAISettings,
  deleteAISettings,
  addBannedUser,
  removeBannedUser,
  updateRateLimit,
  removeRateLimit,
  updateAllowedChannels,
  updateAllowedRoles,
} from "./controller";
import {
  validateAIConfig,
  validateBannedUser,
  validateRateLimit,
  validateChannelIds,
  validateRoleIds,
  validateUserId,
} from "../../../../validators/aiValidators";

const router: Router = Router();

router.get("/", getAISettings);
router.post("/", validateAIConfig, createAISettings);
router.put("/", validateAIConfig, updateAISettings);
router.delete("/", deleteAISettings);

router.post("/banned-users", validateBannedUser, addBannedUser);
router.delete("/banned-users/:userId", validateUserId, removeBannedUser);

router.post("/rate-limits", validateRateLimit, updateRateLimit);
router.delete("/rate-limits/:userId", validateUserId, removeRateLimit);

router.put("/allowed-channels", validateChannelIds, updateAllowedChannels);
router.put("/allowed-roles", validateRoleIds, updateAllowedRoles);

export default router;
