import { useState, useEffect, createContext } from "react";
import clientAxios from "../config/clientAxios";
import { useNavigate } from "react-router-dom"

const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {

    const [projects, setProjects] = useState([]);
    const [alert, setAlert] = useState({})

    const navigate = useNavigate();

    const showAlert = alert => {
        setAlert(alert)

        setTimeout(() => {
            setAlert({})
        }, 5000)
    }

    const submitProject = async project => {
        try {
            const token = localStorage.getItem("token")
            if (!token) return

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            await clientAxios.post("/projects", project, config)

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

    return (
        <ProjectsContext.Provider value={{ projects, showAlert, alert, submitProject }}>
            {children}
        </ProjectsContext.Provider>
    )
}

export { ProjectsProvider }
export default ProjectsContext