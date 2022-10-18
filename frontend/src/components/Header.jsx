import { Link } from "react-router-dom"
import useProjects from "../hooks/useProjects"
import ProjectsSearch from "./ProjectsSearch";

const Header = () => {

    const { handleSearcher } = useProjects();

    return (
        <header className="px-4 py-5 bg-white border-b">
            <div className="md:flex md:justify-between md:items-center">
                <h2 className="text-4xl text-sky-600 font-black text-center mb-5 md:mb-0">UpTask</h2>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <button
                        type="button"
                        className="font-bold uppercase"
                        onClick={handleSearcher}>
                        Search Projects
                    </button>
                    <Link to="/projects" className="font-bold uppercase">Projects</Link>
                    <button type="button" className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold">Log Out</button>
                </div>

                <ProjectsSearch />

            </div>

        </header>
    )
}

export default Header