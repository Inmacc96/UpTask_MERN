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

const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Vemos si el proyecto existe en la bbdd
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error("El proyecto que estás buscando no existe");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("No tienes permiso para acceder a este proyecto");
      return res.status(401).json({ msg: error.message });
    }

    res.json(project);
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es válido" });
  }
};

const editProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Vemos si el proyecto existe en la bbdd
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error("El proyecto que estás buscando no existe");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("No tienes permiso para editar este proyecto");
      return res.status(401).json({ msg: error.message });
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
    res.status(404).json({ msg: "El id que ingresaste no es válido" });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    // Vemos si el proyecto existe en la bbdd
    const project = await Project.findById(id);

    if (!project) {
      const error = new Error("El proyecto que estás buscando no existe");
      return res.status(404).json({ msg: error.message });
    }

    if (project.creator.toString() !== req.user._id.toString()) {
      const error = new Error("No tienes permiso para eliminar este proyecto");
      return res.status(401).json({ msg: error.message });
    }

    // Eliminamos el proyecto
    try {
      await project.deleteOne();
      res.json({msg: 'El proyecto ha sido eliminado correctamente'})
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es válido" });
  }
};

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
