import { useState, useEffect, createContext } from "react";
import clientAxios from "../config/clientAxios";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import io from "socket.io-client";

let socket;

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {

    const [projects, setProjects] = useState([]);
    const [alert, setAlert] = useState({})
    const [project, setProject] = useState({})
    const [loading, setLoading] = useState(false)
    const [modalFormTasks, setModalFormTasks] = useState(false)
    const [task, setTask] = useState({})
    const [modalDeleteTask, setModalDeleteTask] = useState(false)
    const [partner, setPartner] = useState({})
    const [modalDeletePartner, setModalDeletePartner] = useState(false)
    const [searcher, setSearcher] = useState(false)


    const navigate = useNavigate();
    const { auth } = useAuth()

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
    }, [auth])

    // Se va a encargar de abrir la conexion hacia socket io.
    // Se ejecuta UNA SOLA VEZ
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
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
            setAlert({})
        } catch (err) {
            navigate("/projects")
            setAlert({
                msg: err.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlert({})
            }, 3000)
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

            setAlert({})
            setModalFormTasks(false)

            // Socket io
            socket.emit("edit task", data)
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

            setAlert({})
            setModalFormTasks(false)

            // SOCKET IO
            socket.emit("new task", data)
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

            setModalDeleteTask(false)

            // Socket IO
            socket.emit("delete task", task)

            setTask({})

            setTimeout(() => {
                setAlert({})
            }, 3000)
        } catch (err) {
            console.log(err);
        }
    }

    const submitPartner = async email => {
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

            const { data } = await clientAxios.post("/projects/partners", { email }, config)

            setPartner(data)
            setAlert({})

        } catch (err) {
            setAlert({
                msg: err.response.data.msg,
                error: true
            });
        } finally {
            setLoading(false)
        }
    }

    const addPartner = async (email) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.post(`/projects/partners/${project._id}`, email, config)

            setAlert({
                msg: data.msg,
                error: false
            })
            setPartner({})
            setTimeout(() => {
                setAlert({})
            }, 3000)
        } catch (err) {
            setAlert({
                msg: err.response.data.msg,
                error: true
            })
        }
    }

    const handleModalDeletePartner = (partner) => {
        setModalDeletePartner(!modalDeletePartner)
        setPartner(partner);
    }

    const deletePartner = async () => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.post(`/projects/delete-partner/${project._id}`, { id: partner._id }, config)

            const updatedProject = { ...project }
            updatedProject.partners = updatedProject.partners.filter(partnerState => partnerState._id !== partner._id)
            setProject(updatedProject)

            setAlert({
                msg: data.msg,
                error: false
            })
            setPartner({})
            setModalDeletePartner(false)

            setTimeout(() => {
                setAlert({})
            }, 3000)

        } catch (err) {
            console.log(err);
        }
    }

    const completeTask = async id => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clientAxios.post(`/tasks/state/${id}`, {}, config)

            setTask({})
            setAlert({})

            // Socket IO
            socket.emit("change task state", data)

        } catch (err) {
            console.log(err.response)
        }
    }

    const handleSearcher = () => {
        setSearcher(!searcher)
    }

    // Socket IO
    const submitTaskProject = (task) => {
        // Socket IO va a progragar la tarea a todos los usuarios que estén en el room

        // Agregar la tarea al state project
        const updatedProject = { ...project }
        updatedProject.tasks = [...updatedProject.tasks, task]
        setProject(updatedProject)
    }

    const deleteTaskProject = task => {
        // Eliminar la tarea del state project
        const updatedProject = { ...project }
        updatedProject.tasks = updatedProject.tasks.filter(taskState => taskState._id !== task._id)
        setProject(updatedProject)
    }

    const editTaskProject = task => {
        //Actualizar el estado project
        const updatedProject = { ...project }
        updatedProject.tasks = updatedProject.tasks.map(taskState => taskState._id === task._id ? task : taskState)
        setProject(updatedProject)
    }

    const updateStateTaskProject = task => {
        const updatedProject = { ...project }
        updatedProject.tasks = updatedProject.tasks.map(taskState =>
            taskState._id == task._id ? task : taskState)
        setProject(updatedProject)
    }

    const logOutProjects = () => {
        setProjects([])
        setProject({})
        setAlert({})
        setTask({})
        setPartner({})
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
                submitPartner,
                partner,
                addPartner,
                modalDeletePartner,
                handleModalDeletePartner,
                deletePartner,
                completeTask,
                searcher,
                handleSearcher,
                submitTaskProject,
                deleteTaskProject,
                editTaskProject,
                updateStateTaskProject,
                logOutProjects
            }}>
            {children}
        </ProjectsContext.Provider>
    )
}

export { ProjectsProvider }
export default ProjectsContext