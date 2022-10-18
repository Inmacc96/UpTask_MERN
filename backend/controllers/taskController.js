import Project from "../models/Project.js";
import Task from "../models/Task.js";

const addTask = async (req, res) => {
  const { project } = req.body;

  const existingProject = await Project.findById(project);

  // Verificar que el proyecto existe
  if (!existingProject) {
    const error = Error("The project does not exist");
    return res.status(404).json({ msg: error.message });
  }

  // Verificar que es el creador del proyecto
  if (existingProject.creator.toString() !== req.user._id.toString()) {
    const error = Error("You are not allowed to add a new task");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const storedTask = await Task.create(req.body);
    //Almacenar el ID en el proyecto
    existingProject.tasks.push(storedTask._id);
    await existingProject.save();
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
      const error = Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar que la tarea la ha creado el usuario autenticado
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = Error("You are not allowed to get this task");
      return res.status(403).json({ msg: error.message });
    }

    res.json(task);
  } catch (error) {
    res.status(404).json({ msg: "The id you entered is invalid" });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project");

    // Comprobar que la tarea existe
    if (!task) {
      const error = Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar que la tarea la ha creado el usuario autenticado
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = Error("You are not allowed to update this task");
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
    res.status(404).json({ msg: "The id you entered is invalid" });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id).populate("project");

    // Comprobar que la tarea existe
    if (!task) {
      const error = Error("Task not found");
      return res.status(404).json({ msg: error.message });
    }

    // Comprobar que la tarea la ha creado el usuario autenticado
    if (task.project.creator.toString() !== req.user._id.toString()) {
      const error = Error("You are not allowed to delete this task");
      return res.status(403).json({ msg: error.message });
    }

    // Eliminamos la tarea
    try {
      const project = await Project.findById(task.project._id);
      project.tasks.pull(task._id);
/*       await project.save();
      await task.deleteOne(); */

      // De esta forma inician en paralelo, no van a bloquear una a otro:
      await Promise.allSettled([await project.save(), await task.deleteOne()]);

      res.json({ msg: "The task has been successfully deleted" });
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    res.status(404).json({ msg: "The id you entered is invalid" });
  }
};

const changeStateTask = async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate("project");

  // Comprobar que la tarea existe
  if (!task) {
    const error = Error("Task not found");
    return res.status(404).json({ msg: error.message });
  }

  // El usuario debe ser el creador del proyecto o colabolador
  if (
    task.project.creator.toString() !== req.user._id.toString() &&
    !task.project.partners.some(
      (partner) => partner._id.toString() === req.user._id.toString()
    )
  ) {
    const error = Error("You are not allowed to delete this task");
    return res.status(403).json({ msg: error.message });
  }

  task.state = !task.state;
  await task.save();
  res.json(task);
};

export { addTask, getTask, updateTask, deleteTask, changeStateTask };
