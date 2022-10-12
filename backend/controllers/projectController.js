import Project from "../models/Project.js";
import Task from "../models/Task.js";

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

const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Vemos si el proyecto existe en la bbdd
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error("The project you are looking for does not exist");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You are not allowed to access this project");
      return res.status(403).json({ msg: error.message });
    }

    // Obtener las tareas del Proyecto (para no realizar dos llamados http
    // nos traemos la tarea cuando el proyecto)
    /* const tasks = await Task.find().where("proyect").equals(project._id);
     */
    res.json(project);
  } catch (error) {
    res.status(404).json({ msg: "The id you entered is invalid" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Vemos si el proyecto existe en la bbdd
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error("The project you are looking for does not exist");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("You are not allowed to edit this project");
      return res.status(403).json({ msg: error.message });
    }

    // Actualizar el proyecto
    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.deliveryDate = req.body.deliveryDate || project.deliveryDate;
    project.customer = req.body.customer || project.customer;

    try {
      const storedProject = await project.save();
      res.json(storedProject);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(404).json({ msg: "The id you entered is invalid" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Vemos si el proyecto existe en la bbdd
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error("The project you are looking for does not exist");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("ou are not allowed to delete this project");
      return res.status(403).json({ msg: error.message });
    }

    // Eliminamos el proyecto
    try {
      await project.deleteOne();
      res.json({ msg: "The project has been successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(404).json({ msg: "The id you entered is invalid" });
  }
};

const addPartner = async (req, res) => {};

const deletePartner = async (req, res) => {};

export {
  getProjects,
  newProject,
  getProject,
  editProject,
  deleteProject,
  addPartner,
  deletePartner,
};
