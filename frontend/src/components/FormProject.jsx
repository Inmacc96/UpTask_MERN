import { useState, useEffect } from "react"
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Alert from "./Alert";

const FormProject = () => {
    const [id, setId] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [deliveryDate, setDeliveryDate] = useState("");
    const [customer, setCustomer] = useState("");

    const params = useParams();

    const { showAlert, alert, submitProject, project } = useProjects();

    useEffect(() => {
        if (params.id) {
            // En este caso, estamos editando, entonces actualizamos los estados del formulario con los campos del proyecto
            setId(project._id)
            setName(project.name)
            setDescription(project.description)
            setDeliveryDate(project.deliveryDate?.split("T")[0])
            setCustomer(project.customer)
        }
    }, [params])

    const handleSubmit = async e => {
        e.preventDefault();

        if ([name, description, deliveryDate, customer].includes("")) {
            showAlert({
                msg: "All fields are required",
                error: true
            })

            return
        }

        // Send data to provider
        await submitProject({ id, name, description, deliveryDate, customer })

        //Reset all states
        setId(null)
        setName("")
        setDescription("")
        setDeliveryDate("")
        setCustomer("")

    }

    return (

        <form className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow"
            onSubmit={handleSubmit}>

            {alert.msg && <Alert alert={alert} />}

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="name">
                    Project Name
                </label>

                <input
                    id="name"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Project Name"
                    value={name}
                    onChange={e => setName(e.target.value)} />
            </div>

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="description">
                    Description
                </label>

                <textarea
                    id="description"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Project Description"
                    value={description}
                    onChange={e => setDescription(e.target.value)} />
            </div>

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="delivery-date">
                    Delivery Date
                </label>

                <input
                    id="delivery-date"
                    type="date"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    value={deliveryDate}
                    onChange={e => setDeliveryDate(e.target.value)} />
            </div>

            <div className="mb-5">
                <label
                    className="text-gray-700 uppercase font-bold text-sm"
                    htmlFor="customer-name">
                    Customer Name
                </label>

                <input
                    id="customer-name"
                    type="text"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Project Name"
                    value={customer}
                    onChange={e => setCustomer(e.target.value)} />
            </div>

            <input
                type="submit"
                value={id ? "Update project" : "Create project"}
                className="bg-sky-600 w-full p-3 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors" />

        </form>

    )
}

export default FormProject