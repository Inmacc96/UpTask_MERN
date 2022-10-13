import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import FormPartner from "../components/FormPartner"

const NewPartner = () => {
    const params = useParams();
    const { id } = params

    const { getProject, project, loading } = useProjects();

    useEffect(() => {
        getProject(id)
    }, [])

    const { name } = project;

    if (loading) return "Loading..."

    return (
        <>
            <h1 className="text-4xl font-black">Add Partner to the project: {name}</h1>

            <div className="mt-10 flex justify-center">
                <FormPartner />
            </div>
        </>
    )
}

export default NewPartner