import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRoles } from "../middleware/authorize";
import {
  createPregnancy,
  deletePregnancy,
  getPregnancy,
  listPregnancies,
  updatePregnancy
} from "../controllers/pregnancyController";

const router = Router();

router.use(requireAuth);
router.get("/", listPregnancies);
router.get("/:id", getPregnancy);
router.post("/", requireRoles(["admin", "kader"]), createPregnancy);
router.put("/:id", requireRoles(["admin", "kader"]), updatePregnancy);
router.delete("/:id", requireRoles(["admin", "kader"]), deletePregnancy);

export default router;
