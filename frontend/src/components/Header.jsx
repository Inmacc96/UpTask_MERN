import { Link } from "react-router-dom"

const Header = () => {
    return (
        <header className="px-4 py-5 bg-white border-b">
            <div className="md:flex md:justify-between md:items-center">
                <h2 className="text-4xl text-sky-600 font-black">UpTask</h2>

                <input type="search" placeholder="Search Projects" className="lg:w-96 block p-2 border rounded-lg" />
                <div className="flex items-center gap-4">
                    <Link to="/projects" className="font-bold uppercase">Projects</Link>
                    <button type="button" className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold">Log Out</button>
                </div>

            </div>

        </header>
    )
}

export default Header