import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { requireRoles } from "../middleware/authorize";
import { createUser, deleteUser, getUser, listUsers, updateUser } from "../controllers/userController";

const router = Router();

router.use(requireAuth);
router.get("/", requireRoles(["admin", "kader", "verifikator"]), listUsers);
router.get("/:id", requireRoles(["admin", "kader", "verifikator"]), getUser);
router.post("/", requireRoles(["admin"]), createUser);
router.put("/:id", updateUser);
router.delete("/:id", requireRoles(["admin", "verifikator"]), deleteUser);

export default router;
