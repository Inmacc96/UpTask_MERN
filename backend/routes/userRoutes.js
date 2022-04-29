import express from "express";
import { createUser, authenticateUser} from "../controllers/userController.js";

const router = express.Router();

// Authentication, Registration and Confirmation of Users

router.post("/", createUser) // Create a new user
router.post("/login", authenticateUser)



export default router;
