import express from "express";
import {
  loginUser,
  registerUser,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
router.get("/", getAllUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
