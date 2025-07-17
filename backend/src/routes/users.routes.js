import { Router } from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/login", loginUser);
router.post("/", registerUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
