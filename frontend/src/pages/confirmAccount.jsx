import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import clientAxios from "../config/clientAxios";
import Alert from "../components/Alert";

const ConfirmAccount = () => {

  const params = useParams();
  const { token } = params;

  const [alert, setAlert] = useState({})
  const [confirmedAccount, setConfirmedAccount] = useState(false)

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `/users/confirm/${token}`
        const { data } = await clientAxios(url);

        setAlert({
          msg: data.msg,
          error: false
        })

        setConfirmedAccount(true)

      } catch (err) {
        console.log(err);
        setAlert({
          msg: err.response.data.msg,
          error: true
        })
      }

    }

    confirmAccount()
  }, [])

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">
        Confirm your account and start creating your {""}{" "}
        <span className="text-slate-700">projects</span>
      </h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {alert.msg && <Alert alert={alert} />}

        {confirmedAccount && (
          <Link
            className=" block text-center my-5 text-slate-500 uppercase text-sm"
            to="/"
          >
            Log in
          </Link>
        )}
      </div>
    </>
  )
}

export default ConfirmAccount