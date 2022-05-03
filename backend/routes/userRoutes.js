import express from "express";
import {
  createUser,
  authenticateUser,
  confirmUser,
  forgetPassword,
  validateToken,
  newPassword,
} from "../controllers/userController.js";

const router = express.Router();

// Authentication, Registration and Confirmation of Users

router.post("/", createUser); // Create a new user
router.post("/login", authenticateUser);
router.get("/confirm/:token", confirmUser); // Con :, generamos routing dinámico con express
router.post("/forget-password", forgetPassword);
router.route("/forget-password/:token").get(validateToken).post(newPassword);

export default router;
