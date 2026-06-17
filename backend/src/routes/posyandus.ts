import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRoles } from "../middleware/authorize";
import {
  createPosyandu,
  deletePosyandu,
  getPosyandu,
  listPosyandus,
  updatePosyandu
} from "../controllers/posyanduController";

const router = Router();

router.use(requireAuth);
router.get("/", listPosyandus);
router.get("/:id", getPosyandu);
router.post("/", requireRoles(["admin"]), createPosyandu);
router.put("/:id", requireRoles(["admin"]), updatePosyandu);
router.delete("/:id", requireRoles(["admin"]), deletePosyandu);

export default router;
