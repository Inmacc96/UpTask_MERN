import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;

  const existingProject = await Project.findById(project);

  // Verificar que el proyecto existe
  if (!existingProject) {
    const error = Error("El proyecto no existe");
    return res.status(404).json({ msg: error.message });
  }

  // Verificar que es el creador del proyecto
  if (existingProject.creator.toString() !== req.user._id.toString()) {
    const error = Error("No tienes permiso para agregar una nueva tarea");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const storedTask = await Task.create(req.body);
    res.json(storedTask);
  } catch (error) {
    console.log(error);
  }
};

const getTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project");
    //con el método populate(), nos vamos a traer los datos del proyecto asociado
    //Es decir, cruza ambos documentos.

    // Comprobar que la tarea existe
    if (!task) {
      const error = Error("Tarea no encontrada");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar que la tarea la ha creado el usuario autenticado
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = Error("No tienes permiso para obtener esta tarea");
      return res.status(403).json({ msg: error.message });
    }

    res.json(task);
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es válido" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project");

    // Comprobar que la tarea existe
    if (!task) {
      const error = Error("Tarea no encontrada");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar que la tarea la ha creado el usuario autenticado
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = Error("No tienes permiso para actualizar esta tarea");
      return res.status(403).json({ msg: error.message });
    }
    task.name = req.body.name || task.name;
    task.description = req.body.description || task.description;
    task.deliveryDate = req.body.deliveryDate || task.deliveryDate;
    task.priority = req.body.priority || task.priority;

    try {
      const storedTask = await task.save();
      res.json(storedTask);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es válido" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project");

    // Comprobar que la tarea existe
    if (!task) {
      const error = Error("Tarea no encontrada");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar que la tarea la ha creado el usuario autenticado
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = Error("No tienes permiso para eliminar esta tarea");
      return res.status(403).json({ msg: error.message });
    }

    // Eliminamos la tarea
    try {
      await task.deleteOne();
      res.json({ msg: "La tarea ha sido eliminado correctamente" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(404).json({ msg: "El id que ingresaste no es válido" });
  }
};

const changeStateTask = async (req, res) => {};

export { addTask, getTask, updateTask, deleteTask, changeStateTask };
