import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";

const Project = () => {
    const params = useParams();

    const { id } = params;

    const { getProject } = useProjects();

    useEffect(() => {
        getProject(id)
    }, [])


    return (
        <div>Project</div>
    )
}

export default Project