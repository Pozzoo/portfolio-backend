import express from "express";
import {getSessionUser, loginUser, logoutUser, registerUser} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", authMiddleware, registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", getSessionUser);



export default router;