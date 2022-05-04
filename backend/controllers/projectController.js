import Project from "../models/Project.js";

const getProjects = async (req, res) => {
  const projects = await Project.find().where("creator").equals(req.user);

  res.json(projects);
};

const newProject = async (req, res) => {
  const project = new Project(req.body);
  project.creator = req.user._id;

  try {
    const projectStored = await project.save();
    res.json(projectStored);
  } catch (error) {
    console.log(error);
  }
};

const getProject = async (req, res) => {};

const editProject = async (req, res) => {};

const deleteProject = async (req, res) => {};

const addPartner = async (req, res) => {};

const deletePartner = async (req, res) => {};

const getTasks = async (req, res) => {};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addPartner,
  deletePartner,
  getTasks,
};
