import FormPartner from "../components/FormPartner"

const NewPartner = () => {
    return (
        <>
            <h1 className="text-4xl font-black">Add Partner</h1>

            <div className="mt-10 flex justify-center">
                <FormPartner />
            </div>
        </>
    )
}

export default NewPartner