import { useState, useEffect, createContext } from "react";
import clientAxios from "../config/clientAxios";
import { useNavigate } from "react-router-dom"

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {

    const [projects, setProjects] = useState([]);
    const [alert, setAlert] = useState({})
    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(false)
    const [modalFormTasks, setModalFormTasks] = useState(false)
    const [task, setTask] = useState({})
    const [modalDeleteTask, setModalDeleteTask] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        const getProjects = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) return

                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }

                const { data } = await clientAxios("/projects", config)
                setProjects(data)

            } catch (err) {
                console.log(err);
            }
        }
        getProjects();
    }, [])

    const showAlert = alert => {
        setAlert(alert)

        setTimeout(() => {
            setAlert({})
        }, 5000)
    }

    const submitProject = async project => {
        if (project.id) {
            await editProject(project)
        } else {
            await newProject(project)
        }
    }

    const editProject = async project => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.put(`/projects/${project.id}`, project, config)

            // Sincronizar el state
            const updatedProjects = projects.map(project => (project._id === data._id) ? data : project)
            setProjects(updatedProjects)

            // Mostrar la alerta
            setAlert({
                msg: "Project successfully updated",
                error: false
            })

            setTimeout(() => {
                setAlert({})
                navigate("/projects")
            }, 3000)

        } catch (err) {
            console.log(err)
        }
    }

    const newProject = async project => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.post("/projects", project, config)

            setProjects([...projects, data])

            setAlert({
                msg: "Project successfully created",
                error: false
            })

            setTimeout(() => {
                setAlert({})
                navigate("/projects")
            }, 3000)
        } catch (err) {
            console.log(err)
        }
    }

    const getProject = async id => {
        setLoading(true)
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios(`/projects/${id}`, config)
            setProject(data);


        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const deleteProject = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.delete(`/projects/${id}`, config)

            // Sincronizar el state
            const updatedProjects = projects.filter(project => (project._id !== id))
            setProjects(updatedProjects)

            setAlert({
                msg: data.msg,
                error: false
            })

            setTimeout(() => {
                setAlert({})
                navigate("/projects")
            }, 3000)


        } catch (err) {
            console.log(err);
        }
    }

    const handleModalTask = () => {
        setModalFormTasks(!modalFormTasks)
        setTask({})
    }

    const submitTask = async task => {

        if (task?.id) {
            await editTask(task)
        } else {
            await newTask(task)
        }
    }

    const editTask = async (task) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.put(`/tasks/${task.id}`, task, config)

            //Actualizar el estado project
            const updatedProject = { ...project }
            updatedProject.tasks = updatedProject.tasks.map(task => task._id === data._id ? data : task)
            setProject(updatedProject)

            setAlert({})
            setModalFormTasks(false)
        } catch (err) {
            console.log(err);
        }
    }

    const newTask = async (task) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.post("/tasks", task, config)

            // Agregar la tarea al state project
            const updatedProject = { ...project }
            updatedProject.tasks = [...project.tasks, data]
            setProject(updatedProject)

            setAlert({})
            setModalFormTasks(false)
        } catch (err) {
            console.log(err);
        }
    }

    const handleModalEditTask = task => {
        setTask(task)
        setModalFormTasks(true)
    }

    const handleModalDeleteTask = task => {
        setTask(task)
        setModalDeleteTask(!modalDeleteTask)
    }

    const deleteTask = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.delete(`/tasks/${task._id}`, config)
            setAlert({
                msg: data.msg,
                error: false
            })

            // Eliminar la tarea del state project
            const updatedProject = { ...project }
            updatedProject.tasks = updatedProject.tasks.filter(taskState => taskState._id !== task._id)
            setProject(updatedProject)

            setModalDeleteTask(false)
            setTask({})

            setTimeout(() => {
                setAlert({})
            }, 3000)
        } catch (err) {
            console.log(err);
        }
    }

    const submitPartner = async email => {
        console.log(email);
    }

    return (
        <ProjectsContext.Provider
            value={{
                projects,
                showAlert,
                alert,
                submitProject,
                getProject,
                project,
                loading,
                deleteProject,
                modalFormTasks,
                handleModalTask,
                submitTask,
                handleModalEditTask,
                task,
                modalDeleteTask,
                handleModalDeleteTask,
                deleteTask,
                submitPartner
            }}>
            {children}
        </ProjectsContext.Provider>
    )
}

export { ProjectsProvider }
export default ProjectsContext