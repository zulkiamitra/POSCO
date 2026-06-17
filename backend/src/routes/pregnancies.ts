import { Router } from "express";
import { requireAuth } from "../middleware/auth";
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
router.post("/", createPregnancy);
router.put("/:id", updatePregnancy);
router.delete("/:id", deletePregnancy);

export default router;
