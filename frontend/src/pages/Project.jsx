import { useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Loading from "../components/Loading";

const Project = () => {
    const params = useParams();

    const { id } = params;

    const { getProject, project, loading } = useProjects();

    useEffect(() => {
        getProject(id)
    }, [])

    const { name } = project;

    return (
        loading ? "..."
            :
            <div>
                <h1 className="font-black text-4xl">{name}</h1>
            </div>
    )
}

export default Project