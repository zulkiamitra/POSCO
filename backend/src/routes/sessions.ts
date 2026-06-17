import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRoles } from "../middleware/authorize";
import {
  createSession,
  deleteSession,
  getSession,
  listSessions,
  updateSession
} from "../controllers/sessionController";

const router = Router();

router.use(requireAuth);
router.get("/", listSessions);
router.get("/:id", getSession);
router.post("/", requireRoles(["admin", "kader"]), createSession);
router.put("/:id", requireRoles(["admin", "kader"]), updateSession);
router.delete("/:id", requireRoles(["admin", "kader"]), deleteSession);

export default router;
