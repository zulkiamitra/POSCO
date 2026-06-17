import { Router } from "express";
import { login, me, register, forgotPassword, verifyResetCode, resetPassword } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-code", verifyResetCode);
router.post("/reset-password", resetPassword);
router.get("/me", requireAuth, me);

export default router;
