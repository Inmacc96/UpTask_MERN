import { useEffect } from "react"
import { useParams } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import FormPartner from "../components/FormPartner"
import Alert from "../components/Alert"

const NewPartner = () => {
    const params = useParams();
    const { id } = params

    const { getProject, project, loading, partner, addPartner, alert } = useProjects();

    useEffect(() => {
        getProject(id)
    }, [])

    const { name } = project;

    /* if (loading) return "Loading..." */

    if (!project?._id) return <Alert alert={alert} />

    return (
        <>
            <h1 className="text-4xl font-black">Add Partner to the project: {name}</h1>

            <div className="mt-10 flex justify-center">
                <FormPartner />
            </div>

            {loading ? <p className="text-center">Loading...</p> : partner?._id && (
                <div className="flex justify-center mt-10">
                    <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
                        <h2 className="text-center mb-10 text-2xl font-bold">Result:</h2>

                        <div className="flex justify-between items-center">
                            <p>{partner.name}</p>

                            <button
                                type="button"
                                className="bg-slate-500 px-5 py-2 rounded-lg uppercase text-white text-sm font-bold"
                                onClick={() => addPartner({ email: partner.email })}>
                                Add to project
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    )
}

export default NewPartner