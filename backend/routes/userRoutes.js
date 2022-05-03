import express from "express";
import { createUser, authenticateUser, confirmUser} from "../controllers/userController.js";

const router = express.Router();

// Authentication, Registration and Confirmation of Users

router.post("/", createUser) // Create a new user
router.post("/login", authenticateUser)
router.get("/confirm/:token", confirmUser)
// Con :, generamos routing dinámico con express



export default router;
