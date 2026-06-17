import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { createUser, deleteUser, getUser, listUsers, updateUser } from "../controllers/userController";

const router = Router();

router.use(requireAuth);
router.get("/", listUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
