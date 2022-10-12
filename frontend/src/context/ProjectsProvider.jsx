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
    }

    const submitTask = async task => {
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
            console.log(data)
        } catch (err) {
            console.log(err);
        }
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
                submitTask
            }}>
            {children}
        </ProjectsContext.Provider>
    )
}

export { ProjectsProvider }
export default ProjectsContext