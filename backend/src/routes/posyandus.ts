import { Router } from "express";
import { requireAuth } from "../middleware/auth";
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
router.post("/", createPosyandu);
router.put("/:id", updatePosyandu);
router.delete("/:id", deletePosyandu);

export default router;
