import FormProject from "../components/FormProject"

const NewProject = () => {
    return (
        <>
            <h1 className="text-4xl font-black"> Create Proyect</h1>

            <div className="mt-10 flex justify-center">
                <FormProject />
            </div>
        </>
    )
}

export default NewProject