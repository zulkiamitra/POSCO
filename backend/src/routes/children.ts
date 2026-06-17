import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRoles } from "../middleware/authorize";
import {
  createChild,
  deleteChild,
  getChild,
  listChildren,
  updateChild
} from "../controllers/childController";

const router = Router();

router.use(requireAuth);
router.get("/", listChildren);
router.get("/:id", getChild);
router.post("/", createChild);
router.put("/:id", updateChild);
router.delete("/:id", deleteChild);

export default router;
