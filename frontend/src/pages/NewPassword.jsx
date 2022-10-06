import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Alert from "../components/Alert";

const NewPassword = () => {

  const params = useParams();
  const { token } = params;

  const [isValidToken, setIsValidToken] = useState(false)
  const [alert, setAlert] = useState({});
  const [password, setPassword] = useState("");
  const [isModifiedPassword, setIsModifiedPassword] = useState(false)

  useEffect(() => {
    const validateToken = async () => {
      try {
        // TODO: Mover hacia un cliente axios
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/users/forget-password/${token}`
        await axios(url);
        setIsValidToken(true)
      }
      catch (err) {
        setAlert({
          msg: err.response.data.msg,
          error: true
        })
      }
    }
    validateToken();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validation
    if (password.length < 6) {
      setAlert({
        msg: "Password must contain at least 6 characters",
        error: true
      })
      return
    }

    try {
      // TODO: Mover hacia un cliente axios
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/users/forget-password/${token}`
      const { data } = await axios.post(url, { password });
      setAlert({
        msg: data.msg,
        error: false
      })
      setIsModifiedPassword(true)
    }
    catch (err) {
      setAlert({
        msg: err.response.data.msg,
        error: true
      })
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Reset your password and don't lose access to your {""}{" "}
        <span className="text-slate-700">projects</span>
      </h1>

      {alert.msg && <Alert alert={alert} />}

      {isValidToken && (<form className="my-10 bg-white shadow rounded-lg p-10" onSubmit={handleSubmit}>
        <div className="my-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-600 block text-xl font-bold"
          >
            New Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Write your New Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Save new password"
          className="bg-sky-700 mb-5 w-full py-3 text-white uppercase font-bold rounded
      hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>)}

      {isModifiedPassword && (
        <Link
          className=" block text-center my-5 text-slate-500 uppercase text-sm"
          to="/"
        >
          Log in
        </Link>
      )}
    </>
  )
}

export default NewPassword