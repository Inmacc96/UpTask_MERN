import { Children } from "react";
import useProjects from "../hooks/useProjects"

const Projects = () => {
    const { projects } = useProjects();

    return (
        <>
            <h1 className="text-4xl font-black">Projects</h1>

            <div className="bg-white shadow mt-10 rounded-lg p-5">
                {projects.length ?
                    <p>There are projects</p> :
                    <p className=" text-center text-gray-600 uppercase">
                        No projects yet
                    </p>}
            </div>
        </>
    )
}

export default Projects