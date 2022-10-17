import express from "express";
import {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  searchPartner,
  addPartner,
  deletePartner,
} from "../controllers/projectController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.route("/").get(checkAuth, getProjects).post(checkAuth, newProject);

router
  .route("/:id")
  .get(checkAuth, getProject)
  .put(checkAuth, editProject)
  .delete(checkAuth, deleteProject);

router.post("/partners", checkAuth, searchPartner);
router.post("/partners/:id", checkAuth, addPartner);
router.post("/delete-partner/:id", checkAuth, deletePartner);

export default router;
