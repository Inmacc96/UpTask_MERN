import { useState } from "react";
import { Link } from "react-router-dom";
import clientAxios from "../config/clientAxios";
import Alert from "../components/Alert";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const [alert, setAlert] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (email === "" || email.length < 6) {
      setAlert({
        msg: "The email address is required",
        error: true
      })
      return
    }

    try {
      const url = `/users/forget-password`;
      const { data } = await clientAxios.post(url, { email })

      setAlert({ msg: data.msg, error: false })

    } catch (err) {
      setAlert({
        msg: err.response.data.msg,
        error: true
      })
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Recover your access and don't lose your {""}{" "}
        <span className="text-slate-700">projects</span>
      </h1>

      {alert.msg && <Alert alert={alert} />}

      <form className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}>
        <div className="my-5">
          <label
            htmlFor="email"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Registration Email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Send Instructions"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded
      hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Already have an account? Log in
        </Link>

        <Link
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
          to="/signup"
        >
          Don't have an account? Sign up
        </Link>
      </nav>
    </>
  )
}

export default ForgetPassword