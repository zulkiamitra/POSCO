import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRoles } from "../middleware/authorize";
import {
  createReferral,
  deleteReferral,
  getReferral,
  listReferrals,
  updateReferral
} from "../controllers/referralController";

const router = Router();

router.use(requireAuth);
router.get("/", listReferrals);
router.get("/:id", getReferral);
router.post("/", requireRoles(["admin", "kader"]), createReferral);
router.put("/:id", requireRoles(["admin", "kader"]), updateReferral);
router.delete("/:id", requireRoles(["admin", "kader"]), deleteReferral);

export default router;
