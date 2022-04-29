import express from "express";
import { createUser} from "../controllers/userController.js";

const router = express.Router();

// Authentication, Registration and Confirmation of Users

router.post("/", createUser) // Create a new user



export default router;
