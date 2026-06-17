import { Router } from "express";
import { requireAuth } from "../middleware/auth";
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
router.post("/", createReferral);
router.put("/:id", updateReferral);
router.delete("/:id", deleteReferral);

export default router;
