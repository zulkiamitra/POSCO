import { Router } from "express";
import { requireAuth } from "../middleware/auth";
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
router.post("/", createSession);
router.put("/:id", updateSession);
router.delete("/:id", deleteSession);

export default router;
